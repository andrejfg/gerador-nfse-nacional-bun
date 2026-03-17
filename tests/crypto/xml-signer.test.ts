import { describe, test, expect } from 'bun:test'
import { compressXml, decompressXml, signXml } from '../../src/crypto/xml-signer.js'
import type { CertificateInfo } from '../../src/crypto/certificate.js'

// Cert mínimo para testar guards (os throws ocorrem antes do uso real do cert)
const FAKE_CERT: CertificateInfo = {
  privateKeyPem: '---fake---',
  certificatePem: '---fake---',
  certificateClean: 'fakecert',
}

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?><DPS xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00"><infDPS Id="DPS31062001531936080001460010100000000000001"><tpAmb>2</tpAmb><CNPJ>53193608000146</CNPJ></infDPS></DPS>`

describe('compressXml', () => {
  test('retorna string não vazia', async () => {
    const result = await compressXml(SAMPLE_XML)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  test('retorna base64 válido', async () => {
    const result = await compressXml(SAMPLE_XML)
    expect(result).toMatch(/^[A-Za-z0-9+/]+=*$/)
  })

  test('produz tamanho menor para XML longo e repetitivo', async () => {
    const large = SAMPLE_XML.repeat(50)
    const compressed = await compressXml(large)
    const bytes = Buffer.from(compressed, 'base64').length
    expect(bytes).toBeLessThan(large.length)
  })

  test('comprime string vazia sem erro', async () => {
    const result = await compressXml('')
    expect(typeof result).toBe('string')
  })
})

describe('decompressXml', () => {
  test('recupera o XML original com exatidão', async () => {
    const compressed = await compressXml(SAMPLE_XML)
    expect(await decompressXml(compressed)).toBe(SAMPLE_XML)
  })

  test('ciclo compress → decompress é idempotente', async () => {
    const b64    = await compressXml(SAMPLE_XML)
    const xml    = await decompressXml(b64)
    const b64_2  = await compressXml(xml)
    const xml_2  = await decompressXml(b64_2)
    expect(xml_2).toBe(SAMPLE_XML)
  })

  test('preserva caracteres UTF-8 e acentuação brasileira', async () => {
    const xml = `<servico>Prestação de serviços de TI — desenvolvimento ágil</servico>`
    expect(await decompressXml(await compressXml(xml))).toBe(xml)
  })

  test('preserva string vazia no ciclo', async () => {
    expect(await decompressXml(await compressXml(''))).toBe('')
  })
})

// ---------------------------------------------------------------------------
// signXml — guards de validação
// Espelhado de nfse-php/tests/Unit/Signer/XmlSignerEdgeCasesTest.php
// ---------------------------------------------------------------------------

describe('signXml — guards', () => {
  test('lança erro quando conteúdo XML está vazio', () => {
    expect(() => signXml('', 'infDPS', FAKE_CERT)).toThrow('Conteúdo XML vazio.')
  })

  test('lança erro quando tag não existe no XML', () => {
    const xml = '<DPS></DPS>'
    expect(() => signXml(xml, 'infDPS', FAKE_CERT)).toThrow(
      'Tag infDPS não encontrada para assinatura.',
    )
  })

  test('lança erro quando atributo Id está ausente na tag', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<DPS xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00">
  <infDPS><tpAmb>2</tpAmb></infDPS>
</DPS>`
    expect(() => signXml(xml, 'infDPS', FAKE_CERT)).toThrow(
      "Tag a ser assinada deve possuir um atributo 'Id'.",
    )
  })

  test('lança erro quando atributo Id está presente mas vazio', () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<DPS xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00">
  <infDPS Id=""><tpAmb>2</tpAmb></infDPS>
</DPS>`
    expect(() => signXml(xml, 'infDPS', FAKE_CERT)).toThrow(
      "Tag a ser assinada deve possuir um atributo 'Id'.",
    )
  })
})

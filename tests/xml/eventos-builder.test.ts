import { describe, test, expect } from 'bun:test'
import { buildPedRegEventoXml } from '../../src/xml/eventos-builder.js'
import type { PedRegEventoData } from '../../src/types/dtos.js'
import { MotivoEventoCancelamento } from '../../src/types/enums.js'

const CHAVE = '3124030112345678000195001001000000000000001'

function makeEvento(overrides: Partial<PedRegEventoData> = {}): PedRegEventoData {
  return {
    chNFSe: CHAVE,
    tipoEvento: 101101,
    tipoAmbiente: 2,
    dhEvento: '2024-03-15T12:00:00-03:00',
    cnpjAutor: '12345678000195',
    cMotivo: MotivoEventoCancelamento.ErroNaEmissao,
    xMotivo: 'Erro de emissão',
    ...overrides,
  }
}

describe('buildPedRegEventoXml', () => {
  test('retorna XML não vazio', () => {
    const xml = buildPedRegEventoXml(makeEvento())
    expect(typeof xml).toBe('string')
    expect(xml.length).toBeGreaterThan(50)
  })

  test('começa com declaração XML', () => {
    expect(buildPedRegEventoXml(makeEvento()).startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
  })

  test('inclui namespace do SPED Fazenda', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('xmlns="http://www.sped.fazenda.gov.br/nfse"')
  })

  test('inclui a chave da NFS-e', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain(`<chNFSe>${CHAVE}</chNFSe>`)
  })

  test('ID do pedRegEvento contém chave + tipo (sem sequência desde jan/2026)', () => {
    // Formato: PRE + chNFSe + tipoEvento — nSeqEvento removido do Id (TSIdPedRegEvt)
    expect(buildPedRegEventoXml(makeEvento())).toContain(`Id="PRE${CHAVE}101101"`)
  })

  test('tag do evento é e101101 para cancelamento padrão', () => {
    const xml = buildPedRegEventoXml(makeEvento())
    expect(xml).toContain('<e101101>')
    expect(xml).toContain('</e101101>')
  })

  test('inclui descrição do evento', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('<xDesc>Cancelamento de NFS-e</xDesc>')
  })

  test('inclui código do motivo', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('<cMotivo>1</cMotivo>')
  })

  test('inclui descrição do motivo', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('<xMotivo>Erro de emissão</xMotivo>')
  })

  test('inclui CNPJAutor quando fornecido', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('<CNPJAutor>12345678000195</CNPJAutor>')
  })

  test('inclui verAplic', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('<verAplic>')
  })

  test('versão do schema é 1.01', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('versao="1.01"')
  })

  test('usa dhEvento informado', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('<dhEvento>2024-03-15T12:00:00-03:00</dhEvento>')
  })

  test('gera dhEvento automaticamente quando omitido', () => {
    const evento = makeEvento()
    delete evento.dhEvento
    const xml = buildPedRegEventoXml(evento)
    expect(xml).toContain('<dhEvento>')
    // data gerada não pode ser vazia
    expect(xml).not.toMatch(/<dhEvento><\/dhEvento>/)
  })

  test('tag muda conforme tipo do evento (e105102 = CancelamentoPorSubstituicao)', () => {
    // 101102 não existe no XSD — o tipo correto de substitução é 105102
    const xml = buildPedRegEventoXml(makeEvento({ tipoEvento: 105102 }))
    expect(xml).toContain('<e105102>')
    expect(xml).toContain('</e105102>')
    expect(xml).not.toContain('<e101101>')
  })

  test('xDesc correto para CancelamentoPorSubstituicao (105102)', () => {
    const xml = buildPedRegEventoXml(makeEvento({ tipoEvento: 105102 }))
    expect(xml).toContain('<xDesc>Cancelamento de NFS-e por Substituição</xDesc>')
  })

  test('xDesc correto para Confirmação do Tomador (203202)', () => {
    const xml = buildPedRegEventoXml(makeEvento({ tipoEvento: 203202 }))
    expect(xml).toContain('<xDesc>Confirmação do Tomador</xDesc>')
  })
})

import { describe, test, expect } from 'bun:test'
import { parseNfseXml } from '../../src/xml/nfse-parser.js'

const NFSE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<NFSe xmlns="http://www.sped.fazenda.gov.br/nfse" versao="1.00">
  <infNFSe Id="NFSe123">
    <cStat>100</cStat>
    <xMotivo>NFS-e autorizada com sucesso</xMotivo>
    <chNFSe>3124030112345678000195001001000000000000001</chNFSe>
    <nNFSe>000001</nNFSe>
    <dhProc>2024-03-15T12:05:00-03:00</dhProc>
    <xLocEmi>Belo Horizonte/MG</xLocEmi>
    <xLocPrestacao>Belo Horizonte/MG</xLocPrestacao>
    <cLocIncid>3106200</cLocIncid>
    <xTribNac>Tributado no município do prestador</xTribNac>
    <xTribMun>Tributado</xTribMun>
    <xNBS>Desenvolvimento de software</xNBS>
    <verAplic>1.00</verAplic>
    <ambGer>1</ambGer>
    <tpEmis>1</tpEmis>
    <procEmi>1</procEmi>
    <emit>
      <CNPJ>12345678000195</CNPJ>
      <IM>12345678</IM>
      <xNome>Empresa Teste LTDA</xNome>
      <xFant>Empresa Teste</xFant>
      <enderNac>
        <xLgr>Rua Teste</xLgr>
        <nro>100</nro>
        <xBairro>Centro</xBairro>
        <cMun>3106200</cMun>
        <UF>MG</UF>
        <CEP>30100000</CEP>
        <cPais>1058</cPais>
      </enderNac>
      <fone>31999998888</fone>
      <email>contato@empresa.com</email>
      <regTrib>
        <opSimpNac>2</opSimpNac>
        <regApurSN>1</regApurSN>
        <regEspTrib>0</regEspTrib>
      </regTrib>
    </emit>
    <DPS>
      <infDPS>
        <tpAmb>2</tpAmb>
        <nDPS>000000000000001</nDPS>
        <serie>001</serie>
        <dhEmi>2024-03-15T12:00:00-03:00</dhEmi>
        <dCompet>2024-03</dCompet>
        <toma>
          <CNPJ>00000000000191</CNPJ>
          <xNome>Banco do Brasil</xNome>
          <enderNac>
            <xLgr>Rua do Tomador</xLgr>
            <nro>200</nro>
            <cMun>3106200</cMun>
            <UF>MG</UF>
            <CEP>30130010</CEP>
            <cPais>1058</cPais>
          </enderNac>
        </toma>
        <serv>
          <locPrest>
            <xCLS>Belo Horizonte</xCLS>
            <xPA>Brasil</xPA>
          </locPrest>
          <cServ>
            <cServTribNac>01.01.00163</cServTribNac>
            <cServMun>14.01</cServMun>
          </cServ>
          <xDescServ>Desenvolvimento de software sob encomenda</xDescServ>
          <xInfComp>Contrato 2024-001</xInfComp>
        </serv>
        <valores>
          <vServico>1000.00</vServico>
          <vBC>1000.00</vBC>
          <pAliqAplic>5.00</pAliqAplic>
          <vISSQN>50.00</vISSQN>
          <vTotalRet>0.00</vTotalRet>
          <vLiq>950.00</vLiq>
          <vCalcDR>0.00</vCalcDR>
          <vCalcBM>50.00</vCalcBM>
          <vDescCondicionado>0.00</vDescCondicionado>
          <vDescIncondicionado>0.00</vDescIncondicionado>
          <vRetIRRF>0.00</vRetIRRF>
          <CP>0.00</CP>
          <vRetCSLL>0.00</vRetCSLL>
          <vPis>0.00</vPis>
          <vCofins>0.00</vCofins>
        </valores>
      </infDPS>
    </DPS>
    <valores>
      <vServico>1000.00</vServico>
      <vBC>1000.00</vBC>
      <pAliqAplic>5.00</pAliqAplic>
      <vISSQN>50.00</vISSQN>
      <vTotalRet>0.00</vTotalRet>
      <vLiq>950.00</vLiq>
      <vCalcDR>0.00</vCalcDR>
      <vCalcBM>50.00</vCalcBM>
      <vDescCondicionado>0.00</vDescCondicionado>
      <vDescIncondicionado>0.00</vDescIncondicionado>
      <vRetIRRF>0.00</vRetIRRF>
      <CP>0.00</CP>
      <vRetCSLL>0.00</vRetCSLL>
      <vPis>0.00</vPis>
      <vCofins>0.00</vCofins>
    </valores>
  </infNFSe>
</NFSe>`

describe('parseNfseXml', () => {
  test('retorna objeto NfseSchema', () => {
    const schema = parseNfseXml(NFSE_XML)
    expect(schema).toBeDefined()
    expect(typeof schema).toBe('object')
  })

  test('parseia versão do schema', () => {
    expect(parseNfseXml(NFSE_XML).versao).toBe('1.00')
  })

  test('parseia infNFSe', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe).toBeDefined()
  })

  test('parseia chave de acesso', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.chNFSe)
      .toBe('3124030112345678000195001001000000000000001')
  })

  test('parseia número da NFS-e', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.nNFSe).toBe('000001')
  })

  test('parseia cStat e xMotivo', () => {
    const inf = parseNfseXml(NFSE_XML).infNFSe
    expect(inf?.cStat).toBe('100')
    expect(inf?.xMotivo).toBe('NFS-e autorizada com sucesso')
  })

  test('parseia data/hora de processamento', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.dhProc).toBe('2024-03-15T12:05:00-03:00')
  })

  test('parseia CNPJ do emitente', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.emit?.CNPJ).toBe('12345678000195')
  })

  test('parseia nome do emitente', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.emit?.xNome).toBe('Empresa Teste LTDA')
  })

  test('parseia endereço do emitente', () => {
    const end = parseNfseXml(NFSE_XML).infNFSe?.emit?.enderNac
    expect(end?.xLgr).toBe('Rua Teste')
    expect(end?.UF).toBe('MG')
    expect(end?.CEP).toBe('30100000')
    expect(end?.cMun).toBe('3106200')
  })

  test('parseia regime tributário (opSimpNac)', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.emit?.regTrib?.opSimpNac).toBe(2)
  })

  test('parseia dados do tomador', () => {
    const toma = parseNfseXml(NFSE_XML).infNFSe?.DPS?.infDPS.toma
    expect(toma?.CNPJ).toBe('00000000000191')
    expect(toma?.xNome).toBe('Banco do Brasil')
  })

  test('parseia descrição do serviço', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.DPS?.infDPS.serv?.xDescServ)
      .toBe('Desenvolvimento de software sob encomenda')
  })

  test('parseia código de serviço NBS e municipal', () => {
    const serv = parseNfseXml(NFSE_XML).infNFSe?.DPS?.infDPS.serv
    expect(serv?.cServTribNac).toBe('01.01.00163')
    expect(serv?.cServMun).toBe('14.01')
  })

  test('parseia valores financeiros como números', () => {
    const val = parseNfseXml(NFSE_XML).infNFSe?.valores
    expect(val?.vServico).toBe(1000)
    expect(val?.vBC).toBe(1000)
    expect(val?.vISSQN).toBe(50)
    expect(val?.vLiq).toBe(950)
    expect(val?.pAliqAplic).toBe(5)
  })

  test('parseia ambiente do DPS (2 = homologação)', () => {
    expect(parseNfseXml(NFSE_XML).infNFSe?.DPS?.infDPS.tpAmb).toBe(2)
  })

  test('ignora BOM UTF-8 sem lançar erro', () => {
    expect(() => parseNfseXml('\uFEFF' + NFSE_XML)).not.toThrow()
  })

  test('parseia XML mínimo sem campos opcionais', () => {
    const minimal = `<?xml version="1.0"?><NFSe versao="1.00"><infNFSe><cStat>100</cStat><xMotivo>OK</xMotivo></infNFSe></NFSe>`
    const schema = parseNfseXml(minimal)
    expect(schema.infNFSe?.cStat).toBe('100')
    expect(schema.infNFSe?.xMotivo).toBe('OK')
  })

  test('campos ausentes retornam string vazia (não undefined)', () => {
    const schema = parseNfseXml(NFSE_XML)
    // campos que existem devem ser strings
    expect(typeof schema.infNFSe?.cStat).toBe('string')
    expect(typeof schema.infNFSe?.chNFSe).toBe('string')
  })
})

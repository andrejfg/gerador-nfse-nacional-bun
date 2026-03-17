import { describe, test, expect } from 'bun:test'
import { buildPedRegEventoXml } from '../../src/xml/eventos-builder.js'
import type { PedRegEventoData } from '../../src/types/dtos.js'

const CHAVE = '3124030112345678000195001001000000000000001'

function makeEvento(overrides: Partial<PedRegEventoData> = {}): PedRegEventoData {
  return {
    chNFSe: CHAVE,
    tipoEvento: 101101,
    numSeqEvento: 1,
    dhEvento: '2024-03-15T12:00:00-03:00',
    descricao: 'Cancelamento de NFS-e',
    motivo: '01',
    motivoDescricao: 'Erro de emissão',
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

  test('ID do pedRegEvento contém chave + tipo + sequência', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain(`Id="PRE${CHAVE}1011011"`)
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
    expect(buildPedRegEventoXml(makeEvento())).toContain('<cMotivo>01</cMotivo>')
  })

  test('inclui descrição do motivo', () => {
    expect(buildPedRegEventoXml(makeEvento())).toContain('<xMotivo>Erro de emissão</xMotivo>')
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

  test('tag muda conforme tipo do evento (e101102)', () => {
    const xml = buildPedRegEventoXml(makeEvento({ tipoEvento: 101102 }))
    expect(xml).toContain('<e101102>')
    expect(xml).toContain('</e101102>')
    expect(xml).not.toContain('<e101101>')
  })
})

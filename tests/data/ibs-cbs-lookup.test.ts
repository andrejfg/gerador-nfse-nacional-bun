/**
 * Consulta às tabelas oficiais de IBS/CBS (Anexo VIII + CST × cClassTrib).
 */
import { describe, test, expect } from 'bun:test'
import { sugerirIbsCbs, classificacoesDoCst } from '../../src/data/ibs-cbs-lookup.js'
import { IBS_CBS_CST_TABLE } from '../../src/data/ibs-cbs-class-trib.js'

describe('sugerirIbsCbs', () => {
  test('resolve o item pelo cServTribNac, com ou sem pontuação', () => {
    const comPontos = sugerirIbsCbs({ cServTribNac: '15.01.01' })
    const semPontos = sugerirIbsCbs({ cServTribNac: '150101' })
    expect(comPontos).toEqual(semPontos!)
    expect(semPontos?.cIndOp).toBe('100301')
  })

  test('usa a NBS para desempatar dentro do mesmo item', () => {
    const sugestao = sugerirIbsCbs({ cServTribNac: '150101', cNBS: '1.0905.21.00' })
    expect(sugestao?.cClassTrib).toBe('010002')
    expect(sugestao?.CST).toBe('010')
  })

  test('adquirente no exterior incrementa o último dígito do cIndOp', () => {
    expect(sugerirIbsCbs({ cServTribNac: '150101', exterior: true })?.cIndOp).toBe('100302')
  })

  test('devolve undefined para item fora da tabela', () => {
    expect(sugerirIbsCbs({ cServTribNac: '999999' })).toBeUndefined()
  })

  test('toda sugestão é uma combinação CST × cClassTrib válida para NFS-e', () => {
    for (const item of ['150101', '010101', '070501']) {
      const sugestao = sugerirIbsCbs({ cServTribNac: item })
      if (!sugestao) continue
      const cst = classificacoesDoCst(sugestao.CST)
      expect(cst?.classes.some(c => c.codigo === sugestao.cClassTrib)).toBe(true)
    }
  })
})

describe('tabela CST × cClassTrib', () => {
  test('só contém classificações aplicáveis a NFS-e', () => {
    expect(IBS_CBS_CST_TABLE.every(cst => cst.classes.length > 0)).toBe(true)
  })

  test('CST 000 aceita apenas a tributação integral', () => {
    expect(classificacoesDoCst('000')?.classes.map(c => c.codigo)).toEqual(['000001'])
  })

  test('exportação de serviço está sob o CST 410', () => {
    expect(classificacoesDoCst('410')?.classes.some(c => c.codigo === '410004')).toBe(true)
  })

  test('CST desconhecido devolve undefined', () => {
    expect(classificacoesDoCst('999')).toBeUndefined()
  })
})

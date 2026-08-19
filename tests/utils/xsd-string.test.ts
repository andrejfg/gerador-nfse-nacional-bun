/**
 * Regras de texto dos tipos simples do XSD (TSString vs xs:string).
 */
import { describe, test, expect } from 'bun:test'
import {
  normalizeTsString,
  normalizeXsString,
  isTsString,
  isTsCep,
  isTsCodPaisIso,
  missingFieldsMessage,
  TS_BAIRRO_MAX,
  TS_CODIGO_END_POSTAL_MAX,
} from '../../src/utils/xsd-string.js'

describe('normalizeTsString', () => {
  test('preserva acento latino — está dentro do charset', () => {
    expect(normalizeTsString('Rua São João, Ilhéus', 255)).toBe('Rua São João, Ilhéus')
  })

  test('troca pontuação tipográfica pelo equivalente ASCII', () => {
    expect(normalizeTsString('Rue de l’Église', 255)).toBe("Rue de l'Église")
    expect(normalizeTsString('Bloco A – Sala 2', 255)).toBe('Bloco A - Sala 2')
  })

  test('mapeia letra latina que o Unicode não decompõe em vez de descartá-la', () => {
    // Sem o mapa manual, `Ł` sumiria no meio da palavra sem ninguém notar.
    expect(normalizeTsString('Łódź', 255)).toBe('Lódz')
  })

  test('descarta o que não tem equivalente e devolve undefined se não sobrar nada', () => {
    expect(normalizeTsString('東京', 255)).toBeUndefined()
    expect(normalizeTsString('Москва 12', 255)).toBe('12')
  })

  test('quebra de linha vira espaço em vez de colar as palavras', () => {
    expect(normalizeTsString('Rua A\nCentro', 255)).toBe('Rua A Centro')
  })

  test('trunca no limite do tipo', () => {
    expect(normalizeTsString('x'.repeat(100), TS_BAIRRO_MAX)).toHaveLength(TS_BAIRRO_MAX)
  })
})

describe('normalizeXsString', () => {
  test('não restringe charset — cidade fora do Latin-1 passa intacta', () => {
    expect(normalizeXsString('東京', 60)).toBe('東京')
  })

  test('só faz trim e corte', () => {
    expect(normalizeXsString(' 13332-7663 ', TS_CODIGO_END_POSTAL_MAX)).toBe('13332-7663')
  })
})

describe('validadores de formato', () => {
  test('isTsString rejeita caractere fora do Latin-1 imprimível', () => {
    expect(isTsString('Centro')).toBe(true)
    expect(isTsString('Quartier 東京')).toBe(false)
  })

  test('isTsCep exige 8 dígitos sem formatação', () => {
    expect(isTsCep('01310100')).toBe(true)
    expect(isTsCep('01310-100')).toBe(false)
    expect(isTsCep(undefined)).toBe(false)
  })

  test('isTsCodPaisIso exige 2 letras maiúsculas', () => {
    expect(isTsCodPaisIso('FR')).toBe(true)
    expect(isTsCodPaisIso('fr')).toBe(false)
    expect(isTsCodPaisIso('FRA')).toBe(false)
  })
})

describe('missingFieldsMessage', () => {
  test('lista todos os campos faltantes de uma vez', () => {
    const msg = missingFieldsMessage('Endereço incompleto', {
      logradouro: 'Rua A',
      bairro: undefined,
      cidade: '',
    })
    expect(msg).toBe('Endereço incompleto. Faltando: bairro, cidade.')
  })

  test('devolve só o prefixo quando não falta nada', () => {
    expect(missingFieldsMessage('Endereço incompleto', { logradouro: 'Rua A' })).toBe('Endereço incompleto')
  })
})

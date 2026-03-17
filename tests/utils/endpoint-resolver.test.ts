import { describe, test, expect } from 'bun:test'
import { resolveBaseUrl } from '../../src/utils/endpoint-resolver.js'
import { TipoAmbiente } from '../../src/types/enums.js'
import type { NfseContext } from '../../src/types/context.js'

const BASE: NfseContext = {
  ambiente: TipoAmbiente.Producao,
  certificatePath: './cert.pfx',
  certificatePassword: 'senha',
}

describe('resolveBaseUrl', () => {
  test('produção → endpoint SEFIN Nacional padrão', () => {
    expect(resolveBaseUrl({ ...BASE, ambiente: TipoAmbiente.Producao }))
      .toBe('https://sefin.nfse.gov.br/sefinNacional')
  })

  test('homologação → endpoint de produção restrita', () => {
    expect(resolveBaseUrl({ ...BASE, ambiente: TipoAmbiente.Homologacao }))
      .toBe('https://sefin.producaorestrita.nfse.gov.br/sefinNacional')
  })

  test('endpoint customizado tem prioridade (produção)', () => {
    const url = resolveBaseUrl({
      ...BASE,
      endpoint: { producao: 'https://mun.gov.br/nfse', homologacao: 'https://hmg.mun.gov.br/nfse' },
    })
    expect(url).toBe('https://mun.gov.br/nfse')
  })

  test('endpoint customizado tem prioridade (homologação)', () => {
    const url = resolveBaseUrl({
      ...BASE,
      ambiente: TipoAmbiente.Homologacao,
      endpoint: { producao: 'https://prod.gov.br', homologacao: 'https://hmg.gov.br' },
    })
    expect(url).toBe('https://hmg.gov.br')
  })

  test('município Catanduva usa endpoint próprio em produção', () => {
    expect(resolveBaseUrl({ ...BASE, codigoMunicipio: '3511102' }))
      .toBe('https://164.152.60.237/nota/nacional')
  })

  test('município Catanduva usa endpoint próprio em homologação', () => {
    expect(resolveBaseUrl({ ...BASE, ambiente: TipoAmbiente.Homologacao, codigoMunicipio: '3511102' }))
      .toBe('https://catanduva.prefeitura.rlz.com.br/nota/nacional')
  })

  test('município sem endpoint próprio cai no padrão SEFIN', () => {
    expect(resolveBaseUrl({ ...BASE, codigoMunicipio: '9999999' }))
      .toBe('https://sefin.nfse.gov.br/sefinNacional')
  })
})

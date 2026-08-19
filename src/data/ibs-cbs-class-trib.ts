/**
 * Tabela oficial CST × cClassTrib do IBS/CBS, restrita ao que vale para NFS-e.
 */

/** Data da última atualização desta tabela contra a publicação oficial. */
export const IBS_CBS_CST_TABLE_ATUALIZADA_EM = '2026-08-19'

/** Uma classificação tributária válida para NFS-e. */
export interface ClassTribInfo {
  /** Código de 6 dígitos (`cClassTrib`). */
  codigo: string
  /** Descrição oficial. */
  descricao: string
}

/** Um CST de IBS/CBS e as classificações que aceitam NFS-e. */
export interface CstInfo {
  /** Código de 3 dígitos (`CST`). */
  cst: string
  /** Descrição oficial. */
  descricao: string
  /**
   * Classificações válidas **para NFS-e** (flag `IndNFSE` da tabela oficial).
   * As demais existem para NF-e, CT-e, NFCom etc. e são recusadas numa DPS.
   */
  classes: ClassTribInfo[]
}

/** Tabela oficial CST × cClassTrib, restrita ao que vale para NFS-e. */
export const IBS_CBS_CST_TABLE: readonly CstInfo[] = [
  {
    "cst": "000",
    "descricao": "Tributação integral",
    "classes": [
      {
        "codigo": "000001",
        "descricao": "Situações tributadas integralmente pelo IBS e CBS."
      }
    ]
  },
  {
    "cst": "010",
    "descricao": "Tributação com alíquotas uniformes",
    "classes": [
      {
        "codigo": "010001",
        "descricao": "Operações do FGTS não realizadas pela Caixa Econômica Federal, observado o art. 212 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "010002",
        "descricao": "Operações do serviço financeiro"
      }
    ]
  },
  {
    "cst": "011",
    "descricao": "Tributação com alíquotas uniformes reduzidas",
    "classes": [
      {
        "codigo": "011003",
        "descricao": "Intermediação de planos de assistência à saúde, observado o art. 240 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "200",
    "descricao": "Alíquota reduzida",
    "classes": [
      {
        "codigo": "200001",
        "descricao": "Serviços de transporte de bens até as zonas de processamento de exportação e bens exportados a partir das zonas de processamento de exportação, observado o art. 103 da Lei Complementar n 214, de 2025."
      },
      {
        "codigo": "200004",
        "descricao": "Fornecimento de dispositivos médicos com a especificação das respectivas classificações da NCM/SH previstas no Anexo XII da Lei Complementar nº 214, de 2025, observado o art. 144 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200005",
        "descricao": "Fornecimento de dispositivos médicos com a especificação das respectivas classificações da NCM/SH previstas no Anexo IV da Lei Complementar nº 214, de 2025, quando adquiridos por órgãos da administração pública direta, autarquias, fundações públicas e entidades de saúde imunes, observado o art. 144 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200006",
        "descricao": "Situação de emergência de saúde pública reconhecida pelo Poder Legislativo federal, estadual, distrital ou municipal competente, ato conjunto do Ministro da Fazenda e do Comitê Gestor do IBS poderá ser editado, a qualquer momento, para incluir dispositivos não listados no Anexo XII da Lei Complementar nº 214, de 2025, limitada a vigência do benefício ao período e à localidade da emergência de saúde pública, observado o art. 144 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200007",
        "descricao": "Fornecimento dos dispositivos de acessibilidade próprios para pessoas com deficiência relacionados no Anexo XIII da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NCM/SH, observado o art. 145 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200008",
        "descricao": "Fornecimento dos dispositivos de acessibilidade próprios para pessoas com deficiência relacionados no Anexo V da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NCM/SH, quando adquiridos por órgãos da administração pública direta, autarquias, fundações públicas e entidades imunes, observado o art. 145 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200016",
        "descricao": "Prestação de serviços de pesquisa e desenvolvimento por Instituição Científica, Tecnológica e de Inovação (ICT) sem fins lucrativos para a administração pública direta, autarquias e fundações públicas ou para o contribuinte sujeito ao regime regular do IBS e da CBS, observado o disposto no art. 156  da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200017",
        "descricao": "Operações relacionadas ao FGTS, considerando aquelas necessárias à aplicação da Lei nº 8.036, de 1990, realizadas pelo Conselho Curador ou Secretaria Executiva do FGTS, observado o art. 212 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200019",
        "descricao": "Importador dos serviços financeiros que seja contribuinte e tenha direito de apropriação de créditos na aquisição do mesmo serviço financeiro no País, observado o art. 231 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200020",
        "descricao": "Operação praticada por sociedades cooperativas optantes por regime específico do IBS e CBS, quando o associado destinar bem ou serviço à cooperativa de que participa, e a cooperativa fornecer bem ou serviço ao associado sujeito ao regime regular do IBS e da CBS, observado o art. 271 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200021",
        "descricao": "Serviços de transporte público coletivo de passageiros ferroviário e hidroviário urbanos, semiurbanos e metropolitanos, observado o art. 285 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200025",
        "descricao": "Fornecimento dos serviços de educação relacionados ao Programa Universidade para Todos (Prouni), instituído pela Lei nº 11.096, de 13 de janeiro de 2005, observado o art. 308 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200026",
        "descricao": "Locação de imóveis localizados nas zonas reabilitadas, pelo prazo de 5 (cinco) anos, contado da data de expedição do habite-se, e relacionados a projetos de reabilitação urbana de zonas históricas e de áreas críticas de recuperação e reconversão urbanística dos Municípios ou do Distrito Federal, a serem delimitadas por lei municipal ou distrital, observado o art. 158 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200027",
        "descricao": "Operações de locação, cessão onerosa e arrendamento de bens imóveis, observado o art. 261 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200028",
        "descricao": "Fornecimento dos serviços de educação relacionados no Anexo II da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da Nomenclatura Brasileira de Serviços, Intangíveis e Outras Operações que Produzam Variações no Patrimônio (NBS), observado o art. 129 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200029",
        "descricao": "Fornecimento dos serviços de saúde humana relacionados no Anexo III da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NBS, observado o art. 130 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200030",
        "descricao": "Venda dos dispositivos médicos relacionados no Anexo IV da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NCM/SH, observado o art. 131 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200031",
        "descricao": "Fornecimento dos dispositivos de acessibilidade próprios para pessoas com deficiência relacionados no Anexo V da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NCM/SH, observado o art. 132 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200037",
        "descricao": "Fornecimento de serviços ambientais de conservação ou recuperação da vegetação nativa, mesmo que fornecidos sob a forma de manejo sustentável de sistemas agrícolas, agroflorestais e agrossilvopastoris, em conformidade com as definições e requisitos da legislação específica, observado o art. 137 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200038",
        "descricao": "Fornecimento dos insumos agropecuários e aquícolas relacionados no Anexo IX da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NCM/SH e da NBS, observado o art. 138 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200039",
        "descricao": "Fornecimento dos bens e serviços listados no Anexo X da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NCM/SH e NBS, nos casos relacionados com produções nacionais artísticas, culturais, de eventos, jornalísticas e audiovisuais, observado o art. 139 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200040",
        "descricao": "Fornec dos seguintes serv de comunic instit à admin púb direta, autarq e fund púb: serviços direcionados ao planej, criação, programação e manutenção de páginas eletrônicas da admin pública, ao monitor e gestão de suas redes sociais e à otimização de páginas e canais digitais para mecanismos de buscas e produção de mensagens, infográficos, painéis interativos e conteúdo institucional, serviços de relações com a imprensa, que reúnem estrat org para promover e reforçar a comunicação dos órgãos e das entidades contratantes com seus públicos de interesse, por meio da interação com prof da imprensa, e serviços de relações públicas, que compreendem o esforço de comunic planej, coeso e contínuo que tem por obj estab adequada percepção da atuação e dos obj instituc, a partir do estímulo à compreensão mútua e da manut de padrões de relac e fluxos de inf entre os órgãos e as entidades contrat e seus públicos de interesse, no País e no exterior, obs o art. 140 da Lei Compl nº 214, de 2025"
      },
      {
        "codigo": "200041",
        "descricao": "Operações relacionadas às seguintes atividades desportivas: fornecimento de serviço de educação desportiva, classificado no código 1.2205.12.00 da NBS, e gestão e exploração do desporto por associações e clubes esportivos filiados ao órgão estadual ou federal responsável pela coordenação dos desportos, inclusive por meio de venda de ingressos para eventos desportivos, fornecimento oneroso ou não de bens e serviços, inclusive ingressos, por meio de programas de sócio-torcedor, cessão dos direitos desportivos dos atletas e transferência de atletas para outra entidade desportiva ou seu retorno à atividade em outra entidade desportiva, observado o art. 141 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200042",
        "descricao": "Operações relacionadas às seguintes atividades desportivas: gestão e exploração do desporto por associações e clubes esportivos filiados ao órgão estadual ou federal responsável pela coordenação dos desportos, observado o art. 141 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200043",
        "descricao": "Fornecimento à administração pública direta, autarquias e fundações púbicas dos serviços e dos bens relativos à soberania e à segurança nacional, à segurança da informação e à segurança cibernética relacionados no Anexo XI da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NBS e da NCM/SH, observado o art. 142 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200044",
        "descricao": "Operações e prestações de serviços de segurança da informação e segurança cibernética desenvolvidos por sociedade que tenha sócio brasileiro com o mínimo de 20% (vinte por cento) do seu capital social, relacionados no Anexo XI da Lei Complementar nº 214, de 2025, com a especificação das respectivas classificações da NBS e da NCM/SH, observado o art. 142 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200045",
        "descricao": "Operações relacionadas a projetos de reabilitação urbana de zonas históricas e de áreas críticas de recuperação e reconversão urbanística dos Municípios ou do Distrito Federal, a serem delimitadas por lei municipal ou distrital, observado o art. 158 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200046",
        "descricao": "Operações com bens imóveis, observado o art. 261 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200048",
        "descricao": "Hotelaria, Parques de Diversão e Parques Temáticos, observado o art. 281 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200051",
        "descricao": "Agências de Turismo, observado o art. 289 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200052",
        "descricao": "Prestação de serviços das seguintes profissões intelectuais de natureza científica, literária ou artística, submetidas à fiscalização por conselho profissional: administradores, advogados, arquitetos e urbanistas, assistentes sociais, bibliotecários, biólogos, contabilistas, economistas, economistas domésticos, profissionais de educação física, engenheiros e agrônomos, estatísticos, médicos veterinários e zootecnistas, museólogos, químicos, profissionais de relações públicas, técnicos industriais e técnicos agrícolas, observado o art. 127 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "200054",
        "descricao": "Fornecimento de bem material pela cooperativa de produção agropecuária a associado não sujeito ao regime regular do IBS e da CBS com anulação de créditos referentes ao bem fornecido, observado o art. 271 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "221",
    "descricao": "Alíquota fixa proporcional",
    "classes": [
      {
        "codigo": "221001",
        "descricao": "Locação, cessão onerosa ou arrendamento de bem imóvel com alíquota sobre a receita bruta, observado o art. 487 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "400",
    "descricao": "Isenção",
    "classes": [
      {
        "codigo": "400001",
        "descricao": "Fornecimento de serviços de transporte público coletivo de passageiros rodoviário e metroviário de caráter urbano, semiurbano e metropolitano, sob regime de autorização, permissão ou concessão pública, observado o art. 157 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "410",
    "descricao": "Imunidade e não incidência",
    "classes": [
      {
        "codigo": "410001",
        "descricao": "Fornecimento de bonificações quando constem do respectivo documento fiscal e que não dependam de evento posterior, observado o art. 5º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410003",
        "descricao": "Doações que não tenham por objeto bens ou serviços que tenham permitido a apropriação de créditos pelo doador, observado o art. 6º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410004",
        "descricao": "Exportações de bens e serviços, observado o art. 8º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410005",
        "descricao": "Fornecimentos realizados pela União, pelos Estados, pelo Distrito Federal e pelos Municípios, observado o art. 9º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410006",
        "descricao": "Fornecimentos realizados por entidades religiosas e templos de qualquer culto, inclusive suas organizações assistenciais e beneficentes, observado o art. 9º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410007",
        "descricao": "Fornecimentos realizados por partidos políticos, inclusive suas fundações, entidades sindicais dos trabalhadores e instituições de educação e de assistência social, sem fins lucrativos, observado o art. 9º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410008",
        "descricao": "Fornecimentos de livros, jornais, periódicos e do papel destinado a sua impressão, observado o art. 9º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410009",
        "descricao": "Fornecimentos de fonogramas e videofonogramas musicais produzidos no Brasil contendo obras musicais ou literomusicais de autores brasileiros e/ou obras em geral interpretadas por artistas brasileiros, bem como os suportes materiais ou arquivos digitais que os contenham, salvo na etapa de replicação industrial de mídias ópticas de leitura a laser, observado o art. 9º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410010",
        "descricao": "Fornecimentos de serviço de comunicação nas modalidades de radiodifusão sonora e de sons e imagens de recepção livre e gratuita, observado o art. 9º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410012",
        "descricao": "Fornecimento de condomínio edilício não optante pelo regime regular, observado o art. 26 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410014",
        "descricao": "Fornecimento de produtor rural não contribuinte, observado o art. 164 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410015",
        "descricao": "Fornecimento por transportador autônomo não contribuinte, observado o art. 169 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410026",
        "descricao": "Doações sem contraprestação em benefício do doador, com anulação de crédito apropriados pelo doador referente ao fornecimento doado, observado o art. 6º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410027",
        "descricao": "Fornecimento de bens e serviços, desde que vinculados direta e exclusivamente à exportação de bens materiais ou associados à entrega no exterior de bens materiais, observado o art. 6º da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410028",
        "descricao": "Operações com bens imóveis realizadas por pessoas físicas não consideradas contribuintes do regime regular do IBS e da CBS, observado o art. 251 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410033",
        "descricao": "Operações com bens imóveis, inclusive operações com direitos reais sobre bens imóveis, realizadas por Fundos de Investimento Imobiliário (FII) e Fundos de Investimento nas Cadeias Produtivas do Agronegócio (Fiagro), observado o art. 26 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410035",
        "descricao": "Fornecimento realizado por nanoempreendedor, observado o art. 26 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "410999",
        "descricao": "Operações não onerosas sem previsão de tributação, não especificadas anteriormente, observado o art. 4º da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "515",
    "descricao": "Diferimento com redução de alíquota",
    "classes": [
      {
        "codigo": "515001",
        "descricao": "Operações, sujeitas a diferimento, com insumos agropecuários e aquícolas, observado o art. 138 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "550",
    "descricao": "Suspensão",
    "classes": [
      {
        "codigo": "550016",
        "descricao": "Regime Especial de Incentivos para o Desenvolvimento da Infraestrutura - Reidi, observado o art. 106 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "550022",
        "descricao": "Regime Especial de Incentivos para a Produção de Hidrogênio de Baixa Emissão de Carbono (Rehidro),  observado o art. 106 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "800",
    "descricao": "Transferência de crédito",
    "classes": [
      {
        "codigo": "800001",
        "descricao": "Fusão, cisão ou incorporação, observado o art. 55 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "800002",
        "descricao": "Transferência de crédito do associado, inclusive as cooperativas singulares, para cooperativa de que participa das operações antecedentes às operações em que fornece bens e serviços e os créditos presumidos, observado o art. 272 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "811",
    "descricao": "Ajustes",
    "classes": [
      {
        "codigo": "811001",
        "descricao": "Anulação de crédito proporcional ao valor das operações imunes e isentas, observado o art. 51 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "811002",
        "descricao": "Débitos de notas fiscais não processadas na apuração, observado o art. 45 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "811003",
        "descricao": "Débitos apurados após o desenquadramento do regime Simples Nacional, observado o art. 41 da Lei Complementar nº 214, de 2025."
      }
    ]
  },
  {
    "cst": "820",
    "descricao": "Tributação em documento específico",
    "classes": [
      {
        "codigo": "820001",
        "descricao": "Documento com informações de fornecimento de serviços de planos de assistência à saúde elencados no art. 234 da Lei Complementar nº 214, de 2025, mas com tributação realizada por outro meio"
      },
      {
        "codigo": "820002",
        "descricao": "Documento com informações de fornecimento de serviços de planos de assinstência funerária, mas com tributação realizada por outro meio, observado o art. 236 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "820003",
        "descricao": "Documento com informações de fornecimento de serviços de planos de assinstência à saúde de animais domésticos, mas com tributação realizada por outro meio, observado o art. 243 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "820004",
        "descricao": "Documento com informações de prestação de serviços de consursos de prognósticos, mas com tributação realizada por outro meio, observado o art. 248 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "820006",
        "descricao": "Documento com informações de fornecimento de serviços de exploração de via, mas com tributação realizada por outro meio, observado o art. 11 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "820007",
        "descricao": "Documento com informações de fornecimento de serviços financeiros, mas com tributação realizada por outro meio, observado o art. 181 da Lei Complementar nº 214, de 2025."
      },
      {
        "codigo": "820009",
        "descricao": "Cobrança relativa a fornecimentos declarados em outro documento, observado o art. 60 da Lei Complementar nº 214, de 2025."
      }
    ]
  }
] as const

/** Índice `CST` → classificações, para consulta O(1). */
export const IBS_CBS_CST_INDEX: ReadonlyMap<string, CstInfo> = new Map(
  IBS_CBS_CST_TABLE.map(cst => [cst.cst, cst]),
)

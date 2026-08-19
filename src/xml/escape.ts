/**
 * Escape de conteúdo de elemento XML.
 *
 * Os builders montam o XML por concatenação de string, então qualquer texto
 * livre vindo do chamador (`xNome`, `xDescServ`, `xInfComp`, `xLgr`, `xMotivo`)
 * precisa passar por aqui. Uma razão social como `A & B LTDA` produz XML
 * malformado sem escape — a assinatura falha ou a SEFIN recusa o esquema.
 *
 * Escapa apenas o necessário para conteúdo de elemento: `&`, `<` e `>`. Aspas
 * não precisam ser escapadas fora de atributo, e os builders não interpolam
 * texto livre em atributo (`Id` é gerado, `versao` é constante).
 *
 * O `&` vem primeiro — inverter a ordem escaparia duas vezes o `&` das próprias
 * entidades.
 */
export function escapeXml(value: string | number): string {
  if (typeof value === 'number') return String(value)
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

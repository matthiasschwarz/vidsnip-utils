// Source: https://webapps.stackexchange.com/a/101153
const idRegex = new RegExp('^([0-9A-Za-z_-]{10}[048AEIMQUYcgkosw])$')

export function validId(id: string): boolean {
  return idRegex.test(id)
}

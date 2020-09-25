import { capitalizeFirstLetter } from '../src'

describe('capitalizeFirstLetter', () => {
  it('works', () => {
    expect(capitalizeFirstLetter('')).toStrictEqual('')
    expect(capitalizeFirstLetter('HelloWorld')).toStrictEqual('HelloWorld')
    expect(capitalizeFirstLetter('helloWorld')).toStrictEqual('HelloWorld')
  })
})

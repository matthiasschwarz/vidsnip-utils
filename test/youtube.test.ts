import { validId } from '../src'

describe('validId', () => {
  it('works', () => {
    expect(validId('')).toBeFalsy()
    expect(validId('abcdefghijk')).toBeTruthy()
  })
})

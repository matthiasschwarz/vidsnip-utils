import { Timestamp } from '../src'

describe('Timestamp', () => {
  it('works', () => {
    const t1 = new Timestamp()
    t1.setUnitValue('seconds', 66)
    expect(t1.getUnit('seconds')?.value).toEqual(6)
    expect(t1.getUnit('minutes')?.value).toEqual(1)
    expect(t1.toString()).toEqual('1:06')
    const t2 = new Timestamp()
    t2.setUnitValue('seconds', 8)
    t2.setUnitValue('minutes', 57)
    expect(t2.setUnitValue('hours', 3)).toBeTruthy()
    expect(t2.setUnitValue('hours', 3)).toBeFalsy()
    expect(t2.toString()).toEqual('3:57:08');
    expect(t2.clone() !== t2).toBeTruthy()
    expect(t2.clone()).toEqual(t2)
    const t3 = Timestamp.fromSeconds(42);
    expect(t3.fullSeconds).toEqual(42);
    expect(t3.toString()).toEqual('0:42');
    t3.fullSeconds = 1337;
    expect(t3.toString()).toEqual('22:17');
    const t4 = Timestamp.fromSeconds(Number.MAX_SAFE_INTEGER)
    expect(t4).toBeDefined()
    expect(t4.toString()).toStrictEqual("104249991374:07:36:31")
    const t4Array = t4.trimToArray()
    expect(t4Array.length).toStrictEqual(4)
    expect(t4Array[3].value).toStrictEqual(31)
    expect(t4Array[2].value).toStrictEqual(36)
    expect(t4Array[1].value).toStrictEqual(7)
    expect(t4Array[0].value).toStrictEqual(104249991374)
    const t5 = new Timestamp()
    expect(t5.toString()).toStrictEqual("0:00")
    expect(t5.copyUnitValue('seconds', t4)).toBeTruthy()
    expect(t5.copyUnitValue('seconds', t4)).toBeFalsy()
    expect(t5.copyUnitValue('second', t4)).toBeFalsy()
    expect(t5.fullSeconds).toStrictEqual(31)
    const t6 = new Timestamp()
    expect(() => t6.setUnitValue('days', Number.MAX_SAFE_INTEGER+1)).toThrowError()
  })
})

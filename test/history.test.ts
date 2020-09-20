import { getTypeTooltip, ChangeType } from '../src'

const tooltips = [
  { type: ChangeType.SectionAdd, value: 'section add' },
  { type: ChangeType.SectionRemove, value: 'section deletion' },
  { type: ChangeType.SectionSwap, value: 'section index swap' },
  { type: ChangeType.SectionSplit, value: 'section split' },
  { type: ChangeType.SectionStartUpdate, value: 'start section change' },
  { type: ChangeType.SectionEndUpdate, value: 'end section change' },
  { type: ChangeType.TimestampUpdate, value: 'timestamp change' },
]

describe('getTypeTooltip', () => {
  it('works', () => {
    tooltips.forEach(tooltip => {
      expect(getTypeTooltip(tooltip.type)).toStrictEqual(tooltip.value)
    })
  })
})

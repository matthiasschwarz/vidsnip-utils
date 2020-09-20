import { IndexableSection, Section } from './section'
import { Timestamp } from './timestamp'

export enum ChangeType {
  SectionAdd,
  SectionRemove,
  SectionSplit,
  SectionSwap,
  TimestampUpdate,
  SectionStartUpdate,
  SectionEndUpdate,
}

export interface Change {
  type: ChangeType
}

export interface SectionAdd extends Change {
  section: Section
}

export interface SectionRemove extends Change, IndexableSection {}

export interface SectionSplit extends Change {
  first: { index?: number; old?: Section; new: Section }
  second: Section
}

export interface TimestampUpdate extends Change {
  index: number
  old: Timestamp
  new: Timestamp
}

export interface SectionSwap extends Change {
  old: number
  new: number
}

export function getTypeTooltip(type: ChangeType) {
  switch (type) {
    case ChangeType.SectionAdd:
      return 'section add'
    case ChangeType.SectionRemove:
      return 'section deletion'
    case ChangeType.SectionSwap:
      return 'section index swap'
    case ChangeType.SectionSplit:
      return 'section split'
    case ChangeType.SectionStartUpdate:
      return 'start section change'
    case ChangeType.SectionEndUpdate:
      return 'end section change'
    case ChangeType.TimestampUpdate:
      return 'timestamp change'
  }
}

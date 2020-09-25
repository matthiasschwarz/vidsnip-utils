import { IndexableSection, Section } from './section'
import { Timestamp } from './timestamp'

export enum ChangeType {
  SectionAdd = 'sectionAdd',
  SectionRemove = 'sectionRemove',
  SectionSplit = 'sectionSplit',
  SectionSwap = 'sectionSwap',
  TimestampUpdate = 'timestampUpdate',
  SectionStartUpdate = 'sectionStartUpdate',
  SectionEndUpdate = 'sectionEndUpdate',
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

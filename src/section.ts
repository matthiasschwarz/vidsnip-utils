import { Timestamp } from './timestamp'

export interface Section {
  start: Timestamp
  end: Timestamp
}

export interface IndexableSection {
  index: number
  section: Section
}

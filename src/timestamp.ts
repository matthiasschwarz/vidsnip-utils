const timestampUnitSeparator = ':'

class DurationUnit {
  constructor(
    public identifier: string,
    public singularName: string,
    public pluralName: string,
    public shortName: string,
    public minValue: number,
    public maxValue: number,
    public seconds: number,
    public separator: string | undefined, // previous
    public alwaysShow: boolean
  ) {}

  getName(value: number): string {
    const lowerCaseName = this.getLowerCaseName(value)
    if (lowerCaseName.length === 0) return ''
    return lowerCaseName.charAt(0).toUpperCase() + lowerCaseName.slice(1)
  }

  getLowerCaseName(value: number): string {
    return value >= 2 ? this.pluralName : this.singularName
  }

  valueInRange(value: number): boolean {
    return value >= this.minValue && value <= this.maxValue
  }

  length(): number {
    return Math.max(
      this.minValue.toString().length,
      this.maxValue.toString().length
    )
  }
}

interface DurationUnitListNode {
  format: DurationUnit
  next: DurationUnitListNode | undefined
  previous: DurationUnitListNode | undefined
}

class DurationUnitList implements Iterable<DurationUnit> {
  lookup: any
  nodes: Array<DurationUnitListNode>
  constructor(...units: Array<DurationUnit>) {
    this.nodes = []
    this.lookup = {}
    units.forEach((value, index) => {
      const node: DurationUnitListNode = {
        format: value,
        previous: this.nodes[index - 1],
        next: undefined,
      }
      this.nodes.push(node)
      if (index !== 0) this.nodes[index - 1].next = this.nodes[index]
      Object.defineProperty(this.lookup, value.identifier, { value: node })
    })
  }

  *[Symbol.iterator](): Iterator<DurationUnit> {
    for (const node of this.nodes) yield node.format
  }

  getUnit(identifier: string): DurationUnit | undefined {
    return this.getNode(identifier)?.format
  }

  getNode(identifier: string): DurationUnitListNode | undefined {
    return this.lookup[identifier]
  }
}

const timestampDefaultUnits = new DurationUnitList(
  new DurationUnit(
    'days',
    'day',
    'days',
    'd',
    0,
    104249991374, // Math.floor(Number.MAX_SAFE_INTEGER / seconds)
    86400, // 60 * 60 * 24
    undefined,
    false
  ),
  new DurationUnit(
    'hours',
    'hour',
    'hours',
    'h',
    0,
    23,
    3600, // 60 * 60
    timestampUnitSeparator,
    false
  ),
  new DurationUnit(
    'minutes',
    'minute',
    'minutes',
    'm',
    0,
    59,
    60,
    timestampUnitSeparator,
    true
  ),
  new DurationUnit(
    'seconds',
    'second',
    'seconds',
    's',
    0,
    59,
    1,
    timestampUnitSeparator,
    true
  )
)

export interface TimestampUnit {
  value: number
  format: DurationUnit
}

export class Timestamp {
  protected values: any
  protected units: DurationUnitList

  // @ts-ignore
  protected _fullSeconds: number

  get fullSeconds(): number {
    return this._fullSeconds
  }

  set fullSeconds(value: number) {
    this.clear()
    this.setUnitValue('seconds', value)
  }

  constructor(units: DurationUnitList = timestampDefaultUnits) {
    this.values = {}
    this.units = units
    this.clear()
  }

  static fromSeconds(
    seconds: number,
    units: DurationUnitList = timestampDefaultUnits
  ): Timestamp {
    const timestamp = new Timestamp(units)
    timestamp.setUnitValue('seconds', seconds)
    return timestamp
  }

  getUnit(identifier: string): TimestampUnit | undefined {
    const value = this.values[identifier]
    const format = this.units.getUnit(identifier)
    return value !== undefined && format !== undefined
      ? { value, format }
      : undefined
  }

  getUnitValue(identifier: string): number | undefined {
    return this.getUnit(identifier)?.value
  }

  setUnitValue(identifier: string, value: number): boolean {
    value = Math.trunc(value)
    const oldValue = this.values[identifier]
    const node = this.units.getNode(identifier)
    if (!node || value === oldValue) return false
    if (value > node.format.maxValue) {
      const previousNode = node.previous
      if (!previousNode) throw Error(`${node.format.getName(value)} overflow`)
      this.increaseUnitValue(
        previousNode.format.identifier,
        Math.floor(value / (node.format.maxValue + 1))
      )
      value %= node.format.maxValue + 1
    }
    this._fullSeconds += (value - oldValue) * node.format.seconds
    this.values[identifier] = value
    return true
  }

  copyUnitValue(identifier: string, other: Timestamp): boolean {
    const value = other.getUnitValue(identifier)
    if (value === undefined) return false
    return this.setUnitValue(identifier, value)
  }

  increaseUnitValue(identifier: string, value: number): boolean {
    if (value === 0) return false
    const unit = this.getUnit(identifier)
    if (!unit) return false
    return this.setUnitValue(identifier, unit.value + value)
  }

  /*decreaseUnitValue(identifier: string, value: number): boolean {
    if (value === 0) return false;
    const unit = this.getUnit(identifier);
    if (!unit) return false;
    return this.setUnitValue(identifier, unit.value - value);
  }*/

  clear() {
    for (const unit of this.units) this.values[unit.identifier] = 0
    this._fullSeconds = 0
  }

  toArray(): Array<TimestampUnit> {
    const array = []
    for (const unitFormat of this.units) {
      const unitValue = this.getUnitValue(unitFormat.identifier)!!
      if (unitFormat.alwaysShow || unitValue !== 0)
        array.push({ value: unitValue, format: unitFormat })
    }
    return array
  }

  trimToArray(): Array<TimestampUnit> {
    const array: Array<TimestampUnit> = []
    this.units.nodes.forEach((value, index) => {
      const unitValue = this.getUnitValue(value.format.identifier)!!
      if (
        array.length !== 0 ||
        unitValue !== 0 ||
        index === this.units.nodes.length - 1
      )
        array.push({ value: unitValue, format: value.format })
    })
    return array
  }

  toString() {
    let string = ''
    this.toArray().forEach(unit => {
      if (string.length === 0) string += unit.value
      else {
        if (unit.format.separator !== undefined) string += unit.format.separator
        string += unit.value.toString().padStart(unit.format.length(), '0')
      }
    })
    return string
  }

  clone(): Timestamp {
    return Timestamp.fromSeconds(this.fullSeconds, this.units)
  }
}

export interface NamedTimestamp {
  name: string
  value: Timestamp
}

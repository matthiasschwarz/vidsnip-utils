export enum InputErrorType {
  UNKNOWN,
  LESS,
  GREATER,
}

export interface InputError {
  type: InputErrorType
}

export interface InputErrorLess extends InputError {
  min: number
}

export interface InputErrorGreater extends InputError {
  max: number
}

import { Misfit } from 'mega-nice-validation'

export default class Result<T> {

  type: string
  value!: T
  misfits: Misfit[] = []
  remoteError!: string

  constructor(type?: string, result?: T|Misfit|Misfit[]|string) {
    // conversion to any type to prevent the TypeScript compiler from complaining
    this.type = <any> type

    if (type == 'value') {
      this.value = <T> result
    }

    if (type == 'misfits') {
      if (! (result instanceof Array)) {
        this.misfits = [ <Misfit> result ]
      }
      else {
        this.misfits = result
      }
    }

    if (type == 'remoteError') {
      this.remoteError = <string> result
    }
  }

  isValue(): boolean {
    return this.type == 'value'
  }

  isMisfits(): boolean {
    return this.type == 'misfits'
  }

  isRemoteError(): boolean {
    return this.type == 'remoteError'
  }

  static value<T>(value?: T): Result<T> {
    return new Result('value', value)
  }

  static misfits<T>(misfits: Misfit|Misfit[]): Result<T> {
    return new Result<T>('misfits', misfits)
  }

  static remoteError<T>(error: string): Result<T> {
    return new Result<T>('remoteError', error)
  }

  static checkIfRawResultObjIsValid(resultObj: any) {
    if (typeof resultObj !== 'object') {
      return new Misfit('NotAnObject')
    }

    if (resultObj.type == undefined) {
      throw new Error('Given raw result object does not have a \`type\`property')
    }
  }

  static fromRemote<T>(result: Result<T>, convertValue?: (value: any) => T): Result<T> {
    if (result.isRemoteError()) {
      throw new Error(result.remoteError)
    }
  
    if (result.isMisfits()) {
      return result
    }
  
    if (result.isValue()) {
      if (convertValue != undefined) {
        return Result.value(convertValue(result.value))
      }
      
      return result
    }
  
    throw new Error('Unknown result type')
    }
}
import { Misfit } from 'mega-nice-validation'

export default class Result {

  type: string = 'value'
  misfits!: Misfit[]
  remoteError!: string

  isValue(): boolean {
    return this.type == 'value'
  }

  isMisfits(): boolean {
    return this.type == 'misfits'
  }

  isRemoteError(): boolean {
    return this.type == 'remoteError'
  }

  static misfits(misfit: Misfit): Result
  static misfits(misfit: Misfit[]): Result

  static misfits(misfits: Misfit|Misfit[]): Result {
    let result = new Result
    result.type = 'misfits'

    if (misfits instanceof Array) {
      result.misfits = misfits
    }
    else if (misfits != undefined) {
      result.misfits = [ misfits ]
    }

    return result
  }

  static remoteError(error: string): Result {
    let result = new Result
    result.type = 'remoteError'
    result.remoteError = error
    return result
  }

  static checkIfRawResultObjIsValid(resultObj: any) {
    if (typeof resultObj !== 'object') {
      throw new Error('Result is not an object')
    }

    if (resultObj === null) {
      throw new Error('Result is null')
    }

    if (resultObj.type == undefined) {
      throw new Error('Result does not have a \'type\' property')
    }
  }

  static fromRemote<T>(result: Result): Result {
    if (result.isRemoteError()) {
      throw new Error(result.remoteError)
    }

    if (! result.isMisfits() && ! result.isValue()) {
      throw new Error('Unknown result type')
    }
  
    return result
  }
}
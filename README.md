# Coderitter API adopted Remote Method Call

An adoption of the [remote-method-call](https://github.com/c0deritter/remote-method-call) package for the Coderitter API architecture. Also refer to the original [documentation](https://github.com/c0deritter/remote-method-call#readme).

## Install

`npm install coderitter-api-remote-method-call`

## Overview

### RemoteMethodCall

There is an interface `RemoteMethodCall` for sending a remote method calls to a server.

```typescript
interface RemoteMethodCall {
  methodName: string
  parameter?: any
}
```

### Result

There is a class `Result` for sending a result to a client. A result can either be of type `value`, in which case everything went as expected, it can be of type `misfits`, in which case there were misfits in the parameter of the remote method call, or it can be of type `remoteError` in which case there was an error on the remote side.

```typescript
class Result<T> {

  type: string // value, misfits, remoteError
  misfits!: Misfit[] // the misfits
  remoteError!: string // the remoteError

  // 'misfits' and 'remoteError' are asserted as non null by the exclamation mark '!'
  // because otherwise TypeScript would want you to check for it which can be annoying

  constructor(type?: string, result?: T|Misfit|Misfit[]|string) { ...
```

The class `Misfit` describes misfits that occured while validating the parameter. It is part of the package [knight-validation](https://github.com/c0deritter/knight-validation).

The following static methods can be used to constructing misfit and remote error results.

```typescript
Result.misfits(misfits)
Result.remoteError('There was an error in our application. We will fix this soon.')
```

When receiving the result in the client you can use the static method `fromRemote()` to throw an exception if there was a remote error.

```typescript
let receivedResult = new Result('remoteError', 'Error message')
return Result.fromRemote(receivedResult) // throws an exception in case of a remote error
```

If there was no remote error you can continue the work with the result object. Check if there were misfits in the parameters of the remote method call by using `isMisfits()` or if you received the actual value by using `isValue()`.

```typescript
result.isMisfits()
result.isValue()
```

#### Creating your own result class

To use the result in your application you need to derive a new one for every use case. This is good for the documentation.

```typescript
class UserCreateResult extends Result {
  createdUser: User

  constructor(createdUser: User) {
    super()
    this.createdUser = createdUser
  }
}
```
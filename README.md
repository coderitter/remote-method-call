# Remote Method Call

## Install

`npm install remote-method-call`

## Overview

### RemoteMethodCall

There is the interface `RemoteMethodCall` for making remote method calls.

```typescript
interface RemoteMethodCall {
  methodName: string
  parameter?: any
}
```

### Result

And there is a standardized result result class `Result`.

```typescript
class Result<T> {

  type: string
  value!: T
  misfits: Misfit[] = []
  remoteError!: string

  constructor(type?: string, result?: T|Misfit|Misfit[]|string) {
...
```

The result has one of the three types.

- `value`: The expected value the method should have returned.
- `misfits`: An array of misfits from package [`mega-nice-validation`](https://github.com/c0deritter/mega-nice-validation) which signal misfitting parameters and can be displayed as errors in a form for example.
- `remoteError`: If the method threw an error this property contains a message for the client.

There are three static methods for constructing the different result types.

```typescript
Result.value(42)

import { Misfit } from 'mega-nice-validation'
let misfits: Misfit[] = [ new Misfit('name', 'Required') ]
Result.misfits(misfits)

try {
  remoteMethodCall(parameter)
}
catch (e) {
  Result.remoteError('Oops there was an error in our application. This should not happen. ' + e.message)
}
```

When receiving the result in the client you should use the static method `fromRemote`.

```typescript
// Somehow you need to receive the result and convert it with the help of mega-nice-json to the actual instance of its class. Here we just instantiate the result for demonstration reasons.
let receivedResult = new Result('remoteError', 'Error message')
return Result.fromRemote(receivedResult)
```

This method returns the result if it is of type `value` or `misfits` and throws an error if it is of type `remoteError`. That way the exact behaviour found on the remote side is emulated. It will feel like you just did a local method call instead of a remote method call. When using `Result.fromRemote` there will be no difference. It is even more convenient because you can ask the developers of the remote side to fix the bugs for you.

When working with the result which was returned by `Result.fromRemote` you can ask it if it is if type `value` or `misfits` and react accordingly.

```typescript
result.isValue()
result.isMisfits()
```
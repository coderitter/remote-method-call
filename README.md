# Coderitter API adopted Remote Method Call

An adoption of the [remote-method-call](https://github.com/c0deritter/remote-method-call) package for the Coderitter API architecture. Also refer to the original [documentation](https://github.com/c0deritter/remote-method-call#readme).

This packages aims to provide a simpler alternative to REST styled HTTP APIs.

A remote method call calls a method of an object remotely. Thus mimicking the usage of an remote object as if it was locally present. It brings the object-oriented paradigma to an API which then can be envisioned as a set of service objects on another computer.

One advantage is that you do not need to use HTTP method names (PUT, POST, DELETE, PATCH, GET) which are not extensible and do not fit in the standard CRUD (create, read, update, delete) naming scheme. You can use as many methods as you need and you can also name them as you like.

Another advantage is that you can put the parameters all in the HTTP body instead of distributing them over the URL path, the URL parameters, the URL entity, the HTTP method, the HTTP headers and the HTTP body.

Furthermore is the data format compatible to any other protocol like pure TCP, WebSockets, Kafka but also to other data formats like Google Protocol Buffers. You can add additional support for your API through WebSockets without the need to reimplement the client data intake.

## Related packages

To send POSTonly styled remote method call HTTP messages from a browser you can use the package [postonly-request](https://github.com/c0deritter/postonly-request).

On the server side you can use [remote-method-call](https://github.com/c0deritter/remote-method-api) which offers a simple mapping from a received remote method call to a function which receives the parameters of that remote method call for further processing.

There is also a [branch](https://github.com/c0deritter/remote-method-call/tree/coderitter-api) of this package which is optimized for the use in the Coderitter API architecture.

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

## Sending a Remote Method Call via an HTTP request

For sending a remote mathod call via HTTP we suggest the HTTP usage style POSTonly. It uses the `POST` HTTP method only and the remote method call data object is put as a JSON string into the body of the HTTP message.

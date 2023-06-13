# Remote Method Call

This packages aims to provide a simpler alternative to REST styled HTTP APIs.

A remote method call calls a method of an object remotely. Thus mimicking the usage of an remote object as if it was locally present. It brings the object-oriented paradigm to an API which then can be envisioned as a set of service objects on another computer.

One advantage is that you do not need to use HTTP method names (PUT, POST, DELETE, PATCH, GET) which are not extensible and do not fit in the standard CRUD (create, read, update, delete) naming scheme. You can use as many methods as you need and you can also name them as you like.

Another advantage is that you can put every parameter into the HTTP body instead of distributing them all over the URL path, the URL parameters, the URL entity, the HTTP method, the HTTP headers and the HTTP body.

Furthermore, it is compatible to any other protocol like pure TCP, WebSockets, Kafka and also to other data formats like Google Protocol Buffers. You can add additional support for your API through WebSockets without the need to reimplement the client data.

## Related packages

To send POSTonly styled remote method call HTTP messages from a browser you can use the package [postonly-request](https://github.com/c0deritter/postonly-request).

On the server side you can use [remote-method-api](https://github.com/c0deritter/remote-method-api) which offers a simple mapping from a received remote method call to a function which receives the parameters of that remote method call for further processing.

## Install

`npm install remote-method-call`

## Overview

The only thing in this package is the interface `RemoteMethodCall`.

```typescript
interface RemoteMethodCall {
  method: string
  parameters?: any
}
```

## Sending a Remote Method Call via an HTTP request

For sending a remote mathod call via HTTP we suggest the HTTP usage style POSTonly. It uses the `POST` HTTP method only and the remote method call data object is put as a JSON string into the body of the HTTP message.

## Result message

This package does not define any result data formats since they can be very different, depending on the needs of the application.
# Remote Method Call - RMC

A JSON data structure for communicating remote method calls over a network connection. A *remote method call*, or short *RMC*, is a method call on an object which is only reachable remotely over a computer network.

How is it different from the known *remote procedure call* or *RPC*? The word procedure stems from *procedural programming*. In this programming paradigm, computer programs are composed of procedures, subroutines that contain a series of computational steps. Procedural programming was superseded by *object-oriented programming*, in which procedures are called methods. Each method is associated to an object instead of it being decoupled from the data it uses.

The RMC implementation of this package can be used with any protocol like HTTP, WebSockets, Kafka, MQTT and so on, without the need to adjust the data format. Or the processing of the remote method call in the application. The kind of transport does not matter. Thus it yields a higher compatibility like for example a REST implementations which cannot be easily adopted to other protocols.

This package does not define any result data formats since they can be very different and need to be adjusted to the application at hand.

## Related packages

On the server side you can use [remote-method-api](https://github.com/c0deritter/remote-method-api) which offers a simple mapping from a received remote method call to a function which receives the parameters of that remote method call for further processing. You can use the package [postonly-request](https://github.com/c0deritter/postonly-request) to send POSTonly styled remote method call API requests from a browser application to a server.

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

This package is meant to provide the least common denominator for specific remote method call implementations. A specific application will define additional properties like for authentication or API versioning.

## Creating a custom RMC definition

To create your own remote method call implementation, you do not need to install this package as a dependency. Just copy the two properties into your own interface definition.

## Using Remote Method Calls with the HTTP protocol

For sending a remote method call via HTTP, you need to use the HTTP usage style [POSTonly](#postonly) to take full advantage of the protocol interoperability. It uses the HTTP method `POST` only, the URL path is static like `api` and does not include any parameters. The remote method call JSON is put into HTTP message body.

## POSTonly

POSTonly is an HTTP usage style in which the only HTTP method being used is `POST`. On top of that, the location for every needed parameter is the HTTP message body. This results in the URL path to be one static string which does not change between different API request types.

### Problems with HTTP REST

Why would someone fight against the world wide adopted REST API style? The answer is, that the REST API style has some serious flaws which makes working with it demanding. Demanding means, that the programmer needs to focus on using REST, focus which he would otherwise spend to program the application, in contrast to programming the REST style.

REST has the following problems.

#### HTTP method names do not match the common way of thinking

REST is using the provided HTTP method names like `PUT`, `POST`, `DELETE`, `PATCH` or `GET`. Most applications use the CRUD terms `create`, `read`, `update` and `delete` to think about their basic methods. The HTTP method names do not match them.

#### The meaning of HTTP method names is not consistent

The community is not unified over the question on how to map `POST`, `PUT` or `PATCH` to `create`, `update` or `upsert`. Thus, classic HTTP REST cannot provide unambiguous meanings of its methods names.

#### The set of provided HTTP methods is not extensible

If the REST API creator wants to offer an additional method like `COUNT`, it is not possible. The set of HTTP methods is not extensible. This leads to putting the method name into the URL path, like so `https://myapi.com/users/count`. This leads to multiple additional problems.

1. The first one is the location itself. The hint, that the user wants to execeute a `count` method, is now found in the URL path, while in the case of a default method, you will find it in the method field of the HTTP header.

2. The second problem is, that the HTTP method header field cannot be omitted. Thus, even if you want to put the method name into the URL path, you still have to state an HTTP method. This leads to the question, which HTTP method to choose?

3. If you for example chose `POST`, a third problem may arise. `POST` might already be defined as creating or updating an object. Now `POST` not only has that direct meaning but also the additionally meaning of `COUNT` or any other method. The meaning of `POST` is not unambiguous anymore.

#### The place for parameters is inconsistent

When you are using the HTTP method `GET` for retreiving objects and you want to offer the possibility to provide filter criteria, you are forced to put them into the URL path as URL parameters, since `GET` is not allowed to have an HTTP body.

If you want to store or update an object using `POST`, you most likely put the parameters into the HTTP body, since `POST` is allowed to have one.

The result is, that in case of `GET`, parameters are in the URL path, in case of `POST`, they are in the HTTP body. This is not consistent.

#### Parameters are spread all over the HTTP message

A classic REST HTTP API call uses six places for parameters.

1. HTTP method
2. URL path
3. The file extension of the resource that is pointed to by the URL
4. URL parameters
5. HTTP header
6. HTTP body

It can be difficult to decide which location to choose for a parameter and it can lead to discussions inside your team. It is also tedious to work with the information artifacts provided by the HTTP message like having to parse an URL to extract various parameters from it.

#### An HTTP message is not compatible to other transports

It is easily possible to create an HTTP request and to process an HTTP response. In contrary, it is not easily possible to obtain the plain HTTP message string or to parse it, since this functionality is usually buried inside of the HTTP request or HTTP server libraries. Thus it is not possible to send the plain HTTP message string over other transports like WebSockets, Kafka, MQTT and so on. The extensive use of HTTP message fields leads to an incompatibility to every other protocol.

### POSTonly as an alternative to classic REST HTTP usage style

POSTonly can solve all of the above issues.

1. You can choose the method names that fit into your application.
2. If someone defines a set of RMC method names, they will be consistent.
3. You can extend your set of method names as much as you like.
4. Every parameter has its defined place inside the RMC JSON and it will not be different from method to method.
5. Every parameter is put into the RMC JSON, so it is in one place. No looking for and gathering parameters. Easy unified parsing of the data.
6. Use any other transport to send remote method calls. Additionally offer your API over WebSocket.
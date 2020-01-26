# Remote Method Call

## Install

`npm install remote-method-call`

## Overview

The only thing in this package is the interface `RemoteMethodCall`.

```typescript
interface RemoteMethodCall {
  methodName: string
  parameter?: any
}
```
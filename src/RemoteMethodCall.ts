export default interface RemoteMethodCall {
  apiVersion: number
  apiKey?: string
  token?: string
  method: string
  parameter?: any
}
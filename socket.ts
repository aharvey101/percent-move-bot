// import WebSocket from 'ws'

// class SocketClient {
//   baseUrl: string
//   private _path: string
//   private _ws: WebSocket
//   private _handlers: Map<string, Function[]>

//   constructor(path: string, baseUrl: string) {
//     this.baseUrl = baseUrl || 'wss://testnet.binance.vision/ws-api/v3'
//     this._path = path
//     this._createSocket()
//     this._handlers = new Map()
//   }

//   _createSocket() {
//     this._ws = new WebSocket(`${this.baseUrl}${this._path}`)

//     this._ws.onopen = () => {
//       console.info('ws connected')
//     }

//     this._ws.on('pong', () => {
//       console.debug('receieved pong from server')
//     })
//     this._ws.on('ping', () => {
//       console.debug('==========receieved ping from server')
//       this._ws.pong()
//     })

//     this._ws.onclose = () => {
//       console.warn('ws closed')
//     }

//     this._ws.onerror = (err: any) => {
//       console.warn('ws error', err)
//     }
//     this._ws.onmessage = (msg: any) => {
//       try {
//         const message = JSON.parse(msg.data) as { stream: string; e: string }

//         if (this.isMultiStream(message)) {
//           this._handlers
//             .get(message.stream)
//             ?.forEach((cb: Function) => cb(message))
//         } else if (message?.e && this._handlers.has(message.e)) {
//           this._handlers.get(message.e)?.forEach((cb: Function) => {
//             cb(message)
//           })
//         } else {
//           console.warn('Unknown method', message)
//         }
//       } catch (e) {
//         console.warn('Parse message failed', e)
//       }
//     }

//     this.heartBeat()
//   }

//   isMultiStream(message: any) {
//     return message.stream && this._handlers.has(message.stream)
//   }

//   heartBeat() {
//     setInterval(() => {
//       if (this._ws.readyState === WebSocket.OPEN) {
//         this._ws.ping()
//         console.debug('ping server')
//       }
//     }, 5000)
//   }

//   setHandler(method: string, callback: Function) {
//     if (!this._handlers.has(method)) {
//       this._handlers.set(method, [])
//     }
//     this._handlers.get(method)?.push(callback)
//   }
// }

// export default SocketClient

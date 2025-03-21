import type { AgentMessage } from './AgentMessage'
import type { MessageHandler } from './handlers/MessageHandler'
import type { MessageHandlerMiddleware } from './handlers/MessageHandlerMiddleware'
import type { ParsedDidCommProtocolUri } from './util/messageType'

import { injectable } from '@credo-ts/core'

import { canHandleMessageType, parseMessageType, supportsIncomingDidCommProtocolUri } from './util/messageType'

@injectable()
export class MessageHandlerRegistry {
  private messageHandlers: MessageHandler[] = []
  public readonly messageHandlerMiddlewares: MessageHandlerMiddleware[] = []
  private _fallbackMessageHandler?: MessageHandler['handle']

  public registerMessageHandler(messageHandler: MessageHandler) {
    this.messageHandlers.push(messageHandler)
  }

  public registerMessageHandlers(messageHandlers: MessageHandler[]) {
    for (const messageHandler of messageHandlers) {
      this.registerMessageHandler(messageHandler)
    }
  }

  public registerMessageHandlerMiddleware(messageHandlerMiddleware: MessageHandlerMiddleware) {
    this.messageHandlerMiddlewares.push(messageHandlerMiddleware)
  }

  public get fallbackMessageHandler() {
    return this._fallbackMessageHandler
  }

  /**
   * Sets the fallback message handler, the message handler that will be called if no handler
   * is registered for an incoming message type.
   */
  public setFallbackMessageHandler(fallbackMessageHandler: MessageHandler['handle']) {
    this._fallbackMessageHandler = fallbackMessageHandler
  }

  public getHandlerForMessageType(messageType: string): MessageHandler | undefined {
    const incomingMessageType = parseMessageType(messageType)

    for (const handler of this.messageHandlers) {
      for (const MessageClass of handler.supportedMessages) {
        if (canHandleMessageType(MessageClass, incomingMessageType)) return handler
      }
    }
  }

  public getMessageClassForMessageType(messageType: string): typeof AgentMessage | undefined {
    const incomingMessageType = parseMessageType(messageType)

    for (const handler of this.messageHandlers) {
      for (const MessageClass of handler.supportedMessages) {
        if (canHandleMessageType(MessageClass, incomingMessageType)) return MessageClass
      }
    }
  }

  /**
   * Returns array of message types that dispatcher is able to handle.
   * Message type format is MTURI specified at https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0003-protocols/README.md#mturi.
   */
  public get supportedMessageTypes() {
    return (
      this.messageHandlers
        // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        .reduce<(typeof AgentMessage)[]>((all, cur) => [...all, ...cur.supportedMessages], [])
        .map((m) => m.type)
    )
  }

  /**
   * Returns array of protocol IDs that dispatcher is able to handle.
   * Protocol ID format is PIURI specified at https://github.com/hyperledger/aries-rfcs/blob/main/concepts/0003-protocols/README.md#piuri.
   */
  public get supportedProtocolUris() {
    const seenProtocolUris = new Set<string>()

    const protocolUris: ParsedDidCommProtocolUri[] = this.supportedMessageTypes
      .filter((m) => {
        const has = seenProtocolUris.has(m.protocolUri)
        seenProtocolUris.add(m.protocolUri)
        return !has
      })
      .map(({ messageName, messageTypeUri, ...parsedProtocolUri }) => parsedProtocolUri)

    return protocolUris
  }

  public filterSupportedProtocolsByProtocolUris(parsedProtocolUris: ParsedDidCommProtocolUri[]) {
    return this.supportedProtocolUris.filter((supportedProtocol) =>
      parsedProtocolUris.some((p) => supportsIncomingDidCommProtocolUri(supportedProtocol, p))
    )
  }
}

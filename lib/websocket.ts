// lib/websocket.ts
import { io, Socket } from "socket.io-client"

export interface GameMessage {
  type:
    | "player_joined"
    | "game_started"
    | "team_selected"
    | "sentence_submitted"
    | "vote_cast"
    | "phase_changed"
    | "game_reset"
    | "sentence_update"
    | "force_submit"
  payload: any
  timestamp: number
}

class GameWebSocket {
  private socket: Socket
  private messageHandlers: ((msg: GameMessage) => void)[] = []

  constructor() {
    this.socket = io()

    this.socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO")
    })

    this.socket.on("game_message", (msg: GameMessage) => {
      this.messageHandlers.forEach((handler) => handler(msg))
    })
  }

  public sendMessage(message: Omit<GameMessage, "timestamp">) {
    const fullMessage: GameMessage = {
      ...message,
      timestamp: Date.now()
    }
    this.socket.emit("game_message", fullMessage)
  }

  public onMessage(handler: (message: GameMessage) => void) {
    this.messageHandlers.push(handler)
  }

  public disconnect() {
    this.socket.disconnect()
  }
}

let gameWebSocket: GameWebSocket | null = null

export function getGameWebSocket(): GameWebSocket {
  if (!gameWebSocket) {
    gameWebSocket = new GameWebSocket()
  }
  return gameWebSocket
}

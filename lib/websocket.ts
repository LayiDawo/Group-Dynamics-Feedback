"use client"

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

export class GameWebSocket {
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: ((message: GameMessage) => void)[] = []
  private roomKey: string

  constructor(private gameId: string) {
    this.roomKey = `game_room_${this.gameId}`
    this.connect()
  }

  private connect() {
    try {
      console.log(`Connected to game room: ${this.gameId}`)
      this.reconnectAttempts = 0

      // Fire initial message (optional)
      setTimeout(() => {
        this.notifyHandlers({
          type: "phase_changed",
          payload: { connected: true },
          timestamp: Date.now(),
        })
      }, 100)
    } catch (error) {
      console.error("WebSocket simulation failed:", error)
      this.handleReconnect()
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)

      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts)
    }
  }

  public sendMessage(message: Omit<GameMessage, "timestamp">) {
    const fullMessage: GameMessage = {
      ...message,
      timestamp: Date.now(),
    }

    const existingMessages: GameMessage[] = JSON.parse(localStorage.getItem(this.roomKey) || "[]")
    existingMessages.push(fullMessage)

    // Keep last 100 messages
    if (existingMessages.length > 100) {
      existingMessages.splice(0, existingMessages.length - 100)
    }

    localStorage.setItem(this.roomKey, JSON.stringify(existingMessages))
  }

  public onMessage(handler: (message: GameMessage) => void) {
    this.messageHandlers.push(handler)

    const handleStorage = (event: StorageEvent) => {
      if (event.key === this.roomKey && event.newValue) {
        const messages: GameMessage[] = JSON.parse(event.newValue)
        const lastMessage = messages[messages.length - 1]
        if (lastMessage) {
          handler(lastMessage)
        }
      }
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      const index = this.messageHandlers.indexOf(handler)
      if (index > -1) {
        this.messageHandlers.splice(index, 1)
      }
      window.removeEventListener("storage", handleStorage)
    }
  }

  private notifyHandlers(message: GameMessage) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message)
      } catch (error) {
        console.error("Error in message handler:", error)
      }
    })
  }

  public disconnect() {
    this.messageHandlers = []
  }
}

let gameWebSocket: GameWebSocket | null = null

export function getGameWebSocket(gameId = "default"): GameWebSocket {
  if (!gameWebSocket) {
    gameWebSocket = new GameWebSocket(gameId)
  }
  return gameWebSocket
}

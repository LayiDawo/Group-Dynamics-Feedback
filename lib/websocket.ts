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
  payload: any
  timestamp: number
}

export class GameWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: ((message: GameMessage) => void)[] = []

  constructor(private gameId: string) {
    this.connect()
  }

  private connect() {
    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo purposes, we'll simulate WebSocket behavior
      this.simulateWebSocket()
    } catch (error) {
      console.error("WebSocket connection failed:", error)
      this.handleReconnect()
    }
  }

  private simulateWebSocket() {
    // Simulate WebSocket connection for demo
    // In production, replace with: new WebSocket(`ws://your-server.com/game/${this.gameId}`)

    console.log(`Connected to game room: ${this.gameId}`)
    this.reconnectAttempts = 0

    // Simulate connection success
    setTimeout(() => {
      this.notifyHandlers({
        type: "phase_changed",
        payload: { connected: true },
        timestamp: Date.now(),
      })
    }, 100)
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)

      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  public sendMessage(message: Omit<GameMessage, "timestamp">) {
    const fullMessage: GameMessage = {
      ...message,
      timestamp: Date.now(),
    }

    // In a real implementation, send via WebSocket
    // this.ws?.send(JSON.stringify(fullMessage))

    // For demo, broadcast to all connected clients in the same room
    this.broadcastToRoom(fullMessage)
  }

  private broadcastToRoom(message: GameMessage) {
    // Simulate broadcasting to other clients
    // In production, this would be handled by your WebSocket server

    // Store in localStorage to simulate cross-tab communication
    const roomKey = `game_room_${this.gameId}`
    const existingMessages = JSON.parse(localStorage.getItem(roomKey) || "[]")
    existingMessages.push(message)

    // Keep only last 100 messages
    if (existingMessages.length > 100) {
      existingMessages.splice(0, existingMessages.length - 100)
    }

    localStorage.setItem(roomKey, JSON.stringify(existingMessages))

    // Notify other tabs/windows
    window.dispatchEvent(new CustomEvent("game_message", { detail: message }))

    // Echo back to current client after a small delay to simulate network
    setTimeout(() => {
      this.notifyHandlers(message)
    }, 50)
  }

  public onMessage(handler: (message: GameMessage) => void) {
    this.messageHandlers.push(handler)

    // Listen for cross-tab messages
    const handleStorageMessage = (event: CustomEvent<GameMessage>) => {
      handler(event.detail)
    }

    window.addEventListener("game_message", handleStorageMessage as EventListener)

    // Return cleanup function
    return () => {
      const index = this.messageHandlers.indexOf(handler)
      if (index > -1) {
        this.messageHandlers.splice(index, 1)
      }
      window.removeEventListener("game_message", handleStorageMessage as EventListener)
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
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// Singleton instance for the game
let gameWebSocket: GameWebSocket | null = null

export function getGameWebSocket(gameId = "default"): GameWebSocket {
  if (!gameWebSocket) {
    gameWebSocket = new GameWebSocket(gameId)
  }
  return gameWebSocket
}

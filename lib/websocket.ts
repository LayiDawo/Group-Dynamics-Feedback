// lib/websocket.ts
"use client"

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

let socket: Socket | null = null

export function getGameWebSocket(): {
  sendMessage: (message: Omit<GameMessage, "timestamp">) => void
  onMessage: (handler: (message: GameMessage) => void) => void
} {
  if (!socket) {
    socket = io("https://your-backend-url.onrender.com") // 🔁 Replace with your actual Render backend URL
  }

  function sendMessage(message: Omit<GameMessage, "timestamp">) {
    const fullMessage: GameMessage = {
      ...message,
      timestamp: Date.now(),
    }
    socket?.emit("message", fullMessage)
  }

  function onMessage(handler: (message: GameMessage) => void) {
    socket?.on("message", handler)
  }

  return {
    sendMessage,
    onMessage,
  }
}

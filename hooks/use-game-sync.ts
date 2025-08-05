"use client"

import type React from "react"

import { useEffect, useCallback } from "react"
import { getGameWebSocket, type GameMessage } from "@/lib/websocket"

interface Player {
  id: string
  name: string
  team: string
  role: string
  isAdmin: boolean
  question?: string
}

interface GameState {
  phase: "landing" | "waiting" | "spinning" | "sentence" | "voting" | "results" | "finished"
  players: Player[]
  currentQuestion: string
  availableTeams: string[]
  selectedTeam: string
  sentences: { playerId: string; sentence: string }[]
  votes: { playerId: string; vote: "agree" | "disagree"; reason: string }[]
  questionIndex: number
}

export function useGameSync(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  currentPlayer: Player | null,
) {
  const ws = getGameWebSocket()

  // Send updates to other clients
  const broadcastUpdate = useCallback(
    (type: GameMessage["type"], payload: any) => {
      ws.sendMessage({ type, payload })
    },
    [ws],
  )

  // Handle incoming messages from other clients
  useEffect(() => {
    const cleanup = ws.onMessage((message: GameMessage) => {
      // Don't process our own messages
      if (message.payload.senderId === currentPlayer?.id) return

      switch (message.type) {
        case "player_joined":
          setGameState((prev) => ({
            ...prev,
            players: [...prev.players.filter((p) => p.id !== message.payload.player.id), message.payload.player],
          }))
          break

        case "game_started":
          setGameState((prev) => ({
            ...prev,
            phase: "spinning",
            currentQuestion: message.payload.question,
          }))
          break

        case "team_selected":
          setGameState((prev) => ({
            ...prev,
            selectedTeam: message.payload.team,
          }))
          break

        case "sentence_submitted":
          setGameState((prev) => ({
            ...prev,
            sentences: [
              ...prev.sentences.filter((s) => s.playerId !== message.payload.playerId),
              {
                playerId: message.payload.playerId,
                sentence: message.payload.sentence,
              },
            ],
            phase: "voting",
          }))
          break

        case "vote_cast":
          setGameState((prev) => ({
            ...prev,
            votes: [
              ...prev.votes.filter((v) => v.playerId !== message.payload.playerId),
              {
                playerId: message.payload.playerId,
                vote: message.payload.vote,
                reason: message.payload.reason,
              },
            ],
          }))
          break

        case "phase_changed":
          if (message.payload.newPhase) {
            setGameState((prev) => ({
              ...prev,
              phase: message.payload.newPhase,
              ...message.payload.stateUpdates,
            }))
          }
          break

        case "game_reset":
          setGameState(message.payload.newState)
          break
      }
    })

    return cleanup
  }, [ws, setGameState, currentPlayer?.id])

  // Broadcast functions
  const broadcastPlayerJoined = useCallback(
    (player: Player) => {
      broadcastUpdate("player_joined", { player, senderId: player.id })
    },
    [broadcastUpdate],
  )

  const broadcastGameStarted = useCallback(
    (question: string) => {
      broadcastUpdate("game_started", { question, senderId: currentPlayer?.id })
    },
    [broadcastUpdate, currentPlayer?.id],
  )

  const broadcastTeamSelected = useCallback(
    (team: string) => {
      broadcastUpdate("team_selected", { team, senderId: currentPlayer?.id })
    },
    [broadcastUpdate, currentPlayer?.id],
  )

  const broadcastSentenceSubmitted = useCallback(
    (sentence: string) => {
      broadcastUpdate("sentence_submitted", {
        playerId: currentPlayer?.id,
        sentence,
        senderId: currentPlayer?.id,
      })
    },
    [broadcastUpdate, currentPlayer?.id],
  )

  const broadcastVoteCast = useCallback(
    (vote: "agree" | "disagree", reason: string) => {
      broadcastUpdate("vote_cast", {
        playerId: currentPlayer?.id,
        vote,
        reason,
        senderId: currentPlayer?.id,
      })
    },
    [broadcastUpdate, currentPlayer?.id],
  )

  const broadcastPhaseChange = useCallback(
    (newPhase: GameState["phase"], stateUpdates?: Partial<GameState>) => {
      broadcastUpdate("phase_changed", {
        newPhase,
        stateUpdates,
        senderId: currentPlayer?.id,
      })
    },
    [broadcastUpdate, currentPlayer?.id],
  )

  const broadcastGameReset = useCallback(
    (newState: GameState) => {
      broadcastUpdate("game_reset", { newState, senderId: currentPlayer?.id })
    },
    [broadcastUpdate, currentPlayer?.id],
  )

  return {
    broadcastPlayerJoined,
    broadcastGameStarted,
    broadcastTeamSelected,
    broadcastSentenceSubmitted,
    broadcastVoteCast,
    broadcastPhaseChange,
    broadcastGameReset,
  }
}

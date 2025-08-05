"use client"

import type React from "react"
import { useEffect, useCallback, useRef } from "react"
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
  liveSentenceWords: string[]  // Added for real-time syncing
}

export function useGameSync(
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>,
  currentPlayer: Player | null,
) {
  const ws = getGameWebSocket()

  const voteCallbackRef = useRef<((vote: { playerId: string; vote: "agree" | "disagree"; reason: string }) => void) | null>(null)

  // Handle incoming messages from other clients
  useEffect(() => {
    const handler = (message: GameMessage) => {
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
            phase: "spinning", // Ensure clients know they're in spinner phase
          }))
          break

        case "sentence_update":
          setGameState((prev) => ({
            ...prev,
            liveSentenceWords: message.payload.sentenceWords,
          }))
          break

        // Inside GameMessage type handling
        case "force_submit":
          setGameState((prev) => ({
          ...prev,
          phase: message.payload.nextPhase,
          ...message.payload.stateUpdates,
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
            liveSentenceWords: [], // clear live words after submit
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
          voteCallbackRef.current?.({
            playerId: message.payload.playerId,
            vote: message.payload.vote,
            reason: message.payload.reason,
          })
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
    }

    ws.onMessage(handler)
    return () => {
      voteCallbackRef.current = null // clean up the vote callback
    }
  }, [ws, setGameState, currentPlayer?.id])

  // Broadcast helper
  const broadcastUpdate = useCallback(
    (type: GameMessage["type"], payload: any) => {
      ws.sendMessage({ type, payload })
    },
    [ws],
  )

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

  const broadcastSentenceUpdate = useCallback(
    (words: string[]) => {
      broadcastUpdate("sentence_update", {
        sentenceWords: words,
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

  const broadcastForceSubmit = useCallback(
  (nextPhase: GameState["phase"], stateUpdates?: Partial<GameState>) => {
    broadcastUpdate("force_submit", {
      nextPhase,
      stateUpdates,
      senderId: currentPlayer?.id,
    })
  },
  [broadcastUpdate, currentPlayer?.id],
)


  // Add incoming vote listener
  const onIncomingVote = useCallback(
    (callback: (vote: { playerId: string; vote: "agree" | "disagree"; reason: string }) => void) => {
      voteCallbackRef.current = callback

      return () => {
        voteCallbackRef.current = null
      }
    },
    [],
  )

  return {
    broadcastPlayerJoined,
    broadcastGameStarted,
    broadcastTeamSelected,
    broadcastSentenceSubmitted,
    broadcastSentenceUpdate,
    broadcastVoteCast,
    broadcastPhaseChange,
    broadcastGameReset,
    onIncomingVote,
    broadcastForceSubmit,
  }
}

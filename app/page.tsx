'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Users, GamepadIcon, Sparkles } from 'lucide-react'
import SpinWheel from '@/components/spin-wheel'
import SentenceCreator from '@/components/sentence-creator'
import VotingInterface from '@/components/voting-interface'
import GameResults from '@/components/game-results'

interface Player {
  id: string
  name: string
  team: string
  role: string
  isAdmin: boolean
  question?: string
}

interface GameState {
  phase: 'landing' | 'waiting' | 'spinning' | 'sentence' | 'voting' | 'results' | 'finished'
  players: Player[]
  currentQuestion: string
  availableTeams: string[]
  selectedTeam: string
  sentences: { playerId: string, sentence: string }[]
  votes: { playerId: string, vote: 'agree' | 'disagree', reason: string }[]
  questionIndex: number
}

const teams = ['Executive', 'Review', 'Teaching', 'Energizer']
const roles = ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator', 'Specialist']

const predefinedQuestions = [
  "What is the most important skill for effective teamwork?",
  "How can we improve communication in our organization?",
  "What motivates you most in your work environment?",
  "What is the biggest challenge facing our team right now?"
]

export default function ClassroomGame() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'landing',
    players: [],
    currentQuestion: '',
    availableTeams: [...teams],
    selectedTeam: '',
    sentences: [],
    votes: [],
    questionIndex: 0
  })

  const [formData, setFormData] = useState({
    name: '',
    team: '',
    role: '',
    isAdmin: false,
    question: ''
  })

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)

  const handleRegistration = () => {
    if (!formData.name || !formData.team || !formData.role) return

    const newPlayer: Player = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      team: formData.team,
      role: formData.role,
      isAdmin: formData.isAdmin,
      question: formData.question || undefined
    }

    setCurrentPlayer(newPlayer)
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer],
      phase: 'waiting'
    }))
  }

  const startGame = () => {
    if (!currentPlayer?.isAdmin) return
    
    setGameState(prev => ({
      ...prev,
      phase: 'spinning',
      currentQuestion: predefinedQuestions[0]
    }))
  }

  if (gameState.phase === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <GamepadIcon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Team Game Hub
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Register your device to join the fun! 🎉
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="border-2 border-purple-200 focus:border-purple-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team" className="text-sm font-semibold">Select Your Team</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, team: value }))}>
                <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Choose a team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold">Your Role</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger className="border-2 border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="admin"
                checked={formData.isAdmin}
                onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.checked }))}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <Label htmlFor="admin" className="text-sm font-semibold">I am an admin</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-semibold">
                Question for Feedback (Optional)
              </Label>
              <Textarea
                id="question"
                placeholder="Enter a question you'd like the group to discuss..."
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="border-2 border-purple-200 focus:border-purple-400 min-h-[80px]"
              />
            </div>

            <Button 
              onClick={handleRegistration}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-lg transform transition hover:scale-105"
              disabled={!formData.name || !formData.team || !formData.role}
            >
              <Users className="w-5 h-5 mr-2" />
              Join the Game!
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState.phase === 'waiting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 backdrop-blur text-center">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome, {currentPlayer?.name}! 🎊
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {currentPlayer?.isAdmin 
                ? "You're the admin! Start the game when everyone is ready."
                : "Waiting for an admin to start the game..."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg">
              <p className="text-sm font-semibold text-gray-700">Players Joined: {gameState.players.length}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {gameState.players.map(player => (
                  <span key={player.id} className="px-3 py-1 bg-white rounded-full text-xs font-medium shadow">
                    {player.name} ({player.team})
                  </span>
                ))}
              </div>
            </div>

            {currentPlayer?.isAdmin && (
              <Button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-4 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                <GamepadIcon className="w-5 h-5 mr-2" />
                Start the Game! 🚀
              </Button>
            )}

            {!currentPlayer?.isAdmin && (
              <div className="animate-bounce">
                <div className="w-8 h-8 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Spinning wheel phase
  if (gameState.phase === 'spinning') {
    return (
      <SpinWheel
        teams={gameState.availableTeams}
        onTeamSelected={(team) => {
          setGameState(prev => ({
            ...prev,
            selectedTeam: team
          }))
        }}
        onContinue={() => {
          setGameState(prev => ({
            ...prev,
            phase: 'sentence',
            availableTeams: prev.availableTeams.filter(team => team !== prev.selectedTeam)
          }))
        }}
      />
    )
  }

  // Sentence creation phase
  if (gameState.phase === 'sentence') {
    return (
      <SentenceCreator
        question={gameState.currentQuestion}
        selectedTeam={gameState.selectedTeam}
        onSubmit={(sentence) => {
          setGameState(prev => ({
            ...prev,
            sentences: [...prev.sentences, { playerId: currentPlayer?.id || '', sentence }],
            phase: 'voting'
          }))
        }}
      />
    )
  }

  // Voting phase
  if (gameState.phase === 'voting') {
    const currentSentence = gameState.sentences[gameState.sentences.length - 1]
    
    return (
      <VotingInterface
        question={gameState.currentQuestion}
        selectedTeam={gameState.selectedTeam}
        sentence={currentSentence?.sentence || ''}
        onVote={(vote, reason) => {
          const newVotes = [...gameState.votes, { 
            playerId: currentPlayer?.id || '', 
            vote, 
            reason 
          }]
          
          setGameState(prev => ({
            ...prev,
            votes: newVotes,
            phase: 'results'
          }))
        }}
      />
    )
  }

  // Results phase
  if (gameState.phase === 'results') {
    const currentSentence = gameState.sentences[gameState.sentences.length - 1]
    const isLastTeam = gameState.availableTeams.length === 0
    const isLastQuestion = gameState.questionIndex >= predefinedQuestions.length - 1
    const userQuestions = gameState.players.filter(p => p.question).map(p => p.question!)
    const isLastUserQuestion = gameState.questionIndex >= predefinedQuestions.length + userQuestions.length - 1
    
    return (
      <GameResults
        question={gameState.currentQuestion}
        selectedTeam={gameState.selectedTeam}
        sentence={currentSentence?.sentence || ''}
        votes={gameState.votes}
        isGameFinished={isLastTeam && isLastUserQuestion}
        onContinue={() => {
          if (isLastTeam) {
            // Move to next question or finish game
            const nextQuestionIndex = gameState.questionIndex + 1
            
            if (nextQuestionIndex < predefinedQuestions.length) {
              // Next predefined question
              setGameState(prev => ({
                ...prev,
                phase: 'spinning',
                availableTeams: [...teams],
                selectedTeam: '',
                sentences: [],
                votes: [],
                questionIndex: nextQuestionIndex,
                currentQuestion: predefinedQuestions[nextQuestionIndex]
              }))
            } else if (nextQuestionIndex < predefinedQuestions.length + userQuestions.length) {
              // User submitted questions
              const userQuestionIndex = nextQuestionIndex - predefinedQuestions.length
              setGameState(prev => ({
                ...prev,
                phase: 'spinning',
                availableTeams: [...teams],
                selectedTeam: '',
                sentences: [],
                votes: [],
                questionIndex: nextQuestionIndex,
                currentQuestion: userQuestions[userQuestionIndex]
              }))
            } else {
              // Game finished
              setGameState(prev => ({
                ...prev,
                phase: 'finished'
              }))
            }
          } else {
            // Continue with next team for same question
            setGameState(prev => ({
              ...prev,
              phase: 'spinning',
              selectedTeam: '',
              sentences: [],
              votes: []
            }))
          }
        }}
      />
    )
  }

  // Game finished
  if (gameState.phase === 'finished') {
    const allVotes = gameState.votes
    return (
      <GameResults
        question="Game Complete!"
        selectedTeam="All Teams"
        sentence="Thank you for participating!"
        votes={allVotes}
        isGameFinished={true}
        onContinue={() => {}}
      />
    )
  }

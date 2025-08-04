'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, MessageCircle, Sparkles } from 'lucide-react'

interface Vote {
  playerId: string
  vote: 'agree' | 'disagree'
  reason: string
}

interface GameResultsProps {
  question: string
  selectedTeam: string
  sentence: string
  votes: Vote[]
  onContinue: () => void
  isGameFinished?: boolean
}

const teamColors = {
  'Executive': '#FF6B6B',
  'Review': '#4ECDC4', 
  'Teaching': '#45B7D1',
  'Energizer': '#96CEB4'
}

export default function GameResults({ 
  question, 
  selectedTeam, 
  sentence, 
  votes, 
  onContinue, 
  isGameFinished = false 
}: GameResultsProps) {
  const agreeVotes = votes.filter(v => v.vote === 'agree')
  const disagreeVotes = votes.filter(v => v.vote === 'disagree')
  const agreePercentage = votes.length > 0 ? Math.round((agreeVotes.length / votes.length) * 100) : 0

  if (isGameFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur text-center">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              🎉 Thank You for Playing! 🎉
            </CardTitle>
            <p className="text-xl text-gray-600">
              What an amazing session of collaboration and discussion!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold text-gray-800">Teams Participated</p>
                <p className="text-2xl font-bold text-blue-600">4</p>
              </div>
              <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-semibold text-gray-800">Total Votes</p>
                <p className="text-2xl font-bold text-green-600">{votes.length}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <p className="font-semibold text-gray-800">Engagement</p>
                <p className="text-2xl font-bold text-orange-600">100%</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-3">🌟 Key Takeaways</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li>• Every team brought unique perspectives to the discussion</li>
                <li>• Diverse viewpoints led to richer conversations</li>
                <li>• Both agreement and disagreement sparked valuable insights</li>
                <li>• Collaborative thinking strengthened team bonds</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-600 mb-4">
                Great job everyone! Keep the conversation going! 💬
              </p>
              <div className="flex justify-center space-x-2">
                <span className="text-2xl">🎊</span>
                <span className="text-2xl">🎉</span>
                <span className="text-2xl">👏</span>
                <span className="text-2xl">🌟</span>
                <span className="text-2xl">🎈</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              📊 Round Results
            </CardTitle>
            <p className="text-gray-600 mt-2">Here's how everyone voted!</p>
          </CardHeader>
        </Card>

        {/* Question and Response */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Question:</p>
              <p className="text-lg text-gray-800">{question}</p>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: teamColors[selectedTeam as keyof typeof teamColors] }}
              ></div>
              <Badge 
                variant="secondary" 
                className="text-sm font-semibold"
                style={{ 
                  backgroundColor: `${teamColors[selectedTeam as keyof typeof teamColors]}20`,
                  color: teamColors[selectedTeam as keyof typeof teamColors]
                }}
              >
                {selectedTeam} Team Response
              </Badge>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
              <p className="text-xl text-gray-800 font-medium italic">"{sentence}"</p>
            </div>
          </CardContent>
        </Card>

        {/* Voting Results */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Voting Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vote Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{agreeVotes.length}</div>
                <div className="text-green-700 font-semibold">Agree ({agreePercentage}%)</div>
              </div>
              <div className="bg-gradient-to-r from-red-100 to-pink-100 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{disagreeVotes.length}</div>
                <div className="text-red-700 font-semibold">Disagree ({100 - agreePercentage}%)</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${agreePercentage}%` }}
              ></div>
            </div>

            {/* Detailed Votes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Reasoning from participants:</h4>
              <div className="grid gap-4 max-h-60 overflow-y-auto">
                {votes.map((vote, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      vote.vote === 'agree' 
                        ? 'bg-green-50 border-green-400' 
                        : 'bg-red-50 border-red-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant={vote.vote === 'agree' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {vote.vote === 'agree' ? '👍 Agree' : '👎 Disagree'}
                      </Badge>
                    </div>
                    <p className="text-gray-700 text-sm">{vote.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-12 py-4 rounded-lg shadow-lg transform transition hover:scale-105 text-lg"
          >
            Continue to Next Round 🎯
          </Button>
        </div>
      </div>
    </div>
  )
}

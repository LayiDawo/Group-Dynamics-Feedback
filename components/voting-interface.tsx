'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

interface VotingInterfaceProps {
  question: string
  selectedTeam: string
  sentence: string
  onVote: (vote: 'agree' | 'disagree', reason: string) => void
}

const teamColors = {
  'Executive': '#FF6B6B',
  'Review': '#4ECDC4', 
  'Teaching': '#45B7D1',
  'Energizer': '#96CEB4'
}

export default function VotingInterface({ question, selectedTeam, sentence, onVote }: VotingInterfaceProps) {
  const [selectedVote, setSelectedVote] = useState<'agree' | 'disagree' | null>(null)
  const [reason, setReason] = useState('')

  const handleSubmitVote = () => {
    if (selectedVote && reason.trim()) {
      onVote(selectedVote, reason.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              🗳️ Voting Time!
            </CardTitle>
            <p className="text-gray-600 mt-2">Read the response and cast your vote</p>
          </CardHeader>
        </Card>

        {/* Question Display */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Original Question:</p>
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
                {selectedTeam} Team
              </Badge>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-l-4 border-orange-400">
              <p className="text-sm font-semibold text-gray-600 mb-2">Team Response:</p>
              <p className="text-xl text-gray-800 font-medium italic">"{sentence}"</p>
            </div>
          </CardContent>
        </Card>

        {/* Voting Section */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Cast Your Vote
            </CardTitle>
            <p className="text-gray-600">Do you agree or disagree with this response?</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vote Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setSelectedVote('agree')}
                variant={selectedVote === 'agree' ? 'default' : 'outline'}
                className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 ${
                  selectedVote === 'agree' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' 
                    : 'border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                <ThumbsUp className="w-6 h-6 mr-2" />
                Agree
              </Button>

              <Button
                onClick={() => setSelectedVote('disagree')}
                variant={selectedVote === 'disagree' ? 'default' : 'outline'}
                className={`px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform transition hover:scale-105 ${
                  selectedVote === 'disagree' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white' 
                    : 'border-red-300 text-red-700 hover:bg-red-50'
                }`}
              >
                <ThumbsDown className="w-6 h-6 mr-2" />
                Disagree
              </Button>
            </div>

            {/* Reason Input */}
            {selectedVote && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-semibold text-gray-700">
                  Please explain your reasoning:
                </label>
                <Textarea
                  placeholder={`Why do you ${selectedVote} with this response? Share your thoughts...`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[120px] border-2 border-gray-200 focus:border-blue-400 rounded-lg"
                />
                <p className="text-xs text-gray-500">
                  Your reasoning helps everyone understand different perspectives.
                </p>
              </div>
            )}

            {/* Submit Button */}
            {selectedVote && reason.trim() && (
              <div className="text-center animate-in slide-in-from-bottom-2 duration-300">
                <Button
                  onClick={handleSubmitVote}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-12 py-4 rounded-lg shadow-lg transform transition hover:scale-105 text-lg"
                >
                  Submit Vote
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 text-center">
              💡 <strong>Remember:</strong> Both agreement and disagreement are valuable! 
              Your reasoning helps create meaningful discussions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

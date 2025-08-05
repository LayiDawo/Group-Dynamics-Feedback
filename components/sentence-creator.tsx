'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Send } from 'lucide-react'

interface Player {
  id: string
  name: string
  team: string
  role: string
  isAdmin: boolean
}

interface SentenceCreatorProps {
  question: string
  selectedTeam: string
  currentPlayer: Player | null
  gameState: {
    liveSentenceWords: string[] // from game sync state
  }
  broadcastSentenceUpdate: (words: string[]) => void
  onSubmit: (sentence: string) => void
}

const wordBank = {
  subjects: ['Team', 'Leadership', 'Communication', 'Innovation', 'Collaboration', 'Strategy', 'Growth', 'Success'],
  verbs: ['requires', 'needs', 'involves', 'creates', 'builds', 'develops', 'improves', 'enhances', 'drives', 'supports'],
  objects: ['trust', 'transparency', 'dedication', 'creativity', 'flexibility', 'accountability', 'respect', 'empathy', 'vision', 'commitment'],
  adjectives: ['effective', 'strong', 'clear', 'innovative', 'collaborative', 'strategic', 'sustainable', 'meaningful', 'impactful', 'authentic'],
  connectors: ['and', 'but', 'because', 'therefore', 'however', 'while', 'through', 'with', 'by', 'for']
}

const teamColors = {
  'Executive': '#FF6B6B',
  'Review': '#4ECDC4', 
  'Teaching': '#45B7D1',
  'Energizer': '#96CEB4'
}

export default function SentenceCreator({
  question,
  selectedTeam,
  currentPlayer,
  gameState,
  broadcastSentenceUpdate,
  onSubmit,
}: SentenceCreatorProps) {
  // Use the liveSentenceWords from gameState to sync across clients
  const [selectedWords, setSelectedWords] = useState<string[]>(gameState.liveSentenceWords || [])
  const [activeCategory, setActiveCategory] = useState<keyof typeof wordBank>('subjects')

  // Sync local selectedWords when gameState.liveSentenceWords changes
  useEffect(() => {
    setSelectedWords(gameState.liveSentenceWords || [])
  }, [gameState.liveSentenceWords])

  // Only allow drag/add/remove if current player is on selected team OR is admin
  const canEdit = currentPlayer?.isAdmin || currentPlayer?.team === selectedTeam

  const addWord = (word: string) => {
    if (!canEdit) return
    const newWords = [...selectedWords, word]
    setSelectedWords(newWords)
    broadcastSentenceUpdate(newWords)
  }

  const removeWord = (index: number) => {
    if (!canEdit) return
    const newWords = selectedWords.filter((_, i) => i !== index)
    setSelectedWords(newWords)
    broadcastSentenceUpdate(newWords)
  }

  const clearSentence = () => {
    if (!canEdit) return
    setSelectedWords([])
    broadcastSentenceUpdate([])
  }

  const submitSentence = () => {
    if (selectedWords.length > 0) {
      const sentence = selectedWords.join(' ')
      onSubmit(sentence)
    }
  }

  const sentence = selectedWords.join(' ')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div 
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: teamColors[selectedTeam as keyof typeof teamColors] }}
              ></div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {selectedTeam} Team Response
              </CardTitle>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
              <p className="text-lg font-semibold text-gray-800 mb-2">Question:</p>
              <p className="text-gray-700">{question}</p>
            </div>
          </CardHeader>
        </Card>

        {/* Sentence Display */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Your Sentence:</h3>
              <Button
                onClick={clearSentence}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
                disabled={!canEdit}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
            
            <div className="min-h-[100px] p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              {selectedWords.length === 0 ? (
                <p className="text-gray-500 italic">Click words below to build your sentence...</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedWords.map((word, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`cursor-pointer px-3 py-1 text-sm transition-colors ${
                        canEdit
                          ? "hover:bg-red-100 hover:text-red-700"
                          : "cursor-default opacity-60"
                      }`}
                      onClick={() => canEdit && removeWord(index)}
                    >
                      {word} {canEdit && "×"}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {sentence && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <p className="text-gray-800 font-medium">Preview: "{sentence}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Word Bank */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Word Bank</CardTitle>
            <div className="flex flex-wrap gap-2">
              {Object.keys(wordBank).map((category) => (
                <Button
                  key={category}
                  onClick={() => setActiveCategory(category as keyof typeof wordBank)}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  className={activeCategory === category ? "bg-purple-500 hover:bg-purple-600" : ""}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {wordBank[activeCategory].map((word, index) => (
                <Button
                  key={index}
                  onClick={() => addWord(word)}
                  variant="outline"
                  className={`h-auto py-3 px-4 text-sm transition-all transform hover:scale-105 ${
                    canEdit ? "hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700" : "opacity-60 cursor-not-allowed"
                  }`}
                  disabled={!canEdit}
                >
                  {word}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center">
          <Button
            onClick={submitSentence}
            disabled={selectedWords.length === 0 || !canEdit}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-12 py-4 rounded-lg shadow-lg transform transition hover:scale-105 text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Response
          </Button>
        </div>
      </div>
    </div>
  )
}

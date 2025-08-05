"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Play, Users } from "lucide-react"

interface SpinWheelProps {
  teams: string[]
  onTeamSelected: (team: string) => void
  onContinue: () => void
}

const teamColors = {
  Executive: "#FF6B6B",
  Review: "#4ECDC4",
  Teaching: "#45B7D1",
  Energizer: "#96CEB4",
}

export default function SpinWheel({ teams, onTeamSelected, onContinue }: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  const spinWheel = () => {
    if (teams.length === 0) return

    setIsSpinning(true)
    setSelectedTeam(null)

    // Random rotation between 1440 and 2160 degrees (4-6 full rotations)
    const randomRotation = 1440 + Math.random() * 720
    setRotation((prev) => prev + randomRotation)

    setTimeout(() => {
      const selectedIndex = Math.floor(Math.random() * teams.length)
      const selected = teams[selectedIndex]
      setSelectedTeam(selected)
      setIsSpinning(false)
      onTeamSelected(selected)
    }, 3000)
  }

  const handleContinue = () => {
    if (selectedTeam) {
      onContinue()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/95 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🎯 Live Team Selector
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {teams.length === 4
              ? "New round starting! Spin to select the first team."
              : `${teams.length} teams remaining - spin to select the next one!`}
          </p>
          <div className="mt-3 flex justify-center gap-2">
            {teams.map((team) => (
              <Badge
                key={team}
                variant="secondary"
                className="text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: teamColors[team as keyof typeof teamColors] }}
              >
                {team}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <div className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg mx-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Current Question:</p>
              <p className="text-lg text-gray-800 font-medium">
                {teams.length === 4 ? "Starting new round!" : "Continuing with current question..."}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>All players watching</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <CardContent className="space-y-8">
          <div className="relative mx-auto w-80 h-80">
            {/* Wheel */}
            <div
              className={`w-full h-full rounded-full border-8 border-white shadow-2xl transition-transform duration-3000 ease-out relative overflow-hidden`}
              style={{
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(${teams
                  .map((team, index) => {
                    const segmentSize = 100 / teams.length
                    const startPercent = index * segmentSize
                    const endPercent = (index + 1) * segmentSize
                    return `${teamColors[team as keyof typeof teamColors]} ${startPercent}% ${endPercent}%`
                  })
                  .join(", ")})`,
              }}
            >
              {/* Team labels */}
              {teams.map((team, index) => {
                const segmentAngle = 360 / teams.length
                const angle = index * segmentAngle + segmentAngle / 2 - 90 // -90 to start from top
                const radius = 110 // Distance from center
                const x = 50 + (radius * Math.cos((angle * Math.PI) / 180)) / 3.2 // Adjust for container size
                const y = 50 + (radius * Math.sin((angle * Math.PI) / 180)) / 3.2

                return (
                  <div
                    key={`label-${team}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                  >
                    <span
                      className="text-white font-bold text-lg drop-shadow-lg whitespace-nowrap"
                      style={{
                        transform: `rotate(${angle + 90}deg)`,
                      }}
                    >
                      {team}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Center pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white shadow-lg"></div>
            </div>

            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-10">
              <Play className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {selectedTeam && (
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">🎉 Selected Team:</h3>
                <p
                  className="text-3xl font-bold px-6 py-3 rounded-full text-white inline-block shadow-lg"
                  style={{ backgroundColor: teamColors[selectedTeam as keyof typeof teamColors] }}
                >
                  {selectedTeam}
                </p>
                <p className="text-sm text-gray-600 mt-2">All players will see this selection live!</p>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button
              onClick={spinWheel}
              disabled={isSpinning || teams.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              {isSpinning ? "Spinning..." : selectedTeam ? "Spin Again" : "Spin the Wheel!"}
            </Button>

            {selectedTeam && (
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition hover:scale-105"
              >
                Continue with {selectedTeam}
              </Button>
            )}
          </div>

          {teams.length === 0 && (
            <div className="text-center p-6 bg-yellow-100 rounded-lg">
              <p className="text-yellow-800 font-semibold">All teams have been selected! 🎊</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"


interface Character {
  id: string
  name: string
  title: string
  description: string
  image: string
  personality: string[]
  role: string
  color: string
  abilities?: string[]
}

const characters: Character[] = [
  {
    id: "luna",
    name: "Luna",
    title: "The Curious Explorer",
    description: "A curious and determined girl who discovers a mysterious pocket watch that opens a portal to the Sun's kingdom. Guided by wonder and courage, she embarks on a journey to uncover the secrets of space weather.",
    image: "/images/characters/luna.png",
    personality: ["Curious", "Determined", "Brave", "Compassionate"],
    role: "Protagonist",
    color: "from-blue-500/20 to-purple-500/20",
    abilities: [
      "Portal Navigation",
      "Quick Learning",
      "Problem Solving",
      "Empathy"
    ]
  },
  {
    id: "flares",
    name: "Flares",
    title: "The Fiery Spirit",
    description: "A fiery spirit of solar flares, energetic and impulsive. Once a protector of the Sun, Flares's power was twisted by Pedroz but still holds the heart of a true guardian.",
    image: "/images/characters/flares.png",
    personality: ["Energetic", "Impulsive", "Loyal", "Protective"],
    role: "Guardian",
    color: "from-orange-500/20 to-red-500/20",
    abilities: [
      "Solar Flare Control",
      "Intense Heat",
      "Speed Boost",
      "Light Manipulation"
    ]
  },
  {
    id: "cme",
    name: "CME",
    title: "The Plasma Guardian",
    description: "A calm yet powerful being made of swirling plasma and light. CME represents wisdom and strength, but struggles to control the massive energy within.",
    image: "/images/characters/cme.png",
    personality: ["Calm", "Wise", "Powerful", "Conflicted"],
    role: "Guardian",
    color: "from-cyan-500/20 to-blue-500/20",
    abilities: [
      "Plasma Manipulation",
      "Energy Shield",
      "Mass Control",
      "Magnetic Fields"
    ]
  },
  {
    id: "pedroz",
    name: "Pedroz",
    title: "The Corrupted Guardian",
    description: "Once a noble guardian of the Sun, Pedroz was corrupted by the dark Voidlings. Now, he seeks to harness the Sun's power to invade and dominate Earth.",
    image: "/images/characters/pedroz.png",
    personality: ["Corrupted", "Ambitious", "Cunning", "Powerful"],
    role: "Antagonist",
    color: "from-purple-500/20 to-gray-900/20",
    abilities: [
      "Dark Energy",
      "Corruption Spread",
      "Solar Control",
      "Voidling Command"
    ]
  }
]

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characters[0])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <Navigation />
        <div className="text-center mb-16 mt-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet the Characters</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the heroes and guardians of the Cosmotrix universe
          </p>
        </div>

        {/* Character Selection Tabs */}
        <Tabs defaultValue="luna" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            {characters.map((char) => (
              <TabsTrigger
                key={char.id}
                value={char.id}
                onClick={() => setSelectedCharacter(char)}
                className="text-lg"
              >
                {char.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {characters.map((char) => (
            <TabsContent key={char.id} value={char.id} className="mt-0">
              {/* Character Detail Card */}
              <Card className={`overflow-hidden border-2 bg-gradient-to-br ${char.color}`}>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Character Image */}
                  <div className="relative h-[400px] md:h-[600px]">
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-contain p-8"
                      priority
                    />
                  </div>

                  {/* Character Info */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="mb-6">
                      <Badge variant="outline" className="mb-4 text-lg px-4 py-1">
                        {char.role}
                      </Badge>
                      <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        {char.name}
                      </h2>
                      <p className="text-xl text-muted-foreground mb-4">{char.title}</p>
                    </div>

                    <div className="space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Story</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {char.description}
                        </p>
                      </div>

                      {/* Personality Traits */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Personality</h3>
                        <div className="flex flex-wrap gap-2">
                          {char.personality.map((trait, index) => (
                            <Badge key={index} variant="secondary">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Abilities */}
                      {char.abilities && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Abilities</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {char.abilities.map((ability, index) => (
                              <div
                                key={index}
                                className="text-sm bg-secondary/50 rounded-md px-3 py-2"
                              >
                                {ability}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Character Grid Overview */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">All Characters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {characters.map((char) => (
              <Card
                key={char.id}
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => {
                  setSelectedCharacter(char)
                  document.querySelector(`[value="${char.id}"]`)?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  })
                }}
              >
                <div className={`h-48 relative bg-gradient-to-br ${char.color}`}>
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {char.name}
                  </CardTitle>
                  <CardDescription>{char.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{char.role}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Fun Facts Section */}
        <section className="mt-20">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-2xl">Did You Know?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="font-semibold mb-2">Luna's Pocket Watch</p>
                  <p className="text-sm text-muted-foreground">
                    The mysterious pocket watch that Luna discovers is actually a relic from an ancient civilization that studied space weather.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="font-semibold mb-2">Flaree's Origin</p>
                  <p className="text-sm text-muted-foreground">
                    Flaree was born from the most powerful solar flare ever recorded, giving them incredible energy but also making them unpredictable.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="font-semibold mb-2">CME's Power</p>
                  <p className="text-sm text-muted-foreground">
                    CME's plasma body contains enough energy to power entire cities, but must constantly maintain control to prevent catastrophic releases.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                  <p className="font-semibold mb-2">Pedroz's Fall</p>
                  <p className="text-sm text-muted-foreground">
                    Pedroz was once the Sun's most loyal guardian until the Voidlings exploited his desire for greater power to protect Earth.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

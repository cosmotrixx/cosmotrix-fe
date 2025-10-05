"use client"

import { useState } from "react"
import Image, { StaticImageData } from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Github, Linkedin, Mail } from "lucide-react"
import { Navigation } from "@/components/navigation"
import brenda from "@/public/images/team/brenda.png"
import micheline from "@/public/images/team/michel.png"
import safia from "@/public/images/team/mita.png"
import javen from "@/public/images/team/javen.png"
import vissuta from "@/public/images/team/suta.png"
import ryan from "@/public/images/team/ryan.png"

// Team member interface
interface TeamMember {
  name: string
  role: string
  image: StaticImageData
  bio: string
  github?: string
  linkedin?: string
  email?: string
}

// Reference interface
interface Reference {
  title: string
  author?: string
  url: string
  type: "documentation" | "research" | "data" | "tool" | "article"
  description?: string
}

// Sample team data - replace with your actual team
const teamMembers: TeamMember[] = [
  {
    name: "Micheline Wijaya Limbergh",
    role: "Project Leader",
    image: micheline,
    bio: "Leading the development of Cosmotrix and coordinating the team.",
    linkedin: "https://www.linkedin.com/in/micheline-wl"
  },
  {
    name: "Brenda Po Lok Fahida",
    role: "Illustrator & Animation",
    image: brenda,
    bio: "Creating illustrations and animations for interactive storytelling.",
    linkedin: "https://www.linkedin.com/in/brenda-po-lok-fahida-b7aaa720a/"
  },
  {
    name: "Safia Amita Khoirunnisa",
    role: "UI/UX Designer",
    image: safia,
    bio: "Designing user interfaces and crafting engaging user experiences.",
    linkedin: "https://www.linkedin.com/in/safia-amita/"
  },
  {
    name: "Javana Muhammad",
    role: "IT PM - Co Lead",
    image: javen,
    bio: "Managing project development and technical coordination.",
    linkedin: "https://www.linkedin.com/in/javanadz/"
  },
  {
    name: "Vissuta Gunawan Lim",
    role: "Software Engineer & AI Engineer",
    image: vissuta,
    bio: "Developing software solutions and implementing AI features.",
    linkedin: "https://www.linkedin.com/in/vissutagunawan"
  },
  {
    name: "Ryan Adidaru",
    role: "Software Engineer & AI Engineer",
    image: ryan,
    bio: "Building intelligent systems and engineering innovative solutions.",
    linkedin: "https://www.linkedin.com/in/ryan-adidaru-18a395277/"
  }
]

// Sample references - replace with your actual references
const references: Reference[] = [
  {
    title: "Solar Storms and Flares (CME)",
    author: "NASA Science",
    url: "https://science.nasa.gov/sun/solar-storms-and-flares/",
    type: "article",
    description: "Understanding coronal mass ejections and their impacts on space weather"
  },
  {
    title: "Space Weather Overview",
    author: "NASA Heliophysics",
    url: "https://science.nasa.gov/heliophysics/focus-areas/space-weather/",
    type: "article",
    description: "General overview of space weather and its significance"
  },
  {
    title: "National Survey of User Needs for Space Weather (2024)",
    author: "National Weather Service",
    url: "https://www.weather.gov/media/nws/Results-of-the-First-National-Survey-of-User-Needs-for-Space-Weather-2024.pdf",
    type: "research",
    description: "Recent space weather impacts and affected sectors - comprehensive user needs assessment"
  },
  {
    title: "Space Weather Centers of Excellence",
    author: "NASA",
    url: "https://science.nasa.gov/space-weather-centers-of-excellence/",
    type: "research",
    description: "NASA research group focusing on mitigation strategies for space weather impacts"
  },
  {
    title: "NASA Heliophysics Mission Fleet (2024)",
    author: "NASA Heliophysics",
    url: "https://science.nasa.gov/wp-content/uploads/2020/01/hpd-fleet-chart-jan-2024.jpg",
    type: "data",
    description: "Visual representation of the current NASA Heliophysics mission fleet"
  },
  {
    title: "Heliophysics Missions Animation",
    author: "NASA Scientific Visualization Studio",
    url: "https://svs.gsfc.nasa.gov/10809/",
    type: "data",
    description: "Interactive visualization of NASA's heliophysics missions"
  },
  {
    title: "NOAA Space Weather Prediction Center",
    author: "NOAA",
    url: "https://www.swpc.noaa.gov/",
    type: "data",
    description: "Real-time prediction and current space weather conditions"
  },
  {
    title: "INPE Space Weather Portal",
    author: "INPE Brazil",
    url: "https://www2.inpe.br/climaespacial/portal/pt/",
    type: "data",
    description: "Brazilian space weather monitoring and forecasting portal"
  },
  {
    title: "Understanding Space Weather",
    author: "NASA Scientific Visualization Studio",
    url: "https://svs.gsfc.nasa.gov/10959/",
    type: "article",
    description: "Easy-to-understand explanation of space weather phenomena"
  },
  {
    title: "Space Weather: Storms from the Sun",
    author: "NASA Scientific Visualization Studio",
    url: "https://svs.gsfc.nasa.gov/11179/",
    type: "article",
    description: "Visual guide to understanding solar storms and their effects"
  },
  {
    title: "GOES-R Space Weather Multimedia",
    author: "GOES-R Series",
    url: "https://www.goes-r.gov/multimedia/space-weather.html",
    type: "article",
    description: "Educational multimedia resources about space weather from GOES-R satellites"
  },
  {
    title: "Phaser Game Implementation",
    author: "Cosmotrixx Team",
    url: "https://github.com/cosmotrixx/phaser-by-example",
    type: "tool",
    description: "Interactive game implementation using Phaser framework - GitHub repository"
  },
  {
    title: "Next.js",
    author: "Vercel",
    url: "https://nextjs.org/",
    type: "tool",
    description: "React framework for building the web application with server-side rendering"
  },
  {
    title: "Blender",
    author: "Blender Foundation",
    url: "https://www.blender.org/",
    type: "tool",
    description: "Open-source 3D creation suite for modeling and animation"
  },
  {
    title: "Three.js",
    author: "Three.js Team",
    url: "https://threejs.org/",
    type: "tool",
    description: "JavaScript 3D library for creating and displaying animated 3D graphics in the browser"
  },
  {
    title: "Phaser",
    author: "Photon Storm",
    url: "https://phaser.io/",
    type: "tool",
    description: "HTML5 game framework used for building interactive experiences"
  },
  {
    title: "Figma",
    author: "Figma Inc.",
    url: "https://www.figma.com/",
    type: "tool",
    description: "Collaborative design tool for UI/UX design and prototyping"
  },
  {
    title: "Google Gemini",
    author: "Google",
    url: "https://gemini.google.com/",
    type: "tool",
    description: "AI model used for content generation and intelligent features"
  },
  {
    title: "LangChain",
    author: "LangChain",
    url: "https://www.langchain.com/",
    type: "tool",
    description: "Framework for developing applications powered by language models"
  },
  {
    title: "Procreate",
    author: "Savage Interactive",
    url: "https://procreate.com/",
    type: "tool",
    description: "Digital illustration app for creating artwork and visual designs"
  }
]

const typeColors = {
  data: "bg-green-500/10 text-green-500 border-green-500/20",
  research: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  article: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  tool: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  documentation: "bg-pink-500/10 text-pink-500 border-pink-500/20"
}

export default function AboutPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredReferences = selectedType
    ? references.filter(ref => ref.type === selectedType)
    : references

  const types = Array.from(new Set(references.map(ref => ref.type)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <Navigation />  

        {/* Team Section */}
        <section className="mb-20 py-20">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Team</h2>
            <p className="text-muted-foreground">
              Meet the people behind Cosmotrix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-6 pb-4">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-secondary/20 shadow-md">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-0 text-center">
                  <CardTitle className="mb-1 text-lg">{member.name}</CardTitle>
                  <CardDescription className="mb-3 font-medium text-primary">
                    {member.role}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                  
                  {/* Social Links */}
                  <div className="flex gap-2 justify-center">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-secondary transition-colors"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-secondary transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded-md hover:bg-secondary transition-colors"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* References Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">References & Resources</h2>
            <p className="text-muted-foreground mb-6">
              Data sources, tools, and research materials used in this project
            </p>

            {/* Filter badges */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedType === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedType(null)}
              >
                All ({references.length})
              </Badge>
              {types.map((type) => (
                <Badge
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => setSelectedType(type)}
                >
                  {type} ({references.filter(r => r.type === type).length})
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReferences.map((reference, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        {reference.title}
                        <a
                          href={reference.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </CardTitle>
                      {reference.author && (
                        <CardDescription className="mb-2">
                          by {reference.author}
                        </CardDescription>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={`capitalize shrink-0 ${typeColors[reference.type]}`}
                    >
                      {reference.type}
                    </Badge>
                  </div>
                </CardHeader>
                {reference.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {reference.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {filteredReferences.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No references found for this type.
            </div>
          )}
        </section>

        {/* Footer Note */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            This project is built for educational purposes as part of the NASA Space Apps Challenge.
          </p>
          <p className="mt-2">
            All NASA data is publicly available and used in accordance with NASA's data policy.
          </p>
        </div>
      </div>
    </div>
  )
}

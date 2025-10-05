"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import map from "./../public/images/map.png"
import map1 from "./../public/images/map/map1.jpg"
import map2 from "./../public/images/map/map2.jpg"
import map3 from "./../public/images/map/map3.jpg"

export function ScalabilitySection() {
  const schoolData = [
    { island: "Java", schools: 98363 },
    { island: "Sumatera", schools: 54712 },
    { island: "Sulawesi", schools: 23917 },
    { island: "Kalimantan", schools: 18185 },
    { island: "Bali-Nusa Tenggara", schools: 16202 },
    { island: "Maluku-Papua", schools: 10550 },
  ]

  const totalSchools = schoolData.reduce((sum, data) => sum + data.schools, 0)

  const features = [
    {
      title: "Illuminating Curiosity",
      description: "Cosmotrix transforms learning space weather into an immersive cosmic adventure. Students don't just read about solar flares. They see, hear, and interact with them. Space weather becomes relatable, and unforgettable."
    },
    {
      title: "Amplifying Cosmic Access",
      description: "Cosmotrix is omni-accessible. From rural schools to global exhibitions, anyone can scan, learn, and play about space weather with no barriers."
    },
    {
      title: "Revolutionizing How We Learn the Universe",
      description: "Cosmotrix combines Kid's Illustration, AI-driven Interaction and IoT usage to distill complex astrophysics into bite-sized, interactive experiences. Making advanced science as easy to grasp as playing a game."
    }
  ]

  return (
    <section className="relative min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Indonesia Map Section */}
        <div className="mb-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Number of Schools by Island Group in Indonesia (2022)
          </h2>
          <p className="text-base text-muted-foreground mb-8">
            Potential reach: <strong className="text-foreground">{totalSchools.toLocaleString()}</strong> schools across the archipelago
          </p>
          
          {/* Map Image */}
          <div className="relative w-full h-[400px] md:h-[500px]  rounded-lg overflow-hidden">
            <Image
              src={map}
              alt="Indonesia School Distribution Map"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>


        {/* Photo Gallery */}
        <div className="mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Photo 1 */}
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src={map1}
                alt="Student exploring Cosmotrix on tablet"
                fill
                className="object-cover"
              />
            </div>

            {/* Photo 2 */}
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src={map2}
                alt="Students watching Cosmotrix presentation"
                fill
                className="object-cover"
              />
            </div>

            {/* Photo 3 */}
            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src={map3}
                alt="Space weather monitoring satellite network"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

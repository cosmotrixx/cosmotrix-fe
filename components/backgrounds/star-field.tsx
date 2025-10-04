"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    particlesJS: any
  }
}

interface StarFieldProps {
  opacity?: number
  className?: string
  numParticles?: number
  // Particle appearance
  colors?: string[]
  shapes?: string[]
  particleSize?: number
  particleOpacity?: number
  // Movement
  speed?: number
  direction?: string
  // Connections
  enableConnections?: boolean
  connectionDistance?: number
  connectionOpacity?: number
  connectionWidth?: number
  // Interactivity
  enableHover?: boolean
  enableClick?: boolean
  hoverMode?: string
  clickMode?: string
  // Animation
  enableSizeAnimation?: boolean
  enableOpacityAnimation?: boolean
  animationSpeed?: number
}

let instanceCounter = 0

export function StarField({ 
  opacity = 1, 
  className = "", 
  numParticles = 100,
  // Particle appearance
  colors = ["#ffffff", "#e6f3ff", "#fff2cc", "#ffe6f2"],
  shapes = ["circle", "star"],
  particleSize = 2,
  particleOpacity = 0.5,
  // Movement
  speed = 0.2,
  direction = "none",
  // Connections
  enableConnections = true,
  connectionDistance = 120,
  connectionOpacity = 0.08,
  connectionWidth = 0.5,
  // Interactivity
  enableHover = true,
  enableClick = false,
  hoverMode = "bubble",
  clickMode = "push",
  // Animation
  enableSizeAnimation = true,
  enableOpacityAnimation = true,
  animationSpeed = 1
}: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerId, setContainerId] = useState<string>("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    instanceCounter++
    setContainerId(`star-field-${instanceCounter}`)
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !containerId) return

    const existingScript = document.querySelector('script[src*="particles.min.js"]')
    
    const initParticles = () => {
      if (window.particlesJS && containerRef.current) {
        window.particlesJS(containerId, {
          particles: {
            number: {
              value: numParticles,
              density: {
                enable: true,
                value_area: 1200
              }
            },
            color: {
              value: colors
            },
            shape: {
              type: shapes,
              star: {
                nb_sides: 5
              }
            },
            opacity: {
              value: particleOpacity,
              random: true,
              anim: {
                enable: enableOpacityAnimation,
                speed: animationSpeed * 0.5,
                opacity_min: 0.05,
                sync: false
              }
            },
            size: {
              value: particleSize,
              random: true,
              anim: {
                enable: enableSizeAnimation,
                speed: animationSpeed,
                size_min: 0.3,
                sync: false
              }
            },
            line_linked: {
              enable: enableConnections,
              distance: connectionDistance,
              color: "#ffffff",
              opacity: connectionOpacity,
              width: connectionWidth
            },
            move: {
              enable: true,
              speed: speed,
              direction: direction,
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: enableHover,
                mode: hoverMode
              },
              onclick: {
                enable: enableClick,
                mode: clickMode
              },
              resize: true
            },
            modes: {
              bubble: {
                distance: 80,
                size: particleSize * 1.5,
                duration: 1,
                opacity: 0.6,
                speed: 2
              },
              grab: {
                distance: connectionDistance + 50,
                line_linked: {
                  opacity: connectionOpacity * 5
                }
              },
              push: {
                particles_nb: 3
              },
              repulse: {
                distance: 100,
                duration: 0.4
              }
            }
          },
          retina_detect: true
        })
      }
    }

    if (existingScript) {
      initParticles()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
      script.onload = initParticles
      document.head.appendChild(script)
    }
  }, [containerId, isClient, numParticles, colors, shapes, particleSize, particleOpacity, speed, direction, enableConnections, connectionDistance, connectionOpacity, connectionWidth, enableHover, enableClick, hoverMode, clickMode, enableSizeAnimation, enableOpacityAnimation, animationSpeed])

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${className}`}
        style={{ opacity }}
      />
    )
  }

  return (
    <div
      ref={containerRef}
      id={containerId}
      className={`absolute inset-0 transition-opacity duration-300 ${className}`}
      style={{ opacity }}
    />
  )
}
"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    particlesJS: any
  }
}

interface StarFieldProps {
  opacity?: number
  className?: string
}

export function StarField({ opacity = 1, className = "" }: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load particles.js script
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js'
    script.onload = () => {
      if (window.particlesJS && containerRef.current) {
        window.particlesJS('star-field', {
          particles: {
            number: {
              value: 150,
              density: {
                enable: true,
                value_area: 1000
              }
            },
            color: {
              value: ["#ffffff", "#e6f3ff", "#fff2cc", "#ffe6f2"]
            },
            shape: {
              type: ["circle", "star"],
              star: {
                nb_sides: 5
              }
            },
            opacity: {
              value: 0.7,
              random: true,
              anim: {
                enable: true,
                speed: 0.8,
                opacity_min: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: true,
                speed: 1.5,
                size_min: 0.5,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 180,
              color: "#ffffff",
              opacity: 0.15,
              width: 1,
              shadow: {
                enable: true,
                color: "#ffffff",
                blur: 5
              }
            },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
              }
            }
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: ["grab", "bubble"]
              },
              onclick: {
                enable: true,
                mode: "push"
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 200,
                line_linked: {
                  opacity: 0.4,
                  color: "#ffffff"
                }
              },
              bubble: {
                distance: 120,
                size: 6,
                duration: 2,
                opacity: 1,
                speed: 3
              },
              push: {
                particles_nb: 3
              }
            }
          },
          retina_detect: true
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      id="star-field"
      className={`absolute inset-0 transition-opacity duration-300 ${className}`}
      style={{ opacity }}
    />
  )
}
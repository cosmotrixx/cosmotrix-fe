"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import Image from "next/image"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function ThreeDSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const frameRef = useRef<number>()
  const sectionRef = useRef<HTMLElement>(null);

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [isInteracting, setIsInteracting] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  const mouseRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const rotationRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(5)

  // Check WebGL support
  useEffect(() => {
    if (typeof window === "undefined") return
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl) {
      setWebglSupported(false)
      setIsLoading(false)
      setError("WebGL is not supported in your browser")
    }
  }, [])

  // Track visibility for lazy init
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Camera setup
  const setupCamera = (model: THREE.Object3D, camera: THREE.PerspectiveCamera) => {
    const box = new THREE.Box3().setFromObject(model)
    const boxSize = box.getSize(new THREE.Vector3()).length()
    const boxCenter = box.getCenter(new THREE.Vector3())
    
    model.position.set(0, 0, 0)
    
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.position.sub(boxCenter)
      }
    })
    
    zoomRef.current = Math.min(boxSize * 2, 10)
    camera.position.set(0, 0, zoomRef.current)
    camera.lookAt(new THREE.Vector3(0, 0, 0))
    camera.near = boxSize / 100
    camera.far = boxSize * 100
    camera.updateProjectionMatrix()
  }

  // Initialize 3D (keeping the existing implementation)
  useEffect(() => {
    if (!canvasContainerRef.current || !isVisible || !webglSupported) return

    let cleanupFunction: (() => void) | null = null

    const initScene = async () => {
      try {
        const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js")
        const { MTLLoader } = await import("three/addons/loaders/MTLLoader.js")

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x000000)
        sceneRef.current = scene

        const camera = new THREE.PerspectiveCamera(
          75,
          canvasContainerRef.current!.clientWidth / canvasContainerRef.current!.clientHeight,
          0.1,
          1000
        )
        camera.position.set(0, 0, 5)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(canvasContainerRef.current!.clientWidth, canvasContainerRef.current!.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        rendererRef.current = renderer

        canvasContainerRef.current!.appendChild(renderer.domElement)

        // Lights
        scene.add(new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.25))
        const dirLight = new THREE.DirectionalLight(0xffffff, 1)
        dirLight.position.set(10, 10, 5)
        dirLight.castShadow = true
        scene.add(dirLight)

        // Load model
        const mtlLoader = new MTLLoader()
        mtlLoader.load(
          "./3d/iot.mtl",
          (mtl) => {
            mtl.preload()
            for (const material of Object.values(mtl.materials)) {
              material.side = THREE.DoubleSide
              if (material instanceof THREE.MeshPhongMaterial || material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshBasicMaterial) {
                if (material.color && material.color.r === 0 && material.color.g === 0 && material.color.b === 0) {
                  material.color.setRGB(1, 1, 1)
                }
              }
            }

            const objLoader = new OBJLoader()
            objLoader.setMaterials(mtl)
            objLoader.load(
              "./3d/iot.obj",
              (root) => {
                root.traverse((child) => {
                  if (child instanceof THREE.Mesh) {
                    child.castShadow = true
                    child.receiveShadow = true
                  }
                })
                scene.add(root)
                modelRef.current = root
                setupCamera(root, camera)
                setIsLoading(false)
                setModelLoaded(true)
              },
              undefined,
              (err) => {
                console.error("Error loading OBJ:", err)
                setError("Failed to load 3D model")
                setIsLoading(false)
              }
            )
          },
          undefined,
          () => {
            const objLoader = new OBJLoader()
            objLoader.load(
              "./3d/iot.obj",
              (root) => {
                root.traverse((child) => {
                  if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({
                      color: 0x0000ff,
                      side: THREE.DoubleSide,
                    })
                  }
                })
                scene.add(root)
                modelRef.current = root
                setupCamera(root, camera)
                setIsLoading(false)
                setModelLoaded(true)
              },
              undefined,
              (err) => {
                console.error("Error loading OBJ:", err)
                setError("Failed to load 3D model")
                setIsLoading(false)
              }
            )
          }
        )

        const canvas = renderer.domElement

        // Event handlers (keeping existing implementation)
        const handleMouseDown = (e: MouseEvent) => {
          e.preventDefault()
          isDraggingRef.current = true
          setIsInteracting(true)
          mouseRef.current.x = e.clientX
          mouseRef.current.y = e.clientY
          canvas.style.cursor = "grabbing"
        }

        const handleMouseMove = (e: MouseEvent) => {
          if (!isDraggingRef.current || !modelRef.current) return
          e.preventDefault()
          
          const dx = e.clientX - mouseRef.current.x
          const dy = e.clientY - mouseRef.current.y
          
          rotationRef.current.y += dx * 0.005
          rotationRef.current.x += dy * 0.005
          rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x))
          
          modelRef.current.rotation.x = rotationRef.current.x
          modelRef.current.rotation.y = rotationRef.current.y
          modelRef.current.rotation.z = 0
          
          mouseRef.current.x = e.clientX
          mouseRef.current.y = e.clientY
        }

        const handleMouseUp = () => {
          isDraggingRef.current = false
          setIsInteracting(false)
          canvas.style.cursor = "grab"
        }

        const handleWheel = (e: WheelEvent) => {
          e.preventDefault()
          if (!cameraRef.current) return
          
          const zoomSpeed = 0.1
          const minZoom = 2
          const maxZoom = 20
          
          zoomRef.current += e.deltaY * zoomSpeed * 0.01
          zoomRef.current = Math.max(minZoom, Math.min(maxZoom, zoomRef.current))
          
          cameraRef.current.position.z = zoomRef.current
        }

        const handleMouseEnter = () => {
          if (!isDraggingRef.current) {
            setIsInteracting(true)
          }
        }

        const handleMouseLeave = () => {
          isDraggingRef.current = false
          setIsInteracting(false)
        }

        const handleDoubleClick = () => {
          if (!modelRef.current || !cameraRef.current) return
          
          const targetRotation = { x: 0, y: 0 }
          const targetZoom = Math.min(10, zoomRef.current)
          
          const animate = () => {
            if (!modelRef.current || !cameraRef.current) return
            
            rotationRef.current.x += (targetRotation.x - rotationRef.current.x) * 0.1
            rotationRef.current.y += (targetRotation.y - rotationRef.current.y) * 0.1
            modelRef.current.rotation.x = rotationRef.current.x
            modelRef.current.rotation.y = rotationRef.current.y
            
            zoomRef.current += (targetZoom - zoomRef.current) * 0.1
            cameraRef.current.position.z = zoomRef.current
            
            if (
              Math.abs(rotationRef.current.x - targetRotation.x) > 0.001 ||
              Math.abs(rotationRef.current.y - targetRotation.y) > 0.001 ||
              Math.abs(zoomRef.current - targetZoom) > 0.001
            ) {
              requestAnimationFrame(animate)
            }
          }
          animate()
        }

        const handleResize = () => {
          if (!canvasContainerRef.current || !cameraRef.current || !rendererRef.current) return
          const w = canvasContainerRef.current.clientWidth
          const h = canvasContainerRef.current.clientHeight
          cameraRef.current.aspect = w / h
          cameraRef.current.updateProjectionMatrix()
          rendererRef.current.setSize(w, h)
        }

        canvas.style.cursor = "grab"
        canvas.style.touchAction = "none"
        
        canvas.addEventListener("mousedown", handleMouseDown, { passive: false })
        canvas.addEventListener("mouseenter", handleMouseEnter)
        canvas.addEventListener("mouseleave", handleMouseLeave)
        canvas.addEventListener("dblclick", handleDoubleClick)
        canvas.addEventListener("wheel", handleWheel, { passive: false })
        document.addEventListener("mousemove", handleMouseMove, { passive: false })
        document.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("resize", handleResize)

        const animate = () => {
          frameRef.current = requestAnimationFrame(animate)
          
          if (!isDraggingRef.current && modelRef.current) {
            modelRef.current.rotation.x = 0
            modelRef.current.rotation.y += 0.01
            modelRef.current.rotation.z = 0
          }
          
          renderer.render(scene, camera)
        }
        animate()

        cleanupFunction = () => {
          if (frameRef.current) cancelAnimationFrame(frameRef.current)
          window.removeEventListener("resize", handleResize)
          document.removeEventListener("mousemove", handleMouseMove)
          document.removeEventListener("mouseup", handleMouseUp)
          canvas.removeEventListener("mousedown", handleMouseDown)
          canvas.removeEventListener("mouseenter", handleMouseEnter)
          canvas.removeEventListener("mouseleave", handleMouseLeave)
          canvas.removeEventListener("dblclick", handleDoubleClick)
          canvas.removeEventListener("wheel", handleWheel)
          if (canvasContainerRef.current && canvas.parentNode === canvasContainerRef.current) {
            canvasContainerRef.current.removeChild(canvas)
          }
          renderer.dispose()
        }
      } catch (err) {
        console.error("Error initializing 3D scene:", err)
        setError(`Failed to initialize 3D scene: ${(err as Error).message}`)
        setIsLoading(false)
      }
    }

    initScene()

    return () => {
      if (cleanupFunction) {
        cleanupFunction()
      }
    }
  }, [isVisible, webglSupported])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-b from-[#1a0b2e] to-black"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      
      {/* Main Content Container */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - 3D Model */}
          <div className="order-2 lg:order-1">
            <div 
              ref={canvasContainerRef}
              className={cn(
                "transition-all duration-1000 w-full h-[500px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/20 backdrop-blur-sm",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
            >
              {/* Loading state */}
              {isLoading && webglSupported && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-zinc-400">Loading IoT Projector Watch...</p>
                  </div>
                </div>
              )}

              {/* WebGL not supported */}
              {!webglSupported && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
                  <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-5xl mb-4">🖥️</div>
                    <p className="text-red-400 mb-2 font-semibold">WebGL Not Supported</p>
                    <p className="text-sm text-zinc-400 mb-4">
                      Your browser doesn't support WebGL, which is required for 3D graphics.
                    </p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && webglSupported && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-50">
                  <div className="text-center">
                    <p className="text-red-400 mb-2">⚠️ {error}</p>
                    <p className="text-sm text-zinc-400">Check the browser console for more details</p>
                  </div>
                </div>
              )}
            </div>

            {/* Interactive instructions */}
            <div className="text-center mt-6">
              <p className="text-sm text-zinc-400 mb-2">
                {isInteracting ? "Drag to rotate • Scroll to zoom • Double-click to reset" : "Click and drag to explore the 3D model"}
              </p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="order-1 lg:order-2">
            {/* Title and description */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                <span className="bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">IoT Projector Watch</span>
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                Experience our innovative <span className="bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent text-medium">ESP32-powered wearable device</span> designed to make learning more accessible through immersive projection technology.
              </p>

              {/* User Experience Image */}
              <div className="relative mb-8 rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/sections/user.png"
                  alt="Students using IoT projector watches for interactive learning"
                  width={600}
                  height={350}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                    Interactive classroom learning with holographic projections
                  </p>
                </div>
              </div>

                            {/* Feature Grid */}

              <div className="grid md:grid-cols-3 gap-4 mt-8">

                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-700">

                  <div className="text-2xl mb-2">⌚</div>

                  <h3 className="text-base font-semibold text-white mb-1">Wearable Design</h3>

                  <p className="text-xs text-zinc-400">Comfortable smartwatch form factor with integrated projection</p>

                </div>

                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-700">

                  <div className="text-2xl mb-2">📡</div>

                  <h3 className="text-base font-semibold text-white mb-1">ESP32 Powered</h3>

                  <p className="text-xs text-zinc-400">Advanced microcontroller enabling IoT connectivity</p>

                </div>

                <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 border border-zinc-700">

                  <div className="text-2xl mb-2">🎓</div>

                  <h3 className="text-base font-semibold text-white mb-1">Learning Accessibility</h3>

                  <p className="text-xs text-zinc-400">Making education inclusive through projection technology</p>

                </div>

              </div>

            </div>



            <div className="text-center lg:text-left">

              <p className="text-sm text-zinc-500">

                Discover how technology meets accessibility in wearable IoT innovation

              </p>
              
            </div>
          </div>
        </div>

        {/* CTA Section - Fixed placement at bottom */}
        <div className="flex justify-center mt-16">
          <a 
            href="/story"
            className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transform"
          >
            <span className="relative z-10 flex items-center">
              <span className="mr-4 text-2xl">📖</span>
              Start Luna's Journey!
              <span className="ml-4 text-xl group-hover:translate-x-1 transition-transform">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </a>
        </div>
      </div>
    </section>
  )
}
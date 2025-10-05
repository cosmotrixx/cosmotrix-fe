"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

export default function ThreeDSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Object3D | null>(null)
  const frameRef = useRef<number>()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [isInteracting, setIsInteracting] = useState(false)

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
    
    // Center the model at origin by adjusting its position
    model.position.set(0, 0, 0)
    
    // Offset all children instead to center the visual geometry
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

  // Initialize 3D
  useEffect(() => {
    if (!containerRef.current || !isVisible || !webglSupported) return

    let cleanupFunction: (() => void) | null = null

    const initScene = async () => {
      try {
        const { OBJLoader } = await import("three/addons/loaders/OBJLoader.js")
        const { MTLLoader } = await import("three/addons/loaders/MTLLoader.js")

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0a0a0a)
        sceneRef.current = scene

        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current!.clientWidth / containerRef.current!.clientHeight,
          0.1,
          1000
        )
        camera.position.set(0, 0, 5)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        rendererRef.current = renderer

        containerRef.current!.appendChild(renderer.domElement)

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
              // Type-cast to MeshPhongMaterial to access color property
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
            // fallback if no MTL
            const objLoader = new OBJLoader()
            objLoader.load(
              "./3d/iot.obj",
              (root) => {
                root.traverse((child) => {
                  if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshPhongMaterial({
                      color: 0x888888,
                      side: THREE.DoubleSide,
                    })
                  }
                })
                scene.add(root)
                modelRef.current = root
                setupCamera(root, camera)
                setIsLoading(false)
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

        // Enhanced Interaction
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

        // Add mouse wheel zoom
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

        // Add mouse enter/leave effects
        const handleMouseEnter = () => {
          if (!isDraggingRef.current) {
            setIsInteracting(true)
          }
        }

        const handleMouseLeave = () => {
          isDraggingRef.current = false
          setIsInteracting(false)
        }

        // Add double-click to reset
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
          if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
          const w = containerRef.current.clientWidth
          const h = containerRef.current.clientHeight
          cameraRef.current.aspect = w / h
          cameraRef.current.updateProjectionMatrix()
          rendererRef.current.setSize(w, h)
        }

        canvas.style.cursor = "grab"
        canvas.style.touchAction = "none"
        
        // Add all event listeners
        canvas.addEventListener("mousedown", handleMouseDown, { passive: false })
        canvas.addEventListener("mouseenter", handleMouseEnter)
        canvas.addEventListener("mouseleave", handleMouseLeave)
        canvas.addEventListener("dblclick", handleDoubleClick)
        canvas.addEventListener("wheel", handleWheel, { passive: false })
        document.addEventListener("mousemove", handleMouseMove, { passive: false })
        document.addEventListener("mouseup", handleMouseUp)
        window.addEventListener("resize", handleResize)

        // Animation with auto-rotation
        const animate = () => {
          frameRef.current = requestAnimationFrame(animate)
          
          // Auto-rotate on Y-axis (clockwise from top view) when not interacting
          if (!isDraggingRef.current && modelRef.current) {
            modelRef.current.rotation.x = 0
            modelRef.current.rotation.y += 0.003
            modelRef.current.rotation.z = 0
          }
          
          renderer.render(scene, camera)
        }
        animate()

        // Store cleanup function
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
          if (containerRef.current && canvas.parentNode === containerRef.current) {
            containerRef.current.removeChild(canvas)
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
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center py-24 px-6 bg-gradient-to-b from-zinc-950 to-zinc-900"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div
        className={cn(
          "transition-all duration-1000 w-full max-w-6xl mx-auto",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Explore in <span className="text-blue-500">3D</span>
          </h2>
          <p className="text-lg text-zinc-400">
            {isInteracting ? "Drag to rotate • Scroll to zoom • Double-click to reset" : "Click and drag to interact"}
          </p>
        </div>

        <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/20 backdrop-blur-sm">
          {isLoading && webglSupported && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading 3D model...</p>
              </div>
            </div>
          )}

          {!webglSupported && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
              <div className="text-center max-w-md mx-auto p-6">
                <div className="text-5xl mb-4">🖥️</div>
                <p className="text-red-400 mb-2 font-semibold">WebGL Not Supported</p>
                <p className="text-sm text-zinc-400 mb-4">
                  Your browser doesn't support WebGL, which is required for 3D graphics.
                </p>
              </div>
            </div>
          )}

          {error && webglSupported && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm z-10">
              <div className="text-center">
                <p className="text-red-400 mb-2">⚠️ {error}</p>
                <p className="text-sm text-zinc-400">Check the browser console for more details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
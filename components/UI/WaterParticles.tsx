import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Particle {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
    xDrift: number[]
    xDriftWithReset: number[] // Pre-calculated array with reset
    endY: number // Pre-calculated end position
    initialY: number // Pre-calculated initial position
    style: React.CSSProperties // Pre-calculated style object
    transition: any // Pre-calculated transition object
}

interface WaterParticlesProps {
    particleCount?: number
    className?: string
}

function WaterParticles({ 
    particleCount = 30,
    className = '' 
}: WaterParticlesProps) {
    const [viewportHeight, setViewportHeight] = useState(1000)

    // Throttle resize using requestAnimationFrame for better performance
    const handleResize = useCallback(() => {
        requestAnimationFrame(() => {
            setViewportHeight(window.innerHeight)
        })
    }, [])

    useEffect(() => {
        // Set initial height
        setViewportHeight(window.innerHeight)
        
        // Use passive listener for better scroll performance
        window.addEventListener('resize', handleResize, { passive: true })
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize])

    // Generate particles with random properties
    // Distribute delays evenly across the max duration to ensure continuous flow
    const maxDuration = 8
    const spawnOffset = 40 // Distance below viewport to spawn particles
    
    // Pre-calculate common values
    const endY = useMemo(() => -viewportHeight - 200, [viewportHeight])
    const bubbleSpawnOffset = spawnOffset + 50

    const particles = useMemo<Particle[]>(() => {
        return Array.from({ length: particleCount }, (_, i) => {
            const baseDelay = (i / particleCount) * maxDuration
            const size = 3 + Math.random() * 5
            const x = Math.random() * 100
            const duration = 8 + Math.random() * 12
            const delay = baseDelay % maxDuration
            const xDrift = [
                0,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 60,
            ]
            const xDriftWithReset = [...xDrift, 0]
            
            // Pre-calculate style object to avoid recreation on every render
            const boxShadowSize = size * 3
            const boxShadowSize2 = size * 1.5
            
            return {
                id: i,
                x,
                y: 0,
                size,
                duration,
                delay,
                xDrift,
                xDriftWithReset,
                endY,
                initialY: spawnOffset,
                style: {
                    left: `${x}%`,
                    bottom: 0,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: `radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(173,216,230,0.4) 50%, rgba(135,206,250,0.2) 100%)`,
                    boxShadow: `0 0 ${boxShadowSize}px rgba(173,216,230,0.5), 0 0 ${boxShadowSize2}px rgba(255,255,255,0.3)`,
                },
                transition: {
                    duration,
                    delay,
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    ease: "linear",
                },
            }
        })
    }, [particleCount, endY])

    // Generate larger bubbles (fewer, more prominent)
    const bubbleCount = Math.floor(particleCount / 4)
    const bubbles = useMemo<Particle[]>(() => {
        return Array.from({ length: bubbleCount }, (_, i) => {
            const baseDelay = (i / bubbleCount) * 30
            const size = 10 + Math.random() * 15
            const x = Math.random() * 100
            const duration = 15 + Math.random() * 15
            const delay = baseDelay % 30
            const xDrift = [
                0,
                (Math.random() - 0.5) * 30,
                (Math.random() - 0.5) * 50,
            ]
            const xDriftWithReset = [...xDrift, 0]
            
            // Pre-calculate style object
            const boxShadowSize = size * 1.5
            const boxShadowSize2 = size
            const boxShadowSize3 = size / 2
            
            return {
                id: i + particleCount,
                x,
                y: 0,
                size,
                duration,
                delay,
                xDrift,
                xDriftWithReset,
                endY,
                initialY: bubbleSpawnOffset,
                style: {
                    left: `${x}%`,
                    bottom: 0,
                    width: `${size}px`,
                    height: `${size}px`,
                    background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5) 0%, rgba(173,216,230,0.3) 40%, rgba(135,206,250,0.15) 100%)`,
                    border: `1px solid rgba(255,255,255,0.3)`,
                    boxShadow: `0 0 ${boxShadowSize}px rgba(173,216,230,0.4), 0 0 ${boxShadowSize2}px rgba(255,255,255,0.2), inset 0 0 ${boxShadowSize3}px rgba(255,255,255,0.15)`,
                },
                transition: {
                    duration,
                    delay,
                    repeat: Infinity,
                    repeatType: "loop" as const,
                    ease: "linear",
                },
            }
        })
    }, [particleCount, bubbleCount, endY, bubbleSpawnOffset])

    return (
        <div className={`absolute inset-0 pointer-events-none z-0 ${className}`}>
            {/* Small water particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={particle.style}
                    initial={{ 
                        y: particle.initialY,
                        opacity: 0,
                        scale: 0.8,
                        x: 0,
                    }}
                    animate={{
                        y: particle.endY,
                        opacity: [0, 0.9, 0.9, 0, 0],
                        scale: [0.8, 1, 1, 1.3, 0.8],
                        x: particle.xDriftWithReset,
                    }}
                    transition={particle.transition}
                />
            ))}

            {/* Larger bubbles */}
            {bubbles.map((bubble) => (
                <motion.div
                    key={bubble.id}
                    className="absolute rounded-full"
                    style={bubble.style}
                    initial={{ 
                        y: bubble.initialY,
                        opacity: 0,
                        scale: 0.5,
                        x: 0,
                    }}
                    animate={{
                        y: bubble.endY,
                        opacity: [0, 0.7, 0.7, 0, 0],
                        scale: [0.5, 1, 1.1, 1.4, 0.5],
                        x: bubble.xDriftWithReset,
                    }}
                    transition={bubble.transition}
                />
            ))}

            {/* Subtle light rays/ripples effect */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse at 50% 100%, rgba(135,206,250,0.05) 0%, transparent 70%)`,
                }}
                animate={{
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    )
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(WaterParticles)


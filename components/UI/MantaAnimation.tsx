import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

type Manta = {
  id: number
  size: number
  startX: string
  startY: string
  opacity: number
  duration: number
  delay: number
  xPath: number[]
  yPath: number[]
  rotatePath: number[]
  scalePath: number[]
}

const MANTA_IMAGE = '/imgs/MantaSDR3_bianco.png'
const ROMA_TRE_LOGO = '/imgs/RomaTre_marchio_bianco.png'

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function createPath(points: number, range: number) {
  return Array.from({ length: points }, () => randomBetween(-range, range))
}

export default function MantaAnimation() {
  const mantas = useMemo<Manta[]>(() => {
    const mantaCount = 5

    return Array.from({ length: mantaCount }, (_, index) => {
      const size = randomBetween(60, 160)
      const duration = randomBetween(18, 36)
      const delay = randomBetween(0, 8)

      const xPath = createPath(7, 200)
      const yPath = createPath(7, 140)

      xPath.push(xPath[0])
      yPath.push(yPath[0])

      const rotatePath = [
        randomBetween(-12, 12),
        randomBetween(-18, 18),
        randomBetween(-10, 10),
        randomBetween(-16, 16),
        randomBetween(-8, 8),
        randomBetween(-14, 14),
        randomBetween(-12, 12),
      ]

      rotatePath.push(rotatePath[0])

      const scalePath = [
        1,
        randomBetween(0.94, 1.06),
        randomBetween(0.96, 1.08),
        randomBetween(0.94, 1.04),
        randomBetween(0.97, 1.07),
        1,
      ]

      scalePath.push(scalePath[0])

      return {
        id: index,
        size,
        startX: `${randomBetween(5, 95)}%`,
        startY: `${randomBetween(8, 85)}%`,
        opacity: randomBetween(0.25, 0.65),
        duration,
        delay,
        xPath,
        yPath,
        rotatePath,
        scalePath,
      }
    })
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {mantas.map((manta) => (
        <motion.div
          key={manta.id}
          className="absolute"
          style={{
            width: `${manta.size}px`,
            height: `${manta.size}px`,
            left: manta.startX,
            top: manta.startY,
            marginLeft: `-${manta.size / 2}px`,
            marginTop: `-${manta.size / 2}px`,
            opacity: manta.opacity,
          }}
          animate={{
            x: manta.xPath,
            y: manta.yPath,
            rotate: manta.rotatePath,
            scale: manta.scalePath,
          }}
          transition={{
            duration: manta.duration,
            delay: manta.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              filter:
                'drop-shadow(0 0 20px rgba(255, 255, 255, 0.35)) brightness(1.25)',
              transformOrigin: 'center 60%',
            }}
            animate={{
              scale: [1, 1.025, 0.99, 1.015, 1],
            }}
            transition={{
              duration: randomBetween(2.2, 4.2),
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          >
            <motion.img
              src={MANTA_IMAGE}
              alt="Manta Ray"
              className="h-full w-full object-contain"
              style={{
                transformOrigin: 'center 60%',
              }}
              animate={{
                skewY: [0, -2.5, 2, -1.5, 1.5, 0],
                scaleY: [1, 1.04, 0.985, 1.025, 0.995, 1],
              }}
              transition={{
                duration: randomBetween(1.8, 3.4),
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        className="absolute"
        style={{
          bottom: '40px',
          right: '40px',
          width: '200px',
          height: 'auto',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.7, 0.9, 0.7],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={ROMA_TRE_LOGO}
          alt="Roma Tre"
          className="h-auto w-full object-contain opacity-80"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
          }}
        />
      </motion.div>
    </div>
  )
}
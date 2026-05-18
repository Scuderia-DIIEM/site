import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

type Manta = {
  id: number
  sizeClass: string
  left: string
  top: string
  opacity: number
  duration: number
  delay: number
  xPath: number[]
  yPath: number[]
  rotatePath: number[]
}

const MANTA_IMAGE = '/imgs/MantaSDR3_bianco.png'
const ROMA_TRE_LOGO = '/imgs/RomaTre_marchio_bianco.png'

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export default function MantaAnimation() {
  const mantas = useMemo<Manta[]>(() => {
    const mantaCount = 5

    return Array.from({ length: mantaCount }, (_, index) => {
      const isLeftSide = index % 2 === 0

      /**
       * IMPORTANTISSIMO:
       * evitiamo la fascia centrale della hero, dove stanno titolo e pulsanti.
       * Le mante partono prevalentemente dai lati.
       */
      const left = isLeftSide
        ? `${randomBetween(-5, 22)}%`
        : `${randomBetween(78, 105)}%`

      const top = randomFrom([
        `${randomBetween(8, 28)}%`,
        `${randomBetween(68, 88)}%`,
      ])

      const xDirection = isLeftSide ? 1 : -1

      return {
        id: index,

        /**
         * Mobile: 70-110px circa
         * Tablet: 110-170px circa
         * Desktop: 150-240px circa
         */
        sizeClass: randomFrom([
          'w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] lg:w-[70px] lg:h-[70px]',
          'w-[65px] h-[65px] sm:w-[65px] sm:h-[65px] lg:w-[80px] lg:h-[80px]',
          'w-[80px] h-[80px] sm:w-[70px] sm:h-[70px] lg:w-[100px] lg:h-[100px]',
        ]),

        left,
        top,
        opacity: randomBetween(0.2, 0.4),
        duration: randomBetween(22, 42),
        delay: randomBetween(0, 4),

        /**
         * Movimento laterale:
         * non attraversa violentemente il centro.
         */
        xPath: [
          0,
          xDirection * randomBetween(30, 80),
          xDirection * randomBetween(10, 55),
          xDirection * randomBetween(40, 95),
          0,
        ],

        yPath: [
          0,
          randomBetween(-35, 35),
          randomBetween(-55, 55),
          randomBetween(-30, 45),
          0,
        ],

        rotatePath: [
          randomBetween(-10, 10),
          randomBetween(-18, 18),
          randomBetween(-8, 8),
          randomBetween(-15, 15),
          randomBetween(-10, 10),
        ],
      }
    })
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {mantas.map((manta) => (
        <motion.div
          key={manta.id}
          className={`absolute ${manta.sizeClass}`}
          style={{
            left: manta.left,
            top: manta.top,
            opacity: manta.opacity,
          }}
          animate={{
            x: manta.xPath,
            y: manta.yPath,
            rotate: manta.rotatePath,
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
            className="h-full w-full"
            style={{
              filter:
                'drop-shadow(0 0 18px rgba(255,255,255,0.3)) brightness(1.2)',
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
        className="absolute bottom-6 right-6 hidden h-auto w-[120px] opacity-70 sm:block lg:w-[200px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.45, 0.7, 0.45],
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
          className="h-auto w-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.25))',
          }}
        />
      </motion.div>
    </div>
  )
}
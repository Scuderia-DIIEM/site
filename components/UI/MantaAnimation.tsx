import React from 'react'
import { motion } from 'framer-motion'

export default function MantaAnimation() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Manta Ray - Using real MantaSDR3 SVG, fluid floating with wing flapping */}
            <motion.div
                className="absolute"
                style={{
                    width: '800px',
                    height: '800px',
                    left: '50%',
                    top: '50%',
                    marginLeft: '-400px',
                    marginTop: '-400px',
                }}
                animate={{
                    x: [0, 120, -100, 80, -60, 40, -30, 0],
                    y: [0, -80, 60, -40, 50, -30, 40, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1],
                }}
            >
                {/* Main body with wing flapping animation */}
                <motion.div
                    animate={{
                        scale: [1, 1.02, 1],
                        rotate: [0, 1, -1, 0.5, -0.5, 0],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        width: '100%',
                        height: '100%',
                        filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.4)) brightness(1.3)',
                        opacity: 0.8,
                        transformOrigin: 'center 60%',
                    }}
                >
                    {/* Wing flapping effect using skew */}
                    <motion.img
                        src="/imgs/MantaSDR3_bianco.png"
                        alt="Manta Ray"
                        className="w-full h-full object-contain"
                        style={{
                            transformOrigin: 'center 60%',
                        }}
                        animate={{
                            skewY: [0, -3, 3, -2, 2, 0],
                            scaleY: [1, 1.05, 0.98, 1.03, 0.99, 1],
                        }}
                        transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>
            </motion.div>

            {/* Roma Tre Logo */}
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
                    ease: "easeInOut",
                }}
            >
                <img
                    src="/imgs/RomaTre_marchio_bianco.png"
                    alt="Roma Tre"
                    className="w-full h-auto object-contain opacity-80"
                    style={{
                        filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
                    }}
                />
            </motion.div>
        </div>
    )
}

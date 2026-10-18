import React from 'react'
import { motion } from 'framer-motion'
import Button from '../UI/Button'
import ScrollIndicator from '../UI/ScrollIndicator'
import { useLanguage } from '@/lib/language'

export default function Hero() {
    const { t } = useLanguage()
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#061b20]">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/imgs/home-ocean-depth.svg')" }}
                />
                <video
                    aria-hidden="true"
                    className="absolute inset-0 z-10 h-full w-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster="/imgs/home-ocean-depth.svg"
                    preload="auto"
                >
                    <source src="/videohome.mp4" type="video/mp4" />
                    <source src="/videohome.webm" type="video/webm" />
                </video>
                <div aria-hidden="true" className="absolute inset-0 z-20 bg-gradient-to-b from-[#01253a]/10 via-[#031f35]/30 to-[#04182c]/55 dark:from-[#001323]/35 dark:via-[#001323]/55 dark:to-[#000b18]/75 transition-colors duration-700" />
            </div>

            {/* Content */}
            <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white dark:text-white mb-6 font-display drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Scuderia DIIEM
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl lg:text-3xl text-white dark:text-white mb-8 max-w-3xl mx-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        {t('Innovazione ingegneristica | Ricerca e sviluppo')}
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <Button href="#products" variant="primary">
                            {t('Scopri il Nostro Progetto')}
                        </Button>
                        <Button href="#contact" variant="secondary" className='btn-dark-outline'>
                            {t('Diventa Sponsor')}
                        </Button>
                    </motion.div>

                    <ScrollIndicator delay={0.8} />
                </motion.div>
            </div>

            <a
                href="https://uniroma3.it"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Università degli Studi Roma Tre"
                className="absolute bottom-6 right-6 z-30 opacity-95 transition-opacity hover:opacity-100 sm:bottom-8 sm:right-8"
            >
                <img
                    src="/imgs/RomaTre_marchio_bianco.png"
                    alt="Università degli Studi Roma Tre"
                    className="h-auto w-28 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:w-36"
                />
            </a>
        </section>
    )
}

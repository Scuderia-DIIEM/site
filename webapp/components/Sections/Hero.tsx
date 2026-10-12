import React from 'react'
import { motion } from 'framer-motion'
import Button from '../UI/Button'
import ScrollIndicator from '../UI/ScrollIndicator'
import WaterParticles from '../UI/WaterParticles'
import MantaAnimation from '../UI/MantaAnimation'
import { useLanguage } from '@/lib/language'

export default function Hero() {
    const { t } = useLanguage()
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#061b20]">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center transition-[filter] duration-700 dark:brightness-[.62] dark:saturate-[.82]"
                    style={{ backgroundImage: "url('/imgs/home-ocean-depth.svg')" }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#01253a]/10 via-[#031f35]/30 to-[#04182c]/55 dark:from-[#001323]/35 dark:via-[#001323]/55 dark:to-[#000b18]/75 transition-colors duration-700" />
                {/* Water particle effects */}
                <WaterParticles particleCount={50} />
                <MantaAnimation />
                <motion.div
                    className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-display"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Scuderia DIIEM
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-8 max-w-3xl mx-auto"
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
        </section>
    )
}

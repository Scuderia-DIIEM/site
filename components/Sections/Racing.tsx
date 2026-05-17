import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AddToCalendarButton from '../UI/AddToCalendarButton'

export default function Racing() {
  const upcomingRace = {
    date: '2026-06-25',
    name: 'MATE ROV Competition',
    location: 'Memorial University Newfoundland, Canada',
    dateRange: '25-27 Giugno 2026'
  }


  return (
    <section id="racing" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-display">
            Gare e Competizioni
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La nostra prima competizione internazionale ci aspetta in Canada
          </p>
        </motion.div>

        {/* Upcoming Race Card */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="relative bg-gradient-to-br from-primary via-primary-variant to-deep-space rounded-2xl overflow-hidden shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                backgroundSize: '200% 200%',
              }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
              {/* Left side - Race Info */}
              <div className="flex flex-col justify-center text-white z-10">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-block bg-accent/90 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                    Prossima Competizione
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                    {upcomingRace.name}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <div>
                        <div className="text-lg font-semibold">{upcomingRace.dateRange}</div>
                        <div className="text-gray-300 text-sm">2026</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <div className="text-lg font-semibold">{upcomingRace.location}</div>
                        <div className="text-gray-300 text-sm">Newfoundland, Canada</div>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="text-gray-200 text-sm leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    La nostra prima competizione internazionale rappresenta un traguardo importante
                    nel nostro percorso di crescita e innovazione tecnologica.
                  </motion.div>
                </motion.div>
              </div>

              {/* Right side - Map */}
              <motion.div
                className="relative h-64 lg:h-full min-h-[300px] rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src="/imgs/Newfoundland-locator-Labrador-Canada.webp"
                  alt="Newfoundland, Canada Location Map"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Pulsing location marker */}
                <motion.a
                  href="https://www.google.com/maps/place/Memorial+University+of+Newfoundland/@47.5716578,-52.7358801,15.66z/data=!4m6!3m5!1s0x4b0ca38ed8abfb89:0x6b5a08da64519740!8m2!3d47.5741117!4d-52.7352094!16zL20vMDIyanI1?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-[44.5%] left-[91.5%] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  whileHover={{
                    scale: 1.3,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{
                    scale: 0.9,
                    transition: { duration: 0.1 },
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg" />
                </motion.a>
              </motion.div>
            </div>

            {/* Shine effect on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        </motion.div>
        {/* Empty state message */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-500 italic">
            Questa sarà la nostra prima competizione ufficiale. Seguici per aggiornamenti sul nostro percorso!
          </p>
        </motion.div>
      </div>
    </section>
  )
}


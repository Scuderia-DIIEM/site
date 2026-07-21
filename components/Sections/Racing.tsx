import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import AddToCalendarButton from '../UI/AddToCalendarButton'

export default function Racing() {
  const upcomingRace = {
    startDate: '2026-10-23',
    endDate: '2026-10-25',
    name: 'Maker Faire Rome 2026',
    location: 'Gazometro | Via del Commercio 9-11',
    dateRange: '23-25 Ottobre 2026'
  }


  return (
    <section id="racing" className="scroll-mt-20 py-10 bg-gradient-to-b from-primary via-deep-space to-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
            Eventi
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Il rov in azione dal vivo durante gli eventi a cui partecipiamo
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
                  <span className="inline-block bg-accent/90 text-white px-4 py-2 rounded-full text-lg font-semibold mb-4 backdrop-blur-sm">
                    Prossimo Evento
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                    {upcomingRace.name}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      <div className="relative grid grid-cols-2 items-center align-items-left">
                        <div>
                          <div className="text-lg font-semibold">{upcomingRace.dateRange}</div>
                          <div className="text-gray-300 text-sm">10:00 - 17:00</div>
                        </div>
                        <div className="mt-2">
                          <AddToCalendarButton
                            eventName={upcomingRace.name}
                            description={`Partecipa all'evento ${upcomingRace.name} con Scuderia DIIEM!`}
                            location={upcomingRace.location}
                            startTime={`${upcomingRace.startDate}T10:00:00`}
                            endTime={`${upcomingRace.endDate}T17:00:00`}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <div className="text-lg font-semibold">{upcomingRace.location}</div>
                        <div className="text-gray-300 text-sm">00154 Roma, Italia</div>
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
                    <p className="mb-4">
                      Ogni anno, Roma diventa il cuore pulsante dell’innovazione europea: maker, ricercatori, startup, scuole, imprese e semplici curiosi si ritrovano per toccare con mano tecnologie che ancora non esistevano ieri, e immaginare insieme quelle di domani.
                    </p>
                    <p>
                      Scopri di più sull'evento qui: <a href="https://makerfairerome.eu/" target="_blank" className="text-accent hover:underline">Maker Faire Rome 2026</a>
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* Right side - Map */}
              <motion.div
                className="relative h-64 min-h-[300px] overflow-hidden rounded-xl shadow-xl lg:h-full"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <iframe
                  title="Mappa Scuderia DIIEM"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2971.084473229994!2d12.472128111543384!3d41.86952897112281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13258a82836bb899%3A0x724542ca2b483aa0!2sVia%20del%20Commercio%2C%209%2F11%2C%2000154%20Roma%20RM!5e0!3m2!1sit!2sit!4v1781768437369!5m2!1sit!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                />
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
          {/*<p className="text-gray-500 italic">
            Questa sarà la nostra prima competizione ufficiale. Seguici per aggiornamenti sul nostro percorso!
          </p>*/}
        </motion.div>
      </div>
    </section>
  )
}


import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../UI/Button'


const stats = [
  { label: 'Anni di Attività', value: '3+', icon: '📅' },
    { label: 'Membri Team', value: '30+', icon: '👥' },
  //{ label: 'Competizioni', value: '1', icon: '🏁' },
  { label: 'Eventi svolti', value: '5', icon: '🚀' }
  //{ label: 'Tecnologie Sviluppate', value: '5+', icon: '⚙️' },
  //{ label: 'Innovazioni', value: '3', icon: '💡' }
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-10 py-20 bg-gradient-to-b from-primary via-deep-space to-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2 font-display">
            Chi Siamo
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-200 sm:text-lg">
            La storia della Scuderia DIIEM e la nostra missione
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-center items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/photos/DSCF7641.JPG"
                alt="Scuderia DIIEM Team"
                fill
                className="object-cover"
              />
            </div>
            <Button href="/structure" variant="primary"
              className="mt-6">
                  Scopri la nostra struttura
              </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-2 text-left"
          >
            <h3 className="text-3xl font-bold font-display text-accent">
              La Nostra Storia
            </h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              La "SDR3 Robotic", scuderia del dipartimento DIIEM dell'Università Roma Tre, nasce dalla passione di un gruppo di studenti per l'ingegneria e il mondo marino.
              Il nostro team vede collaborare giovani studenti  di ingegneria per la creazione di un R.O.V. sottomarino.
            </p>
            <p className="text-lg text-gray-200 leading-relaxed">
              La nostra squadra è molto eterogenea, composta da studenti di ingegneria meccanica, elettronica e biomedica. 
            </p>
             <p className="text-lg text-gray-200 leading-relaxed">
              Ai fini della competizione abbiamo simulato una struttura aziendale, con un CEO, un CTO ed altri ruoli che si occupano di aspetti specifici del progetto, come la gestione dei social media, la ricerca di sponsor e la progettazione tecnica.
            </p>
            <div className="pt-4">
              <h4 className="text-xl font-bold mb-3 text-accent">La Nostra Missione</h4>
              <p className="text-gray-200">
                L'obiettivo principale è di partecipare alla MATE ROV competition ma contemporaneamente siamo impegnati nella ricerca e nello sviluppo nell'ambito subacqueo, la creazione di dispositivi in grado di salvaguardare l'ambiente marino ed infine la crescita personale simulando per la prima volta nel mondo del lavoro.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Statistics Grid */}
        <motion.div
          className="flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-[200px] bg-white/10 backdrop-blur-md rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-accent mb-2 font-display">
                {stat.value}
              </div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}


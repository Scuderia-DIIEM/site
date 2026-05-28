import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Partner {
  title: string
  description: string
  logo: string
  link: string
  role: string
  accentColor: string
}

const partners: Partner[] = [
  {
    title: 'Università degli Studi Roma Tre',
    description: 'La nostra casa accademica, che ci supporta con risorse e laboratori.',
    logo: '/imgs/RomaTre_marchio_blu.png',
    link: 'https://ingegneriaindustrialeelettronicameccanica.uniroma3.it/',
    role: 'Partner Accademico',
    accentColor: 'accent'
  },
  {
    title: 'Arduino',
    description: 'Partner tecnologico per sensori e sistemi di controllo avanzati.',
    logo: '/imgs/arduino.png',
    link: 'https://www.arduino.cc',
    role: 'Partner Tecnologico',
    accentColor: 'accent'
  },
  {
    title: 'Ansys',
    description: 'Fornitore di software per simulazione e analisi ingegneristica, supportando la progettazione dei nostri veicoli.',
    logo: '/imgs/ansys.png',
    link: 'https://www.ansys.com',
    role: 'Partner Tecnologico',
    accentColor: 'accent'
  },
  {
    title: 'Futura Elettronica',
    description: 'Fornitore di componenti elettrici',
    logo: '/imgs/futuraelettronica.png',
    link: 'https://futuranet.it/',
    role: 'Partner Tecnologico',
    accentColor: 'accent'
  },
  {
    title: 'CNR-INM',
    description: 'Partner tecnico per la ricerca e test.',
    logo: '/imgs/cnr.png',
    link: 'https://www.inm.cnr.it/',
    role: 'Partner Tecnico',
    accentColor: 'accent'
  }
]

export default function Features() {
  return (
    <section id="partners" className="py-20 bg-white from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-display">
            I Nostri Partner
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aziende che collaborano con noi e sostengono il nostro progetto.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.a
              key={partner.title}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group block rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 no-underline bg-gradient-to-br from-white to-gray/20"
            >
              <div className="mb-4 flex h-16 bc-white items-center justify-start rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:bg-gradient-to-br from-white to-gray-50 p-3">
                <div className="w-full max-w-20 flex items-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.title} logo`}
                    width={120}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="text-xl font-bold text-primary font-display group-hover:text-accent transition-colors duration-300">
                  {partner.title}
                </h3>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {partner.role}
                </span>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {partner.description}
              </p>
              <div 
                className="text-sm font-semibold"
                style={{ 
                  color: partner.accentColor === 'accent' ? '#f4792b' :
                         partner.accentColor === 'caramel' ? '#b86432' :
                         partner.accentColor === 'primary' ? '#012245' :
                         partner.accentColor === 'deep-space' ? '#202d42' : '#f4792b'
                }}
              >
                Visita il sito
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}


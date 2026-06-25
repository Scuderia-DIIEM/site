import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Partner {
  title: string
  description: string
  logoLight: string
  logoDark: string
  link: string
  role: string
  accentColor: string
}

const partners: Partner[] = [
  {
    title: 'Università degli Studi Roma Tre',
    description: 'La nostra casa accademica, che ci supporta con risorse e laboratori.',
    logoLight: '/imgs/RomaTre_marchio_blu.png',
    logoDark: '/imgs/RomaTre_marchio_bianco.png',
    link: 'https://ingegneriaindustrialeelettronicameccanica.uniroma3.it/',
    role: 'Partner Accademico',
    accentColor: 'accent'
  },
  {
    title: 'Arduino',
    description: 'Partner tecnologico per sensori e sistemi di controllo avanzati.',
    logoLight: '/imgs/arduino.png',
    logoDark: '/imgs/arduino.png',
    link: 'https://www.arduino.cc',
    role: 'Partner Tecnologico',
    accentColor: 'accent'
  },
  {
    title: 'Sagest',
    description: 'Fornitore di componenti elettronici e soluzioni per la prototipazione.',
    logoLight: '/imgs/sagest.png',
    logoDark: '/imgs/sagest_dark.png',
    link: 'https://www.sagest.org',
    role: 'Supplier Tecnico',
    accentColor: 'accent'
  },
  {
    title: 'Ansys',
    description: 'Fornitore di software per simulazione e analisi ingegneristica, supportando la progettazione dei nostri veicoli.',
    logoLight: '/imgs/ansys.png',
    logoDark: '/imgs/ansys.png',
    link: 'https://www.ansys.com',
    role: 'Partner Tecnologico',
    accentColor: 'accent'
  },
  {
    title: 'Futura Elettronica',
    description: 'Fornitore di componentistica elettronica e soluzioni per la prototipazione, supportando lo sviluppo dei nostri sistemi.',
    logoLight: '/imgs/futuraelettronica.png',
    logoDark: '/imgs/futuraelettronica.png',
    link: 'https://futuranet.it/',
    role: 'Supplier Tecnico',
    accentColor: 'accent'
  },
  {
    title: 'CNR-INM',
    description: 'Partner tecnico per la ricerca e test.',
    logoLight: '/imgs/inm.png',
    logoDark: '/imgs/inm_dark.png',
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
              className="group block rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 no-underline bg-gradient-to-br from-white to-gray/200 dark:from-card-bg dark:to-card-variant-bg"
            >
              <div className="mb-4 flex h-16 items-center justify-center rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-sky-900 dark:to-sky-900 p-3">
                <div className="flex h-full w-full max-w-[250px] items-center justify-center">
                  <Image
                    src={partner.logoLight}
                    alt={`${partner.title} logo`}
                    width={160}
                    height={48}
                    className="block h-12 w-auto object-contain dark:hidden"
                  />
                  <Image
                    src={partner.logoDark}
                    alt={`${partner.title} logo`}
                    width={160}
                    height={48}
                    className="hidden h-12 w-auto object-contain dark:block"
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


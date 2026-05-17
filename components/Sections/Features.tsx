import React from 'react'
import { motion } from 'framer-motion'

interface Feature {
  title: string
  description: string
  icon: string
  stat?: string
  accentColor: string
}

const features: Feature[] = [
  {
    title: 'Eccellenza nei Risultati',
    description: 'Track record di successi con vittorie, record e prestazioni di alto livello in competizioni nazionali e internazionali.',
    icon: '🏆',
    stat: '15+ Vittorie',
    accentColor: 'accent'
  },
  {
    title: 'Ingegneria all\'Avanguardia',
    description: 'Innovazioni tecniche e attrezzature di ultima generazione per massimizzare le prestazioni e l\'affidabilità.',
    icon: '⚙️',
    stat: '100% Innovazione',
    accentColor: 'caramel'
  },
  {
    title: 'Squadra Esperta',
    description: 'Team di professionisti dedicati con anni di esperienza nel motorsport e nella tecnologia avanzata.',
    icon: '👥',
    stat: '50+ Membri',
    accentColor: 'primary'
  },
  {
    title: 'Innovazione nel Racing',
    description: 'Focus costante su ricerca e sviluppo per portare nuove soluzioni tecniche e competitive nel mondo delle corse.',
    icon: '💡',
    stat: 'R&D Continuo',
    accentColor: 'accent'
  },
  {
    title: 'Tecnologia Marina',
    description: 'Sviluppo di sistemi avanzati per operazioni subacquee e monitoraggio ambientale marino.',
    icon: '🌊',
    stat: '4 Prodotti',
    accentColor: 'deep-space'
  },
  {
    title: 'Comunità e Partnership',
    description: 'Coinvolgimento attivo della comunità motorsport e collaborazioni strategiche con partner tecnologici.',
    icon: '🤝',
    stat: '20+ Partner',
    accentColor: 'caramel'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
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
            Cosa ci distingue nel mondo del racing e della tecnologia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-primary mb-3 font-display group-hover:text-accent transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              {feature.stat && (
                <div 
                  className="text-2xl font-bold mt-4"
                  style={{ 
                    color: feature.accentColor === 'accent' ? '#f4792b' :
                           feature.accentColor === 'caramel' ? '#b86432' :
                           feature.accentColor === 'primary' ? '#012245' :
                           feature.accentColor === 'deep-space' ? '#202d42' : '#f4792b'
                  }}
                >
                  {feature.stat}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


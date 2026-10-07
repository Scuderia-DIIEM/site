import React from 'react'
import { motion } from 'framer-motion'

interface Testimonial {
  quote: string
  author: string
  role: string
  icon: string
}

const testimonials: Testimonial[] = [
  {
    quote: 'Scuderia DIIEM rappresenta l\'eccellenza nel motorsport italiano. La loro dedizione all\'innovazione e alle prestazioni è straordinaria.',
    author: 'Marco Rossi',
    role: 'Pilota Capo',
    icon: '🏎️'
  },
  {
    quote: 'Lavorare con questo team è stata un\'esperienza incredibile. La loro competenza tecnica e passione per la tecnologia marina è eccezionale.',
    author: 'Laura Bianchi',
    role: 'Ingegnere Progetti',
    icon: '⚙️'
  },
  {
    quote: 'Un team che combina perfettamente tradizione racing e innovazione tecnologica. Sempre un passo avanti.',
    author: 'Giuseppe Verdi',
    role: 'Team Manager',
    icon: '🎯'
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-display">
            Cosa Dicono di Noi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Le parole del nostro team e dei nostri partner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="text-5xl mb-4">{testimonial.icon}</div>
              <div className="text-accent text-4xl mb-4">"</div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                {testimonial.quote}
              </p>
              <div className="border-t pt-4">
                <div className="font-bold text-primary">{testimonial.author}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


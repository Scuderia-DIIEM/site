import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../UI/ProductCard'

const products = [
  {
    title: 'ROV',
    subtitle: 'Veicolo Subacqueo Guidato da Remoto',
    description: 'Il nostro ROV è composto da un core centrale che contiene tutta l\'elettronica: due convertitori 48V-12V, 6 ESC per i thruster, sensori di temperatura, umidità, pressione, infiltrazione d\'acqua e IMU, una camera, un Raspberry Pi 5, un dissipatore e una pompa per il dissipatore. \n Il telaio, progettato da noi, è completamente stampato in 3D. \n Utilizziamo 6 thruster per manovrare il ROV su tutti gli assi, garantendo un controllo preciso e completo.\n Sull\'anteriore sono presenti due luci LED che illuminano la vista della camera posta nel dome del core. Sui lati, integrati tra i thruster e il core, ci sono i volumi di galleggiamento.\n Dietro il tappo del core sono presenti i cavi che entrano nei motori e il cordone con energia ed informazione che arriva alla ground station.\n Il veicolo è controllato attraverso la ground station con un controller Xbox.',
    image: '/render/rov1.png',
    accentColor: 'primary'
  },
  {
    title: 'Float',
    subtitle: 'Boa di Misurazione',
    description: 'Il Float è una boa che viene trasportata dal ROV in un punto della piscina.\n Una volta messa in posizione, parte una routine che la fa immergere fino al fondale.\n Il sensore di pressione ricava la profondità e, una volta riemersa, manda le informazioni acquisite alla ground station tramite antenne.',
    image: '/render/float.png',
    accentColor: 'accent'
  },
  {
    title: 'Ground Station',
    subtitle: 'Stazione di Controllo',
    description: 'Valigetta di controllo con cavo Ethernet, schermo e tastiera per interfaccia grafica e comunicazione con il ROV.\n Al suo interno è presente un Raspberry Pi 5 che gestisce il sistema di controllo e la comunicazione con i dispositivi subacquei.',
    image: '/render/gs.png',
    accentColor: 'deep-space'
  },
  {
    title: 'Arm',
    subtitle: 'Braccio Robotico',
    description: 'Braccio robotico che si attacca al ROV per interagire con oggetti sottomarini durante le operazioni.',
    image: '/render/arm1.png',
    accentColor: 'accent'
  }
]

export default function Products() {
  return (
    <section id="products" className="scroll-mt-20 bg-white py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 text-center sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-3 text-3xl font-bold text-primary sm:text-4xl md:text-5xl font-display">
            I Nostri Dispositivi
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 sm:text-lg">
            Tecnologie innovative in sviluppo per il futuro delle operazioni marine
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.title}
              title={product.subtitle ? `${product.title} - ${product.subtitle}` : product.title}
              description={product.description}
              image={product.image}
              accentColor={product.accentColor}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}


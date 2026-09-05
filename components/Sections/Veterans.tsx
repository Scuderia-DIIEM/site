import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import veteransData from '@/data/veterans.json'
import Modal from '@/components/UI/Modal'

// Array dei veterani dal JSON
const veterans = Array.isArray(veteransData) ? veteransData : []

// Hook per rilevare il numero di colonne in base alla larghezza dello schermo
function useColumnsPerRow() {
  const [columns, setColumns] = useState(5) // Default per xl

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1280) setColumns(5) // xl
      else if (width >= 1024) setColumns(4) // lg
      else if (width >= 768) setColumns(3) // md
      else if (width >= 640) setColumns(2) // sm
      else setColumns(1) // default
    }

    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])

  return columns
}

interface VeteranCardProps {
  veteran: typeof veterans[0]
  index: number
  onSelect: (veteran: typeof veterans[0]) => void
}

function VeteranCard({ veteran, index, onSelect }: VeteranCardProps) {
  return (
    <motion.div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect(veteran)}
    >
      {/* Immagine del veterano */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={veteran.image}
          alt={veteran.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300 grayscale group-hover:grayscale-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay gradient al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Informazioni del veterano */}
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 font-display group-hover:text-primary transition-colors duration-300">
          {veteran.name}
        </h3>
        <p className="text-sm md:text-base text-gray-600 mb-2">
          {veteran.role}
        </p>
        <p className="text-xs text-gray-500">
          {(veteran as any).yearsActive && `${(veteran as any).yearsActive}`}
        </p>
      </div>

      {/* Accento decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default function Veterans() {
  const columnsPerRow = useColumnsPerRow()
  const [visibleRows, setVisibleRows] = useState(2) // Mostra inizialmente due righe per i veterani
  const [selectedVeteran, setSelectedVeteran] = useState<typeof veterans[0] | null>(null)

  const totalRows = Math.ceil(veterans.length / columnsPerRow)
  const visibleCount = visibleRows * columnsPerRow
  const visibleVeterans = veterans.slice(0, visibleCount)
  const hasMore = visibleRows < totalRows
  const showAllVisible = visibleRows >= totalRows

  const handleShowMore = () => {
    setVisibleRows(prev => Math.min(prev + 1, totalRows))
  }

  const handleShowAll = () => {
    setVisibleRows(totalRows)
  }

  const handleShowLess = () => {
    setVisibleRows(2)
  }

  return (
    <section id="veterans" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-display">
            I Nostri Veterani
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Riconosciamo le persone straordinarie che hanno contribuito al nostro successo
          </p>
        </motion.div>

        {/* Griglia dei veterani */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {visibleVeterans.map((veteran, index) => (
            <VeteranCard
              key={veteran.id}
              veteran={veteran}
              index={index}
              onSelect={setSelectedVeteran}
            />
          ))}
        </div>

        {/* Pulsanti di controllo */}
        <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {hasMore && (
            <>
              <button
                onClick={handleShowMore}
                className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 hover:shadow-lg transition-all duration-300"
              >
                Mostra altro
              </button>
              <button
                onClick={handleShowAll}
                className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 hover:shadow-lg transition-all duration-300"
              >
                Mostra tutti
              </button>
            </>
          )}
          {showAllVisible && visibleRows > 2 && (
            <button
              onClick={handleShowLess}
              className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 hover:shadow-lg transition-all duration-300"
            >
              Mostra meno
            </button>
          )}
        </div>

        {/* Modal per i dettagli del veterano */}
        <Modal
          isOpen={selectedVeteran !== null}
          onClose={() => setSelectedVeteran(null)}
          title={selectedVeteran?.name || ''}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Immagine */}
            {selectedVeteran && (
              <div className="md:w-1/3">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={selectedVeteran.image}
                      alt={selectedVeteran.name}
                      fill
                      className="object-cover object-center"
                      style={{ objectPosition: 'center center' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Informazioni e Contatti */}
            <div className="md:w-2/3">
              {selectedVeteran && (
                <>
                  <p className="text-lg text-gray-600 mb-2 font-semibold">
                    {selectedVeteran.role}
                  </p>
                  {(selectedVeteran as any).yearsActive && (
                    <p className="text-sm text-gray-500 mb-6">
                      Periodo di attività: {(selectedVeteran as any).yearsActive}
                    </p>
                  )}

                  {/* Contatti */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">
                      Contatti
                    </h4>

                    {/* Email */}
                    {selectedVeteran.email && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-semibold">📧</span>
                        <a
                          href={`mailto:${selectedVeteran.email}`}
                          className="text-blue-600 hover:underline break-all"
                        >
                          {selectedVeteran.email}
                        </a>
                      </div>
                    )}

                    {/* Telefono */}
                    {(selectedVeteran as any).phone && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-semibold">📱</span>
                        <a
                          href={`tel:${(selectedVeteran as any).phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {(selectedVeteran as any).phone}
                        </a>
                      </div>
                    )}

                    {/* LinkedIn */}
                    {(selectedVeteran as any).linkedin && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-semibold">💼</span>
                        <a
                          href={(selectedVeteran as any).linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}

                    {/* Instagram */}
                    {(selectedVeteran as any).instagram && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-semibold">📸</span>
                        <a
                          href={(selectedVeteran as any).instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}

                    {/* Messaggio se non ci sono contatti */}
                    {!selectedVeteran.email &&
                      !(selectedVeteran as any).phone &&
                      !(selectedVeteran as any).linkedin &&
                      !(selectedVeteran as any).instagram && (
                        <p className="text-gray-500 italic">
                          Nessun contatto disponibile
                        </p>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </section>
  )
}

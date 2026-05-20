import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import teamMembersData from '@/data/team-members.json'
import Modal from '@/components/UI/Modal'

// Array dei membri del team dal JSON
const teamMembers = Array.isArray(teamMembersData) ? teamMembersData : []

// Hook per rilevare il numero di colonne in base alla larghezza dello schermo
// grid-cols-1 (< 640px), sm:grid-cols-2 (>= 640px), md:grid-cols-3 (>= 768px), 
// lg:grid-cols-4 (>= 1024px), xl:grid-cols-5 (>= 1280px)
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

interface TeamMemberCardProps {
  member: typeof teamMembers[0]
  index: number
  onSelect: (member: typeof teamMembers[0]) => void
}

function TeamMemberCard({ member, index, onSelect }: TeamMemberCardProps) {
  return (
    <motion.div
      className="team-card group relative cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect(member)}
    >
      {/* Immagine del membro */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Overlay gradient al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Informazioni del membro */}
      <div className="p-4 md:p-5">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 font-display group-hover:text-primary transition-colors duration-300">
          {member.name}
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          {member.role}
        </p>
      </div>

      {/* Accento decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default function Team() {
  const columnsPerRow = useColumnsPerRow()
  const [visibleRows, setVisibleRows] = useState(1) // Mostra inizialmente solo la prima riga
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null)

  const totalRows = Math.ceil(teamMembers.length / columnsPerRow)
  const visibleCount = visibleRows * columnsPerRow
  const visibleMembers = teamMembers.slice(0, visibleCount)
  const hasMore = visibleRows < totalRows

  const handleShowMore = () => {
    setVisibleRows(prev => Math.min(prev + 1, totalRows))
  }

  return (
    <section id="team" className="scroll-mt-20 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-display">
            Il Nostro Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conosci le persone che rendono possibile tutto questo
          </p>
        </motion.div>

        {/* Griglia dei membri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {visibleMembers.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
              onSelect={setSelectedMember}
            />
          ))}
        </div>

        {/* Pulsanti di controllo */}
        <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {hasMore && (
            <button
              onClick={handleShowMore}
              className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-caramel hover:shadow-lg transition-all duration-300"
            >
              Mostra altro
            </button>
          )}
          <Link href="/team">
            <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-variant hover:shadow-lg transition-all duration-300">
              Mostra tutti
            </button>
          </Link>
        </div>

        {/* Modal per i dettagli del membro */}
        <Modal
          isOpen={selectedMember !== null}
          onClose={() => setSelectedMember(null)}
          title={selectedMember?.name || ''}
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Immagine */}
            {selectedMember && (
              <div className="md:w-1/3">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Informazioni e Contatti */}
            <div className="md:w-2/3">
              {selectedMember && (
                <>
                  <p className="text-lg text-gray-600 mb-6 font-semibold">
                    {selectedMember.role}
                  </p>

                  {/* Contatti */}
                  <div className="space-y-4">
                    <h4 className="text-xl font-bold text-primary mb-4">
                      Contatti
                    </h4>

                    {/* Email */}
                    {selectedMember.email && (
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-semibold">📧</span>
                        <a
                          href={`mailto:${selectedMember.email}`}
                          className="text-blue-600 hover:underline break-all"
                        >
                          {selectedMember.email}
                        </a>
                      </div>
                    )}

                    {/* Telefono */}
                    {(selectedMember as any).phone && (
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-semibold">📱</span>
                        <a
                          href={`tel:${(selectedMember as any).phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {(selectedMember as any).phone}
                        </a>
                      </div>
                    )}

                    {/* LinkedIn */}
                    {(selectedMember as any).linkedin && (
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-semibold">💼</span>
                        <a
                          href={(selectedMember as any).linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}

                    {/* Instagram */}
                    {(selectedMember as any).instagram && (
                      <div className="flex items-center gap-3">
                        <span className="text-primary font-semibold">📸</span>
                        <a
                          href={(selectedMember as any).instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}

                    {/* Messaggio se non ci sono contatti */}
                    {!selectedMember.email &&
                      !(selectedMember as any).phone &&
                      !(selectedMember as any).linkedin &&
                      !(selectedMember as any).instagram && (
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

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import teamMembersData from '@/data/team-members.json'

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
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  return (
    <motion.div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
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
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default function Team() {
  const columnsPerRow = useColumnsPerRow()
  const [visibleRows, setVisibleRows] = useState(1) // Mostra inizialmente solo la prima riga

  const totalRows = Math.ceil(teamMembers.length / columnsPerRow)
  const visibleCount = visibleRows * columnsPerRow
  const visibleMembers = teamMembers.slice(0, visibleCount)
  const hasMore = visibleRows < totalRows
  const showAllVisible = visibleRows >= totalRows

  const handleShowMore = () => {
    setVisibleRows(prev => Math.min(prev + 1, totalRows))
  }

  const handleShowAll = () => {
    setVisibleRows(totalRows)
  }

  const handleShowLess = () => {
    setVisibleRows(1)
  }

  return (
    <section id="team" className="py-20 bg-white">
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
            />
          ))}
        </div>

        {/* Pulsanti di controllo */}
        <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
          {hasMore && (
            <>
              <button
                onClick={handleShowMore}
                className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-caramel hover:shadow-lg transition-all duration-300"
              >
                Mostra altro
              </button>
              <button
                onClick={handleShowAll}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-variant hover:shadow-lg transition-all duration-300"
              >
                Mostra tutti
              </button>
            </>
          )}
          {showAllVisible && visibleRows > 1 && (
            <button
              onClick={handleShowLess}
              className="px-8 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 hover:shadow-lg transition-all duration-300"
            >
              Mostra meno
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

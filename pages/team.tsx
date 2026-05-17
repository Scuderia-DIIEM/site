import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import teamMembersData from '@/data/team-members.json'
import veteransData from '@/data/veterans.json'
import Modal from '@/components/UI/Modal'

// Array dei membri del team e dei veterani dal JSON
const teamMembers = Array.isArray(teamMembersData) ? teamMembersData : []
const veterans = Array.isArray(veteransData) ? veteransData : []

interface TeamMemberCardProps {
  member: typeof teamMembers[0]
  index: number
  onSelect: (member: typeof teamMembers[0]) => void
}

function TeamMemberCard({ member, index, onSelect }: TeamMemberCardProps) {
  return (
    <motion.div
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.02 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(member)}
    >
      {/* Immagine del membro */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
        {/* Overlay gradient al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Informazioni del membro */}
      <div className="p-2 sm:p-3">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 font-display group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {member.name}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-2">
          {member.role}
        </p>
      </div>

      {/* Accento decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null)

  return (
    <>
      <Head>
        <title>Il Nostro Team - Scuderia DIIEM</title>
        <meta name="description" content="Conosci il team completo della Scuderia DIIEM, inclusi i nostri veterani che hanno contribuito al successo." />
      </Head>

      <div className="min-h-screen">
        <Header />

        <main>
          <section className="py-12 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">
                  Il Nostro Team
                </h1>
                <p className="text-lg text-gray-100 max-w-2xl mx-auto">
                  Conosci le persone che rendono possibile tutto questo
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Sezione Team Members */}
              <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">
                  Team Attuale
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4">
                  {teamMembers.map((member, index) => (
                    <TeamMemberCard
                      key={member.id}
                      member={member}
                      index={index}
                      onSelect={setSelectedMember}
                    />
                  ))}
                </div>
              </div>

              {/* Sezione Veterani */}
              {veterans.length > 0 && (
                <div>
                  <motion.div
                    className="mt-12 pt-12 border-t-2 border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 font-display">
                      I Nostri Veterani
                    </h2>
                  </motion.div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-3 sm:gap-4">
                    {veterans.map((veteran, index) => (
                      <TeamMemberCard
                        key={`veteran-${veteran.id}`}
                        member={veteran as typeof teamMembers[0]}
                        index={index}
                        onSelect={setSelectedMember}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

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
                  {(selectedMember as any).yearsActive && (
                    <p className="text-sm text-gray-500 mb-6">
                      Periodo di attività: {(selectedMember as any).yearsActive}
                    </p>
                  )}

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

        <Footer />
      </div>
    </>
  )
}

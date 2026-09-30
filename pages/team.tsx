import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import teamMembersData from '@/data/team-members.json'
import veteransData from '@/data/veterans.json'
import Modal from '@/components/UI/Modal'
import MemberSkills from '@/components/UI/MemberSkills'

// Array dei membri del team e dei veterani dal JSON
const teamMembers = Array.isArray(teamMembersData) ? teamMembersData : []
const veterans = Array.isArray(veteransData) ? veteransData : []

type TechnicalArea = 'all' | 'elettronica' | 'informatica' | 'cad' | 'meccanica'
type ProjectTeam = 'all' | 'rov' | 'float' | 'arm' | 'gs' | 'special'

const technicalAreaFilters: Array<{ id: TechnicalArea; label: string }> = [
  { id: 'elettronica', label: 'Elettronica' },
  { id: 'informatica', label: 'Informatica' },
  { id: 'cad', label: 'CAD' },
  { id: 'meccanica', label: 'Meccanica' },
]

const projectTeamFilters: Array<{ id: ProjectTeam; label: string }> = [
  { id: 'rov', label: 'ROV' },
  { id: 'float', label: 'FLOAT' },
  { id: 'arm', label: 'ARM' },
  { id: 'gs', label: 'GS' },
  { id: 'special', label: 'Tecnologie speciali' },
]

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
      transition={{ duration: 0.5, delay: index * 0.02 }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(member)}
    >
      {/* Immagine del membro */}
      <div className="team-card-image">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
        {/* Overlay gradient al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <MemberSkills skills={(member as { skills?: string[] }).skills} limit={4} preview />
      </div>

      {/* Informazioni del membro */}
      <div className="p-2 sm:p-3">
        <h3 className="team-card-title mb-0.5 line-clamp-2 font-display text-xs font-bold transition-colors duration-300 group-hover:text-primary sm:text-sm dark:group-hover:text-accent">
          {member.name}
        </h3>
        <div className="team-card-role flex flex-col text-xs">
          {member.headOf && (
            <span className="text-primary">
              Head of {member.headOf === 'role'
                ? (Array.isArray(member.role) ? member.role.join(', ') : member.role)
                : member.team}
            </span>
          )}
          {member.headOf !== 'team' && <span>{member.team}</span>}
          {member.headOf !== 'role' && (
            <span>{Array.isArray(member.role) ? member.role.join(', ') : member.role}</span>
          )}
        </div>
      </div>

      {/* Accento decorativo */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-orange-500 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null)
  const [activeSection, setActiveSection] = useState<'current' | 'founders'>('current')
  const [selectedArea, setSelectedArea] = useState<TechnicalArea>('all')
  const [selectedTeam, setSelectedTeam] = useState<ProjectTeam>('all')

  const activeMembers = activeSection === 'current'
    ? teamMembers
    : veterans

  const filteredMembers = activeSection === 'current'
    ? activeMembers.filter((member) => {
        const memberRole = (member as { role?: string | string[] }).role ?? ''
        const roles = Array.isArray(memberRole) ? memberRole : [memberRole]
        const team = (member as { team?: string }).team ?? ''
        const project = selectedTeam === 'special' ? 'tecnologie speciali' : selectedTeam
        return (selectedArea === 'all' || roles.some((role) => role.toLowerCase() === selectedArea)) &&
          (selectedTeam === 'all' || team.toLowerCase() === project)
      })
    : activeMembers

  const activeTitle = activeSection === 'current' ? 'Team Attuale' : 'Founders'

  return (
    <>
      <Head>
        <title>Il Nostro Team - Scuderia DIIEM</title>
        <meta name="description" content="Conosci il team completo della Scuderia DIIEM, inclusi i nostri veterani che hanno contribuito al successo." />
      </Head>

      <div className="min-h-screen">
        <Header />

        <main>
          <section className="pt-28 pb-12 bg-primary">
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
              <div className="mb-8 flex flex-col items-center gap-5 sm:mb-10">
                <div className="toggle-group">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('current')
                      setSelectedArea('all')
                      setSelectedTeam('all')
                      setSelectedMember(null)
                    }}
                    className={`toggle-button px-5 py-2 text-sm sm:px-6 ${
                      activeSection === 'current'
                        ? 'toggle-button-active'
                        : 'toggle-button-inactive'
                    }`}
                  >
                    Team Attuale
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveSection('founders')
                      setSelectedArea('all')
                      setSelectedTeam('all')
                      setSelectedMember(null)
                    }}
                    className={`toggle-button px-5 py-2 text-sm sm:px-6 ${
                      activeSection === 'founders'
                        ? 'toggle-button-active'
                        : 'toggle-button-inactive'
                    }`}
                  >
                    Founders
                  </button>
                </div>

                {activeSection === 'current' && (
                  <div className="max-w-full overflow-x-auto pb-2" aria-label="Filtri del team">
                    <div className="mx-auto flex w-max items-center gap-1.5">
                      {projectTeamFilters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setSelectedTeam(selectedTeam === filter.id ? 'all' : filter.id)}
                        className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-300 hover:z-10 hover:px-6 sm:text-xs ${
                          selectedTeam === filter.id
                            ? 'toggle-button-active'
                            : 'border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
                        }`}
                        aria-pressed={selectedTeam === filter.id}
                      >
                        {filter.label}
                      </button>
                    ))}
                      <span className="mx-0.5 h-4 w-px shrink-0 bg-gray-200" aria-hidden="true" />
                      {technicalAreaFilters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setSelectedArea(selectedArea === filter.id ? 'all' : filter.id)}
                        className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-300 hover:z-10 hover:px-6 sm:text-xs ${
                          selectedArea === filter.id
                            ? 'toggle-button-active'
                            : 'border border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
                        }`}
                        aria-pressed={selectedArea === filter.id}
                      >
                        {filter.label}
                      </button>
                    ))}
                    </div>
                  </div>
                )}
              </div>

              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="mb-6 text-2xl font-bold text-gray-900 font-display">
                  {activeTitle}
                </h2>

                {filteredMembers.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
                    {filteredMembers.map((member, index) => (
                      <TeamMemberCard
                        key={`${activeSection}-${member.id}`}
                        member={member as typeof teamMembers[0]}
                        index={index}
                        onSelect={setSelectedMember}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">
                      Nessun membro disponibile per questo filtro.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        </main>

        {/* Modal per i dettagli del membro */}
        <Modal
          isOpen={selectedMember !== null}
          onClose={() => setSelectedMember(null)}
          title={selectedMember?.name || ''}
        >
          <div className="member-modal-body flex flex-col md:flex-row items-center gap-6">
            {/* Immagine e breve info */}
            {selectedMember && (
              <div className="member-modal-photo w-full flex-shrink-0 self-center">
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-100 dark:border-white/10 dark:bg-[#071425]">
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      fill
                      className="object-cover object-center"
                      style={{ objectPosition: 'center center' }}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  {(selectedMember as any).yearsActive && (
                    <p className="text-xs text-gray-500 mt-1">Periodo di attività: {(selectedMember as any).yearsActive}</p>
                  )}
                </div>
              </div>
            )}

            {/* Informazioni e Contatti principali */}
            <div className="member-modal-info w-full">
              {selectedMember && (
                <div className="px-1 md:px-4">
                  <div className="member-modal-heading-row">
                    <div>
                      <p className="text-lg text-gray-600 font-semibold">
                        {selectedMember.headOf && (
                          <p className="text-lg text-primary">
                            Head of {selectedMember.headOf === 'role'
                              ? (Array.isArray(selectedMember.role) ? selectedMember.role.join(', ') : selectedMember.role)
                              : selectedMember.team}
                          </p>
                        )}
                      </p>
                      {selectedMember.headOf !== 'team' && (
                        <p className="text-lg text-gray-600 font-semibold">
                          {selectedMember.team}
                        </p>
                      )}
                      {selectedMember.headOf !== 'role' && (
                        <p className="text-lg font-semibold text-gray-700">
                          {Array.isArray(selectedMember.role) ? selectedMember.role.join(', ') : selectedMember.role}
                        </p>
                      )}
                    </div>
                    <MemberSkills
                      skills={(selectedMember as { skills?: string[] }).skills}
                    />
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-primary mb-3">Contatti</h4>

                  <div className="grid grid-cols-1 gap-3">
                    {/* Email */}
                    {selectedMember.email && (
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-primary">📧</span>
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
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-primary">📱</span>
                        <a
                          href={`tel:${(selectedMember as any).phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {(selectedMember as any).phone}
                        </a>
                      </div>
                    )}

                    {/* Mail 2 */}
                    {(selectedMember as any).email2 && (
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-primary">✉️</span>
                        <a
                          href={`mailto:${(selectedMember as any).email2}`}
                          className="text-blue-600 hover:underline break-all"
                        >
                          {(selectedMember as any).email2}
                        </a>
                      </div>
                    )}

                    {/* LinkedIn */}
                    {(selectedMember as any).linkedin && (
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-primary">💼</span>
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

                    {/* Messaggio se non ci sono contatti */}
                    {!selectedMember.email &&
                      !(selectedMember as any).phone &&
                      !(selectedMember as any).linkedin &&
                      !(selectedMember as any).email2 && (
                        <p className="text-gray-500 italic">Nessun contatto disponibile</p>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>

        <Footer />
      </div>
    </>
  )
}

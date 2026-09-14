import React from 'react'

interface MemberSkillsProps {
  skills?: string[]
  limit?: number
  preview?: boolean
}

interface SkillDefinition {
  id: string
  name: string
  description: string
  fallback: string
}

const skillDefinitions: SkillDefinition[] = [
  { id: 'corso-sicurezza', name: 'Corso Sicurezza', description: 'Norme e protocolli di sicurezza', fallback: 'S' },
  { id: 'manutenzione', name: 'Manutenzione', description: 'Controllo e riparazione dei componenti', fallback: 'M' },
  { id: 'stampante-3d', name: 'Stampante 3D', description: 'Prototipazione e stampa rapida', fallback: '3D' },
  { id: 'stampante-resina', name: 'Stampante a resina', description: 'Dettagli fini e parti precise', fallback: 'R' },
  { id: 'saldare', name: 'Saldare', description: 'Assemblaggi e lavorazioni metalliche', fallback: 'SA' },
  { id: 'core', name: 'Core', description: 'Sviluppo e ottimizzazione del veicolo', fallback: 'C' },
]

function getSkills(skills: string[] | undefined) {
  return (skills ?? [])
    .map((id) => skillDefinitions.find((skill) => skill.id === id))
    .filter((skill): skill is SkillDefinition => Boolean(skill))
}

export default function MemberSkills({ skills, limit, preview = false }: MemberSkillsProps) {
  const memberSkills = getSkills(skills).slice(0, limit)

  return (
    <div className={`member-skills ${preview ? 'member-skills-preview' : ''}`} aria-label="Skills del membro">
      {memberSkills.map((skill) => (
        <span className="member-skill" key={skill.id} title={`${skill.name}:\n${skill.description}`} tabIndex={0}>
          <img
            src={`/icons/${skill.id}.png`}
            alt={skill.name}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
              event.currentTarget.nextElementSibling?.removeAttribute('hidden')
            }}
          />
          <span className="member-skill-fallback" hidden>{skill.fallback}</span>
          <span className="member-skill-tooltip" role="tooltip">
            <strong>{skill.name}</strong>
            <span>{skill.description}</span>
          </span>
        </span>
      ))}
    </div>
  )
}
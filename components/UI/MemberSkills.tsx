import React from 'react'

interface MemberSkillsProps {
  skills?: string[]
  limit?: number
  preview?: boolean
}

interface SkillDefinition {
  id: string
  name: string
  fallback: string
}

const skillDefinitions: SkillDefinition[] = [
  { id: 'corso-sicurezza', name: 'Corso sicurezza', fallback: 'S' },
  { id: 'manutenzione', name: 'Manutenzione', fallback: 'M' },
  { id: 'stampante-3d', name: 'Stampante 3D', fallback: '3D' },
  { id: 'stampante-resina', name: 'Stampante a resina', fallback: 'R' },
  { id: 'saldare', name: 'Saldare', fallback: 'SA' },
  { id: 'core', name: 'Core', fallback: 'C' },
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
        <span className="member-skill" key={skill.id} title={skill.name} tabIndex={0}>
          <img
            src={`/icons/${skill.id}.png`}
            alt={skill.name}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
              event.currentTarget.nextElementSibling?.removeAttribute('hidden')
            }}
          />
          <span className="member-skill-fallback" hidden>{skill.fallback}</span>
          <span className="member-skill-tooltip" role="tooltip">{skill.name}</span>
        </span>
      ))}
    </div>
  )
}
import React from 'react'
import { motion } from 'framer-motion'

interface AddToCalendarButtonProps {
  eventName: string
  location: string
  startTime: string
  endTime: string
  description?: string
}

export default function AddToCalendarButton({
  eventName,
  location,
  startTime,
  endTime,
  description
}: AddToCalendarButtonProps) {
  const addToCalendar = () => {
    // Format dates for ICS (YYYYMMDDTHHMMSSZ)
    const start = new Date(startTime)
    const end = new Date(endTime)
    
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Scuderia DIIEM//MATE ROV Competition//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `SUMMARY:${eventName}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${description || eventName}`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${eventName} starts tomorrow`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${eventName.replace(/\s+/g, '_')}_2026.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
    >
      <motion.button
        onClick={addToCalendar}
        className="btn-dark-outline btn-secondary flex items-center gap-2 px-4 py-2 rounded-md relative overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="relative z-10 text-sm ">Aggiungi al Calendario</span>
        
        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          whileHover={{ x: '200%' }}
          transition={{ duration: 0.6 }}
        />
      </motion.button>
    </motion.div>
  )
}


import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md transition-all duration-300 ${hover ? 'hover:shadow-xl hover:scale-105' : ''} ${className}`}
      whileHover={hover ? { y: -5 } : {}}
    >
      {children}
    </motion.div>
  )
}


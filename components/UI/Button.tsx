import React from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function Button({ 
  children, 
  variant = 'primary', 
  href, 
  onClick,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 font-semibold rounded-lg transition-all duration-300 inline-block text-center'
  const variantClasses = {
    primary: 'bg-accent text-white hover:bg-caramel hover:shadow-lg',
    secondary: 'bg-primary text-white hover:bg-primary-variant hover:shadow-lg'
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}


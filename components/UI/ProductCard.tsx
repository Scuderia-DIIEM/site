import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Modal from './Modal'

interface ProductCardProps {
  title: string
  description: string
  image: string
  icon?: React.ReactNode
  accentColor?: string
  delay?: number
}

const colorMap: Record<string, string> = {
  'primary': '#012245',
  'accent': '#f4792b',
  'deep-space': '#202d42',
  'caramel': '#b86432'
}

export default function ProductCard({
  title,
  description,
  image,
  icon,
  accentColor = 'accent',
  delay = 0
}: ProductCardProps) {
  const color = colorMap[accentColor] || colorMap['accent']
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showReadMore, setShowReadMore] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const hiddenDescriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Check if description text is truncated (more than 3 lines)
    const checkTruncation = () => {
      if (descriptionRef.current && hiddenDescriptionRef.current) {
        const visibleElement = descriptionRef.current
        const hiddenElement = hiddenDescriptionRef.current
        
        // Get computed styles from visible element
        const styles = window.getComputedStyle(visibleElement)
        const lineHeight = parseFloat(styles.lineHeight) || parseFloat(styles.fontSize) * 1.5
        
        // Apply same width to hidden element for accurate measurement
        const visibleWidth = visibleElement.clientWidth
        hiddenElement.style.width = `${visibleWidth}px`
        hiddenElement.style.padding = styles.padding
        hiddenElement.style.fontSize = styles.fontSize
        hiddenElement.style.fontFamily = styles.fontFamily
        hiddenElement.style.fontWeight = styles.fontWeight
        hiddenElement.style.lineHeight = styles.lineHeight
        hiddenElement.style.letterSpacing = styles.letterSpacing
        
        const maxHeight = lineHeight * 3 // 3 lines
        const fullHeight = hiddenElement.scrollHeight
        
        // Show "Mostra altro" if the full text height exceeds 3 lines
        setShowReadMore(fullHeight > maxHeight + 2) // 2px tolerance for rounding
      }
    }

    // Use requestAnimationFrame to ensure DOM is fully rendered
    const rafId = requestAnimationFrame(() => {
      setTimeout(checkTruncation, 0)
    })
    window.addEventListener('resize', checkTruncation)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', checkTruncation)
    }
  }, [description])

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay }}
        className="group relative flex h-[270px] flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl sm:h-[420px] lg:h-[500px]"
      >
        {/* Image Container */}
        <div className="relative h-28 flex-shrink-0 overflow-hidden sm:h-48 lg:h-64">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-t to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(to top, ${color}CC, transparent)` }}
          />
          {icon && (
            <div className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {icon}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="relative flex min-h-0 flex-1 flex-col p-3 sm:p-5 lg:p-6">
          <h3 className="mb-2 flex-shrink-0 text-sm font-bold leading-tight text-primary transition-colors duration-300 group-hover:text-accent sm:mb-3 sm:text-xl lg:text-2xl font-display">
            {title}
          </h3>
          <div className="flex-1 flex flex-col min-h-0">
            {/* Hidden element to measure full text height - positioned absolutely off-screen */}
            <p 
              ref={hiddenDescriptionRef}
              className="text-gray-600 leading-relaxed absolute opacity-0 pointer-events-none"
              style={{ 
                top: '-9999px',
                left: 0,
                visibility: 'hidden'
              }}
            >
              {description}
            </p>
            <p 
              ref={descriptionRef}
              className="line-clamp-3 text-xs leading-snug text-gray-600 sm:text-sm sm:leading-relaxed lg:text-base"
            >
              {description}
            </p>
          </div>
          {showReadMore && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
              className="absolute bottom-2 right-2 rounded-full p-1.5 text-accent transition-all duration-200 hover:bg-accent/10 hover:text-caramel sm:bottom-4 sm:right-4 sm:p-2 group/icon"
              aria-label="Mostra altro"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Hover Glow Effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: color }}
        />
      </motion.div>

      {/* Modal for full description */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </Modal>
    </>
  )
}


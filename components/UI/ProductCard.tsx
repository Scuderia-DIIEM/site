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
        className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-[500px]"
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden flex-shrink-0">
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
        <div className="p-6 flex flex-col flex-1 min-h-0 relative">
          <h3 className="text-2xl font-bold text-primary mb-3 font-display group-hover:text-accent transition-colors duration-300 flex-shrink-0">
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
              className="text-gray-600 leading-relaxed line-clamp-3"
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
              className="absolute bottom-4 right-4 p-2 text-accent hover:text-caramel hover:bg-accent/10 rounded-full transition-all duration-200 group/icon"
              aria-label="Mostra altro"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
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


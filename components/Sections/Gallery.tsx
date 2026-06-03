import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../UI/Button'

interface GalleryImage {
  src: string
  alt: string
  title?: string
  description?: string
  caption?: string
  articleSlug?: string
}

interface GalleryProps {
  images?: GalleryImage[]
}

const defaultImages: GalleryImage[] = [
  {
    src: '/render/arm.png',
    alt: 'Progetto Scuderia DIIEM',
    title: 'Progettazione CAD',
    description: 'Il progetto CAD è il primo passo di ogni dispositivo. Qui iniziamo a definire forma, meccanica e dettagli costruttivi con estrema precisione.',
    caption: 'Il design non è solo come qualcosa appare o si percepisce. Il design è come funziona',
    articleSlug: 'project-CAD'
  },
  {
    src: '/imgs/projects/h2o0.png',
    alt: 'Sensore rilevamento perdite d’acqua',
    title: 'Sensore rilevamento perdite d’acqua',
    description: 'Progettazione metodologica di un sensore conduttivo per il rilevamento di infiltrazioni d’acqua in un ROV.',
    caption: 'Prevenire è progettare',
    articleSlug: 'project-h2oleaks'
  },
  {
    src: '/imgs/projects/shunt1.png',
    alt: 'Consumo elettrico di un ROV',
    title: 'Consumo elettrico di un ROV',
    description: 'Caratterizzazione sperimentale dell’assorbimento elettrico di un ROV mediante misure con shunt.',
    caption: 'Misurare per innovare',
    articleSlug: 'project-shunt'
  },
  {
    src: '/render/arm1.png',
    alt: 'Progettazione Arm',
    title: 'Progettazione Arm',
    description: 'Sviluppo e integrazione meccatronica di un braccio robotico per ROV.',
    caption: 'Dall’idea al movimento',
    articleSlug: 'project-arm'
  }
]

export default function Gallery({ images = defaultImages }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length, isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlaying(false)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    }
    if (isRightSwipe) {
      goToPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const currentImage = images[currentIndex]

  return (
    <section id="gallery" className="scroll-mt-5 py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-display">
            I Nostri Progetti
          </h2>
          <Button href="/projects" variant="primary"
            className="mt-6">
                Scopri i nostri progetti
            </Button>
        </motion.div>

        <div
          ref={containerRef}
          className="relative max-w-7xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Modern Slideshow Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Container - hidden on mobile, shown on large screens */}
            <div className="hidden lg:block lg:col-span-2 relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.05, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -50 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentImage.src}
                    alt={currentImage.alt}
                    fill
                    className="object-cover"
                    priority={currentIndex === 0}
                  />
                  
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Image counter */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Modern Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-primary p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                aria-label="Immagine precedente"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-primary p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                aria-label="Immagine successiva"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Play/Pause button */}
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
                aria-label={isAutoPlaying ? 'Pausa' : 'Riproduci'}
              >
                {isAutoPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            {/* Description Panel - Takes 1 column on large screens */}
            <div className="lg:col-span-1">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-br from-primary to-deep-space rounded-2xl p-6 md:p-8 shadow-2xl text-white flex flex-col justify-between"
              >
                <div>
                  {currentImage.title && (
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 font-display text-accent">
                      {currentImage.title}
                    </h3>
                  )}
                  
                  {currentImage.description ? (
                    <p className="text-gray-100 text-base md:text-lg leading-relaxed mb-4">
                      {currentImage.description}
                    </p>
                  ) : currentImage.caption ? (
                    <p className="text-gray-100 text-base md:text-lg leading-relaxed mb-4">
                      {currentImage.caption}
                    </p>
                  ) : null}

                  {currentImage.caption && currentImage.description && (
                    <p className="text-gray-300 text-sm italic border-l-4 border-accent pl-4 mt-4">
                      {currentImage.caption}
                    </p>
                  )}
                </div>

                {currentImage.articleSlug && (
                  <div className="mt-6">
                    <Link href={`/projects/${currentImage.articleSlug}`} className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-secondary transition-colors duration-300">
                      Continua a leggere
                    </Link>
                  </div>
                )}

                {/* Thumbnail Navigation */}
                <div className="mt-6">
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                          index === currentIndex
                            ? 'ring-2 ring-accent ring-offset-2 ring-offset-primary scale-105'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                        aria-label={`Vai all'immagine ${index + 1}`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Modern Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-12 h-3'
                    : 'w-3 h-3'
                }`}
                aria-label={`Vai alla slide ${index + 1}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-accent shadow-lg shadow-accent/50'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


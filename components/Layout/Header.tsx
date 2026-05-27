import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme)
    } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const router = useRouter()
  const isHome = router.pathname === '/'

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Dispositivi', href: '/#products' },
    { label: 'Chi Siamo', href: '/#about' },
    { label: 'Progetti', href: isHome ? '#gallery' : '/projects' },
    { label: 'Team', href: isHome ? '#team' : '/team' },
    { label: 'Eventi', href: '/#racing' },
    { label: 'Contatti', href: '/#contact' },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-primary/95 backdrop-blur-md shadow-lg'
        : 'bg-primary'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logos */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-4 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src="/imgs/SDR3_bianco.png"
                alt="Scuderia DIIEM Logo"
                width={86}
                height={86}
                className="object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link key={item.href} href={item.href}>
                  <motion.span
                    className="text-white hover:text-accent transition-colors duration-300 font-medium cursor-pointer"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="rounded-full border border-white/30 bg-white/10 px-3 py-2 text-white transition hover:bg-white/20"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '🔆' : '🌙'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className="block text-white hover:text-accent transition-colors duration-300 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </span>
              </Link>
            ))}
            <button
              type="button"
              className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-3 text-white transition hover:bg-white/20"
              onClick={() => {
                toggleTheme()
                setIsMobileMenuOpen(false)
              }}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
            </button>
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}


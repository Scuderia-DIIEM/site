import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const THINGSPEAK_READ_API_KEY = 'S9S7FDHCYFGVINSP'

type ThingSpeakFeed = {
  field1?: string | null
  field2?: string | null
  created_at?: string
}

function formatSensorValue(value: string | null | undefined, unit: string) {
  const parsedValue = Number(value)
  if (!value || !Number.isFinite(parsedValue)) return '--'
  return `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(parsedValue)}${unit}`
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [sensorFeed, setSensorFeed] = useState<ThingSpeakFeed | null>(null)
  const [isSensorDataFresh, setIsSensorDataFresh] = useState(false)

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
    const readApiKey = THINGSPEAK_READ_API_KEY
    if (!readApiKey) return

    let isActive = true
    const loadSensorFeed = async () => {
      try {
        const response = await fetch(
          `https://api.thingspeak.com/channels/3516664/feeds/last.json?api_key=${encodeURIComponent(readApiKey)}`
        )
        if (!response.ok) return
        const feed = (await response.json()) as ThingSpeakFeed
        if (isActive) setSensorFeed(feed)
      } catch {
        // Keep the last available reading when the network is temporarily unavailable.
      }
    }

    void loadSensorFeed()
    const intervalId = window.setInterval(loadSensorFeed, 60_000)
    return () => {
      isActive = false
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    const recordedAt = sensorFeed?.created_at ? Date.parse(sensorFeed.created_at) : NaN
    const expiresIn = recordedAt + 60_000 - Date.now()

    if (!Number.isFinite(recordedAt) || expiresIn <= 0) {
      setIsSensorDataFresh(false)
      return
    }

    setIsSensorDataFresh(true)
    const timeoutId = window.setTimeout(() => setIsSensorDataFresh(false), expiresIn)
    return () => window.clearTimeout(timeoutId)
  }, [sensorFeed])

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
    { label: 'Struttura', href: '/structure' },
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
      <nav className="w-full px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:ml-auto md:flex items-center space-x-8">
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
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-8">
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <motion.button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              className="relative h-7 w-12 shrink-0 rounded-full border border-white/25 p-0.5 text-white outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
              title={theme === 'dark' ? 'Modalità chiara' : 'Modalità scura'}
              animate={{ backgroundColor: theme === 'dark' ? '#202d42' : '#f4792b' }}
              transition={{ duration: 0.25 }}
            >
              <span
                className={`absolute top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'left-[6px]' : 'right-[6px]'}`}
                aria-hidden="true"
              >
                {theme === 'dark' ? (
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.9 13A8.5 8.5 0 0 1 11 3.1 8.5 8.5 0 1 0 20.9 13Z" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3.5" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                  </svg>
                )}
              </span>
              <motion.span
                className="absolute left-0.5 top-1/2 h-5 w-5 rounded-full bg-white shadow-sm"
                animate={{ x: theme === 'dark' ? 24 : 0, y: '-50%' }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                aria-hidden="true"
              />
            </motion.button>
            <div
              tabIndex={0}
              aria-describedby="sensor-tooltip"
              aria-label={`Temperatura ${formatSensorValue(isSensorDataFresh ? sensorFeed?.field1 : null, ' gradi Celsius')}, umidità ${formatSensorValue(isSensorDataFresh ? sensorFeed?.field2 : null, ' percento')}`}
              className="group relative flex h-10 w-10 shrink-0 cursor-default flex-col items-center justify-center rounded-full border border-white/30 bg-white/10 text-[10px] font-semibold leading-3 text-white outline-none transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>{formatSensorValue(isSensorDataFresh ? sensorFeed?.field1 : null, '°')}</span>
              <span>{formatSensorValue(isSensorDataFresh ? sensorFeed?.field2 : null, '%')}</span>
              <div
                id="sensor-tooltip"
                role="tooltip"
                className="invisible absolute right-0 top-full z-50 mt-2 w-max max-w-[min(18rem,calc(100vw-2rem))] rounded-md border border-white/20 bg-primary px-3 py-2 text-xs font-normal leading-relaxed text-white opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100"
              >
                {sensorFeed ? (
                  <>
                    {!isSensorDataFresh && <div className="mb-1 font-semibold">Ultimo valore registrato</div>}
                    <div>Temperatura: {formatSensorValue(sensorFeed.field1, ' °C')}</div>
                    <div>Umidità: {formatSensorValue(sensorFeed.field2, '%')}</div>
                    {sensorFeed.created_at && (
                      <div className="mt-1 text-white/70">
                        Aggiornato: {new Date(sensorFeed.created_at).toLocaleString('it-IT')}</div>
                    )}
                  </>
                ) : (
                  'Dati non disponibili'
                )}
              </div>
            </div>
          </div>
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
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}


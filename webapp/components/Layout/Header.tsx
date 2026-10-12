import React, { useState, useEffect, useCallback, useRef } from 'react'
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

type AuthUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

type AuthResponse = {
  user?: AuthUser
  mustChangePassword?: boolean
  error?: string
}

function formatSensorValue(value: string | null | undefined, unit: string) {
  const parsedValue = Number(value)
  if (!value || !Number.isFinite(parsedValue)) return '--'
  return `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(parsedValue)}${unit}`
}

export default function Header() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [sensorFeed, setSensorFeed] = useState<ThingSpeakFeed | null>(null)
  const [isSensorDataFresh, setIsSensorDataFresh] = useState(false)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const desktopAccountMenuRef = useRef<HTMLDivElement>(null)
  const mobileAccountMenuRef = useRef<HTMLDivElement>(null)
  const authCheckInFlight = useRef(false)

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

  const loadCurrentUser = useCallback(async () => {
    if (authCheckInFlight.current) return
    authCheckInFlight.current = true
    try {
      const response = await fetch('/api/auth/me')
      if (response.status === 401) {
        setCurrentUser(null)
        setAuthError('')
        return
      }
      if (response.status === 404) {
        setCurrentUser(null)
        setAuthError('API account non disponibile. Avvia Docker Compose dalla cartella del progetto.')
        return
      }
      if (response.status === 429) {
        // Keep the current account state when a burst of route changes hits the API limit.
        setAuthError('')
        return
      }
      if (!response.ok) {
        setAuthError('Impossibile verificare la sessione. Riprova tra poco.')
        return
      }

      const result = (await response.json()) as AuthResponse
      if (!result.user?.name || !result.user.email) {
        throw new Error('Session response did not include a user name and email')
      }
      setCurrentUser(result.user)
      setAuthError('')
    } catch (error) {
      console.error('Unable to verify the signed-in account', error)
      setAuthError('Impossibile verificare la sessione.')
    } finally {
      authCheckInFlight.current = false
      setIsAuthLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCurrentUser()
    router.events.on('routeChangeComplete', loadCurrentUser)
    const closeAccountMenu = () => setIsAccountMenuOpen(false)
    const refreshCurrentUser = () => void loadCurrentUser()
    router.events.on('routeChangeStart', closeAccountMenu)
    window.addEventListener('scuderia:profile-updated', refreshCurrentUser)
    return () => {
      router.events.off('routeChangeComplete', loadCurrentUser)
      router.events.off('routeChangeStart', closeAccountMenu)
      window.removeEventListener('scuderia:profile-updated', refreshCurrentUser)
    }
  }, [loadCurrentUser, router.events])

  useEffect(() => {
    if (!isAccountMenuOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        !desktopAccountMenuRef.current?.contains(event.target) &&
        !mobileAccountMenuRef.current?.contains(event.target)
      ) {
        setIsAccountMenuOpen(false)
      }
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAccountMenuOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isAccountMenuOpen])

  async function logout() {
    setIsLoggingOut(true)
    setAuthError('')
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}`)
      }

      setCurrentUser(null)
      setIsAccountMenuOpen(false)
      setIsMobileMenuOpen(false)
      window.dispatchEvent(new Event('scuderia:auth-changed'))
    } catch (error) {
      console.error('Unable to sign out', error)
      setAuthError('Logout non riuscito. Riprova.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword }),
      })
      const result = (await response.json()) as AuthResponse
      if (!response.ok || !result.user) {
        setLoginError(result.error ?? 'Accesso non riuscito.')
        return
      }

      setCurrentUser(result.user)
      setLoginIdentifier('')
      setLoginPassword('')
      setIsAccountMenuOpen(false)
      window.dispatchEvent(new Event('scuderia:auth-changed'))
      if (result.mustChangePassword) {
        await router.push('/change-password')
      } else if (result.user.role !== 'admin') {
        await router.push('/')
      }
    } catch {
      setLoginError('Servizio non disponibile. Riprova tra poco.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  useEffect(() => {
    if (!currentUser) {
      setSensorFeed(null)
      setIsSensorDataFresh(false)
      return
    }

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
  }, [currentUser])

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

  const isHome = router.pathname === '/'

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Dispositivi', href: '/#products' },
    { label: 'Chi Siamo', href: '/#about' },
    { label: 'Struttura', href: '/structure' },
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
            <div className="flex items-center space-x-6">
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

          <div className="ml-auto flex shrink-0 items-center gap-4 md:ml-4">
            <button
              className="md:hidden cursor-pointer text-white"
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
            {!isAuthLoading && (
              currentUser ? (
                <div ref={desktopAccountMenuRef} className="relative hidden sm:block">
                  <button
                    aria-controls="desktop-account-menu"
                    aria-expanded={isAccountMenuOpen}
                    className="inline-flex max-w-52 cursor-pointer items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-accent hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => setIsAccountMenuOpen((open) => !open)}
                    type="button"
                  >
                    <span className="truncate">{currentUser.name}</span>
                    <svg
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {authError && (
                    <span className="ml-2 max-w-40 text-xs text-orange-200" role="alert">
                      {authError}
                    </span>
                  )}
                  {isAccountMenuOpen && (
                    <div
                      className="absolute right-0 top-full z-[60] mt-2 w-56 overflow-hidden rounded-xl border border-white/15 bg-primary py-2 shadow-xl"
                      id="desktop-account-menu"
                      role="menu"
                    >
                      <p className="truncate px-4 py-2 text-xs text-white/60" title={currentUser.email}>
                        {currentUser.email}
                      </p>
                      <div className="my-1 border-t border-white/10" />
                      <Link className="block px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/profile" role="menuitem">
                        Modifica profilo
                      </Link>
                      <Link className="block px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/projects" role="menuitem">
                        Articoli e progetti
                      </Link>
                      <Link className="block px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/projects/new" role="menuitem">
                        Aggiungi un articolo
                      </Link>
                      {currentUser.role === 'admin' && (
                        <Link className="block px-4 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/admin/users" role="menuitem">
                          Gestione utenti
                        </Link>
                      )}
                      <div className="my-1 border-t border-white/10" />
                      <button
                        className="block w-full cursor-pointer px-4 py-2 text-left text-sm text-white transition hover:bg-white/10 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isLoggingOut}
                        onClick={() => void logout()}
                        role="menuitem"
                        type="button"
                      >
                        {isLoggingOut ? 'Uscita...' : 'Esci'}
                      </button>
                    </div>
                  )}
                </div>
              ) : authError ? (
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="max-w-40 text-xs text-orange-200" role="alert">
                    {authError}
                  </span>
                  <button
                    className="cursor-pointer rounded-full border border-white/30 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    onClick={() => void loadCurrentUser()}
                    type="button"
                  >
                    Riprova
                  </button>
                </div>
              ) : (
                <div ref={desktopAccountMenuRef} className="relative hidden sm:block">
                  <button
                    aria-expanded={isAccountMenuOpen}
                    className="cursor-pointer rounded-full border border-white/30 px-3 py-2 text-sm font-medium text-white transition hover:border-accent hover:bg-white/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => {
                      setLoginError('')
                      setIsAccountMenuOpen((open) => !open)
                    }}
                    type="button"
                  >
                    Accedi
                  </button>
                  {isAccountMenuOpen && (
                    <form
                      className="absolute right-0 top-full z-[60] mt-2 w-72 space-y-3 rounded-xl border border-white/15 bg-primary p-4 shadow-xl"
                      onSubmit={login}
                    >
                      <p className="text-sm font-semibold text-white">Accedi al tuo account</p>
                      <input
                        aria-label="Email o nome utente"
                        autoComplete="username"
                        className="w-full rounded-lg border border-white/20 bg-primary-variant px-3 py-2 text-sm text-white outline-none focus:border-secondary"
                        maxLength={254}
                        onChange={(event) => setLoginIdentifier(event.target.value)}
                        placeholder="Email o nome utente"
                        required
                        type="text"
                        value={loginIdentifier}
                      />
                      <input
                        aria-label="Password"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-white/20 bg-primary-variant px-3 py-2 text-sm text-white outline-none focus:border-secondary"
                        maxLength={128}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        placeholder="Password"
                        required
                        type="password"
                        value={loginPassword}
                      />
                      {loginError && <p className="text-xs text-red-200" role="alert">{loginError}</p>}
                      <button
                        className="w-full cursor-pointer rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white transition hover:bg-caramel disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isLoggingIn}
                        type="submit"
                      >
                        {isLoggingIn ? 'Accesso...' : 'Accedi'}
                      </button>
                    </form>
                  )}
                </div>
              )
            )}
            <motion.button
              type="button"
              role="switch"
              aria-checked={theme === 'dark'}
              className="relative h-7 w-12 shrink-0 cursor-pointer rounded-full border border-white/25 p-0.5 text-white outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Passa alla modalità chiara' : 'Passa alla modalità scura'}
              title={theme === 'dark' ? 'Modalità chiara' : 'Modalità scura'}
              animate={{ backgroundColor: theme === 'dark' ? '#0c4a6e' : '#f4792b' }}
              transition={{ duration: 0.25 }}
            >
              <span
                className={`absolute top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'left-[6px]' : 'right-[6px]'}`}
                aria-hidden="true"
              >
                {theme === 'dark' ? (
                  <svg className="h-3 w-3 text-accent" viewBox="0 0 24 24" fill="currentColor">
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
                className={`absolute left-0.5 top-1/2 h-5 w-5 rounded-full shadow-sm ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}
                animate={{ x: theme === 'dark' ? 22 : 0, y: '-50%' }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                aria-hidden="true"
              />
            </motion.button>
            {currentUser && (
              <div
                tabIndex={0}
                aria-describedby="sensor-tooltip"
                aria-label={`Temperatura ${formatSensorValue(sensorFeed?.field1, ' gradi Celsius')}, umidità ${formatSensorValue(sensorFeed?.field2, ' percento')}`}
                className="group relative flex h-10 w-10 shrink-0 cursor-default flex-col items-center justify-center rounded-full border border-white/30 bg-white/10 text-[10px] font-semibold leading-3 text-white outline-none transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-accent"
              >
                <span>{formatSensorValue(sensorFeed?.field1, '°')}</span>
                <span>{formatSensorValue(sensorFeed?.field2, '%')}</span>
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
            )}
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
            {!isAuthLoading && (
              currentUser ? (
                <div ref={mobileAccountMenuRef} className="border-t border-white/20 pt-3">
                  <button
                    aria-controls="mobile-account-menu"
                    aria-expanded={isAccountMenuOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-2 py-2 font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    onClick={() => setIsAccountMenuOpen((open) => !open)}
                    type="button"
                  >
                    <span className="truncate">{currentUser.name}</span>
                    <svg
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {authError && (
                    <p className="py-1 text-sm text-orange-200" role="alert">
                      {authError}
                    </p>
                  )}
                  {isAccountMenuOpen && (
                    <div className="mt-2 rounded-xl border border-white/15 bg-primary-variant p-2" id="mobile-account-menu" role="menu">
                      <p className="truncate px-3 py-2 text-xs text-white/60">{currentUser.email}</p>
                      <Link className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/profile" onClick={() => setIsMobileMenuOpen(false)} role="menuitem">
                        Modifica profilo
                      </Link>
                      <Link className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/projects" onClick={() => setIsMobileMenuOpen(false)} role="menuitem">
                        Articoli e progetti
                      </Link>
                      <Link className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/projects/new" onClick={() => setIsMobileMenuOpen(false)} role="menuitem">
                        Aggiungi un articolo
                      </Link>
                      {currentUser.role === 'admin' && (
                        <Link className="block rounded-lg px-3 py-2 text-sm text-white hover:bg-white/10 hover:text-accent" href="/admin/users" onClick={() => setIsMobileMenuOpen(false)} role="menuitem">
                          Gestione utenti
                        </Link>
                      )}
                      <div className="my-1 border-t border-white/10" />
                      <button
                        className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-white hover:bg-white/10 hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={isLoggingOut}
                        onClick={() => void logout()}
                        role="menuitem"
                        type="button"
                      >
                        {isLoggingOut ? 'Uscita...' : 'Esci'}
                      </button>
                    </div>
                  )}
                </div>
              ) : authError ? (
                <button
                  className="block cursor-pointer py-2 text-white transition-colors duration-300 hover:text-accent"
                  onClick={() => void loadCurrentUser()}
                  type="button"
                >
                  {authError} Riprova
                </button>
              ) : (
                <div ref={mobileAccountMenuRef}>
                  <button
                    aria-expanded={isAccountMenuOpen}
                    className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-secondary px-4 py-3 font-bold text-white shadow-lg shadow-black/20 transition hover:bg-caramel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    onClick={() => {
                      setLoginError('')
                      setIsAccountMenuOpen((open) => !open)
                    }}
                    type="button"
                  >
                    <span className="flex items-center gap-3">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="4" y="10" width="16" height="11" rx="2" />
                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                      Area riservata
                    </span>
                    <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                    </svg>
                  </button>
                  {isAccountMenuOpen && (
                    <form className="mt-2 space-y-3 rounded-xl border border-white/15 bg-primary-variant p-4" onSubmit={login}>
                      <p className="text-sm font-semibold text-white">Accedi al tuo account</p>
                      <input
                        aria-label="Email o nome utente"
                        autoComplete="username"
                        className="w-full rounded-lg border border-white/20 bg-primary px-3 py-2 text-sm text-white outline-none focus:border-secondary"
                        maxLength={254}
                        onChange={(event) => setLoginIdentifier(event.target.value)}
                        placeholder="Email o nome utente"
                        required
                        type="text"
                        value={loginIdentifier}
                      />
                      <input
                        aria-label="Password"
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-white/20 bg-primary px-3 py-2 text-sm text-white outline-none focus:border-secondary"
                        maxLength={128}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        placeholder="Password"
                        required
                        type="password"
                        value={loginPassword}
                      />
                      {loginError && <p className="text-xs text-red-200" role="alert">{loginError}</p>}
                      <button className="w-full cursor-pointer rounded-lg bg-secondary px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoggingIn} type="submit">
                        {isLoggingIn ? 'Accesso...' : 'Accedi'}
                      </button>
                    </form>
                  )}
                </div>
              )
            )}
          </motion.div>
        )}
      </nav>
    </motion.header>
  )
}

import React, { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    useEffect(() => {
        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }

        // Scroll to top on page load/reload
        window.scrollTo(0, 0)

        // Clear hash from URL on reload to ensure we start from home
        if (window.location.hash) {
            // Use replaceState to remove hash without triggering scroll
            window.history.replaceState(null, '', window.location.pathname)
        }
    }, [])

    // Also scroll to top when route changes
    useEffect(() => {
        const handleRouteChange = () => {
            window.scrollTo(0, 0)
        }

        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    return <Component {...pageProps} />
}


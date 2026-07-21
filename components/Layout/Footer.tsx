import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const router = useRouter()
  const isHome = router.pathname === '/'
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Dispositivi', href: '/#products' },
    { label: 'Chi Siamo', href: '/#about' },
    { label: 'Progetti', href: isHome ? '#gallery' : '/projects' },
    { label: 'Team', href: isHome ? '#team' : '/team' },
    { label: 'Eventi', href: '/#racing' },
    { label: 'Contatti', href: '/#contact' }
  ]

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/scuderia_diiem/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/scuderia-diiem-roma-tre',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      href: 'https://github.com/Scuderia-DIIEM',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  return (
    <footer className="bg-deep-space text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_max-content] mb-8">
          {/* Logo and Description */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/imgs/MantaSDR3_bianco.png"
                  alt="Scuderia DIIEM Logo"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <span className="text-xl font-bold font-display">Scuderia DIIEM</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <a
                  href="https://uniroma3.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="/imgs/RomaTre_marchio_bianco.png"
                    alt="Roma Tre Logo"
                    width={120}
                    height={40}
                    className="object-contain"
                  />
                </a>
                <a href="https://ingegneriaindustrialeelettronicameccanica.uniroma3.it/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <p className="text-sm text-gray-300">
                    Dipartimento di Ingegneria<br />
                    Industriale, Elettronica e Meccanica
                  </p>
                </a>  
              </div>
              <a
              href="https://www.google.com/maps/search/?api=1&query=Via%20Vito%20Volterra%2C%2062%2C%2000146%20Roma%20RM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 transition-colors hover:text-accent"
            >
              Via Vito Volterra, 62, 00146 Roma RM
            </a>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">Seguici su:</span>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 py-5 hover:text-accent transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

                  {/* Navigation and Contacts */}
        <div className="space-y-8">
          {/* Navigation */}
          <div>
            <motion.h3
              className="font-bold text-xl mb-4 text-accent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Navigazione
            </motion.h3>

            <motion.ul
              className="flex flex-wrap gap-x-8 gap-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Contact Info */}
          <div>
            <motion.h3
              className="font-bold text-xl mb-4 text-accent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              Contatti
            </motion.h3>

            <motion.div
              className="flex flex-wrap gap-x-8 gap-y-3 text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <a
                href="mailto:scuderia.diiem@uniroma3.it"
                className="hover:text-accent transition-colors"
              >
                scuderia.diiem@uniroma3.it
              </a>

              <a
                href="mailto:nicolapio.belfiore@uniroma3.it"
                className="hover:text-accent transition-colors"
              >
                nicolapio.belfiore@uniroma3.it
              </a>
            </motion.div>
          </div>
        </div>
        </div>
        <p className="text-sm text-center transition-colors mt-8 my-4">
          Developed with 🤍 by Jacopo Evangelisti
        </p>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>© {currentYear} Scuderia DIIEM. Tutti i diritti riservati. C.F./P.I. n. 04400441004</p>
          <p className="mt-2">
            <a href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</a>
            {' | '}
            <a href="/terms-of-use" className="hover:text-accent transition-colors">Termini di Utilizzo</a>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}


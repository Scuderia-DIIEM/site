import { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Link from 'next/link'
import { ProjectArticle } from '@/types'
import { loadAllProjectArticles } from '@/lib/project-articles'
import { motion } from 'framer-motion'

interface ProjectsPageProps {
  projects: ProjectArticle[]
}

export default function ProjectsPage({ projects }: ProjectsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const projectList = projects

  const filteredProjects = projectList.filter((project) => {
    const search = searchTerm.trim().toLowerCase()
    if (!search) return true
    const authorsText = project.authors?.join(' ').toLowerCase() ?? ''
    return (
      project.title.toLowerCase().includes(search) ||
      project.excerpt.toLowerCase().includes(search) ||
      authorsText.includes(search) ||
      project.date.toLowerCase().includes(search)
    )
  })

  const getHeroImageSrc = (heroImage?: string | { src: string }) =>
    typeof heroImage === 'string' ? heroImage : heroImage?.src

  return (
    <>
      <Head>
        <title>Progetti - Scuderia DIIEM</title>
        <meta name="description" content="Raccolta dei progetti di Scuderia DIIEM." />
      </Head>

      <div className="min-h-screen">
        <Header />

        <main>
          <section className="bg-primary pt-28 pb-10 sm:pb-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl font-display">
                  Progetti
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-100">
                  Raccolta di articoli - Clicca un elemento per aprire il dettaglio.
                </p>
              </motion.div>

              <motion.div
                className="mt-8 flex items-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Cerca progetti</span>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Cerca"
                    className="w-full rounded-2xl border border-white/30 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-accent focus:ring-2 focus:ring-accent/30"
                  />
                </label>

                <div className="shrink-0 inline-flex rounded-full bg-white/15 p-1 shadow-inner backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                      viewMode === 'grid'
                        ? 'bg-accent !text-white shadow-sm'
                        : '!text-white/90 hover:!text-white'
                    }`}
                  >
                    Pannelli
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`rounded-full px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                      viewMode === 'list'
                        ? 'bg-accent !text-white shadow-sm'
                        : '!text-white/90 hover:!text-white'
                    }`}
                  >
                    Lista
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="bg-gradient-to-b from-white to-gray-50 px-5 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl">
              {filteredProjects.length === 0 ? (
                <p className="text-gray-500">Nessun progetto corrisponde alla ricerca.</p>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((p, index) => {
                    const heroSrc = getHeroImageSrc(p.heroImage)
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.04 }}
                        whileHover={{ y: -4 }}
                        className="h-full"
                      >
                        <Link
                          href={`/projects/${p.slug}`}
                          className="block h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg"
                        >
                          {heroSrc && (
                            <div className="relative h-44 overflow-hidden">
                              <img
                                src={heroSrc}
                                alt={typeof p.heroImage === 'string' ? p.title : p.heroImage?.alt ?? p.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h2 className="mb-2 text-xl font-semibold text-accent">{p.title}</h2>
                            {p.authors && p.authors.length > 0 && (
                              <p className="mb-2 text-sm text-gray-500">
                                {p.authors.length > 1 ? 'Autori' : 'Autore'}: {p.authors.join(', ')}
                              </p>
                            )}
                            <p className="mb-4 text-sm text-gray-600">{p.excerpt}</p>
                            <p className="text-xs text-gray-400">{p.date}</p>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.map((p, index) => {
                    const heroSrc = getHeroImageSrc(p.heroImage)
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.04 }}
                        whileHover={{ y: -3 }}
                      >
                        <Link
                          href={`/projects/${p.slug}`}
                          className="block rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex items-center gap-3 p-3">
                            {heroSrc && (
                              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-24">
                                <img
                                  src={heroSrc}
                                  alt={typeof p.heroImage === 'string' ? p.title : p.heroImage?.alt ?? p.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="truncate text-lg font-semibold text-accent">{p.title}</h2>
                                <p className="text-xs text-gray-400">{p.date}</p>
                              </div>
                              {p.authors && p.authors.length > 0 && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {p.authors.length > 1 ? 'Autori' : 'Autore'}: {p.authors.join(', ')}
                                </p>
                              )}
                              <p className="mt-2 max-h-10 overflow-hidden text-ellipsis text-sm text-gray-600">{p.excerpt}</p>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const projects = await loadAllProjectArticles()
  return {
    props: {
      projects,
    },
  }
}

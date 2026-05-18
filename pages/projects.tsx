import { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Link from 'next/link'
import projects from '@/data/projects.json'
import { ProjectArticle } from '@/types'

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const projectList = projects as ProjectArticle[]

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

        <main className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-primary mb-6 font-display">Progetti</h1>
            <p className="text-gray-600 mb-4">Raccolta di articoli e progetti. Clicca un elemento per aprire il dettaglio.</p>

            <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <label className="block">
                <span className="sr-only">Cerca progetti</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cerca per titolo, autore o data"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <div className="inline-flex rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pannelli
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    viewMode === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lista
                </button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <p className="text-gray-500">Nessun progetto corrisponde alla ricerca.</p>
            ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((p) => {
                      const heroSrc = getHeroImageSrc(p.heroImage)
                      return (
                        <Link
                          key={p.id}
                          href={`/projects/${p.slug}`}
                          className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden h-full"
                        >
                          {heroSrc && (
                            <div className="relative h-44 overflow-hidden">
                              <img
                                src={heroSrc}
                                alt={typeof p.heroImage === 'string' ? p.title : p.heroImage?.alt ?? p.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{p.title}</h2>
                            {p.authors && p.authors.length > 0 && (
                              <p className="text-sm text-gray-500 mb-2">{p.authors.length > 1 ? 'Autori' : 'Autore'}: {p.authors.join(', ')}</p>
                            )}
                            <p className="text-sm text-gray-600 mb-4">{p.excerpt}</p>
                            <p className="text-xs text-gray-400">{p.date}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredProjects.map((p) => {
                      const heroSrc = getHeroImageSrc(p.heroImage)
                      return (
                        <Link
                          key={p.id}
                          href={`/projects/${p.slug}`}
                          className="block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="p-3 sm:flex sm:items-center sm:gap-4">
                            {heroSrc && (
                              <div className="mb-3 sm:mb-0 sm:w-24 sm:h-16 overflow-hidden rounded-xl bg-slate-100">
                                <img
                                  src={heroSrc}
                                  alt={typeof p.heroImage === 'string' ? p.title : p.heroImage?.alt ?? p.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h2 className="text-lg font-semibold text-gray-900 truncate">{p.title}</h2>
                                <p className="text-xs text-gray-400">{p.date}</p>
                              </div>
                              {p.authors && p.authors.length > 0 && (
                                <p className="text-sm text-gray-500 mt-1">{p.authors.length > 1 ? 'Autori' : 'Autore'}: {p.authors.join(', ')}</p>
                              )}
                              <p className="text-sm text-gray-600 mt-2 max-h-10 overflow-hidden text-ellipsis">{p.excerpt}</p>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

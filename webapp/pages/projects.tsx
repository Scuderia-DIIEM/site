import { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Link from 'next/link'
import { ProjectArticle } from '@/types'
import { loadAllProjectArticles } from '@/lib/project-articles'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/language'

interface ProjectsPageProps {
  projects: ProjectArticle[]
}

interface UploadedArticle extends ProjectArticle {
  pdfUrl: string
  isPublic: boolean
}

function formatDisplayDate(date: string): string {
  const [year, month, day] = date.slice(0, 10).split('-')
  return year && month && day ? `${day}/${month}/${year}` : date
}

export default function ProjectsPage({ projects }: ProjectsPageProps) {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [uploadedArticles, setUploadedArticles] = useState<UploadedArticle[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all')

  useEffect(() => {
    let active = true
    let latestLoad = 0
    const loadArticles = async () => {
      const loadId = ++latestLoad
      const [articles, session] = await Promise.all([
        fetch('/api/projects', { cache: 'no-store' }).then(async (response) => {
          if (!response.ok) throw new Error('Non è stato possibile caricare gli articoli caricati.')
          const result = (await response.json()) as {
            articles: Array<{
              id: string
              slug: string
              title: string
              excerpt: string
              authors: string[]
              coverImage: string
              pdfUrl: string
              isPublic: boolean
              date: string
              tags?: string[]
            }>
          }
          return result.articles
        }),
        fetch('/api/auth/me', { cache: 'no-store' }).then(async (response) => {
          if (!response.ok) return null
          return (await response.json()) as { user: { id: string }; mustChangePassword: boolean }
        }),
      ])

      if (!active || loadId !== latestLoad) return
      setLoadError('')
      setUploadedArticles(
        articles.map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          authors: article.authors,
          date: article.date,
          heroImage: article.coverImage,
          pdfUrl: article.pdfUrl,
          isPublic: article.isPublic,
          tags: article.tags ?? [],
          blocks: [],
        }))
      )
      setIsAuthenticated(Boolean(session))
      setMustChangePassword(Boolean(session?.mustChangePassword))
    }

    const refreshArticlesAfterAuthChange = () => {
      void loadArticles().catch((error: unknown) => {
        if (active) {
          setLoadError(error instanceof Error ? error.message : 'Errore durante il caricamento degli articoli.')
        }
      })
    }

    void loadArticles().catch((error: unknown) => {
      if (active) {
        setLoadError(error instanceof Error ? error.message : 'Errore durante il caricamento degli articoli.')
      }
    })
    window.addEventListener('scuderia:auth-changed', refreshArticlesAfterAuthChange)

    return () => {
      active = false
      window.removeEventListener('scuderia:auth-changed', refreshArticlesAfterAuthChange)
    }
  }, [])

  const projectList = [...uploadedArticles, ...projects]

  const availableTags = [...new Set(projectList.flatMap((project) => project.tags ?? []))].sort()
  const filteredProjects = projectList.filter((project) => {
    const search = searchTerm.trim().toLowerCase()
    const authorsText = project.authors?.join(' ').toLowerCase() ?? ''
    const matchesSearch = !search || (
      project.title.toLowerCase().includes(search) ||
      project.excerpt.toLowerCase().includes(search) ||
      authorsText.includes(search) ||
      project.date.toLowerCase().includes(search)
    )
    const projectTags = project.tags ?? []
    const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => projectTags.includes(tag))
    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'public' && (project.isPublic ?? true)) ||
      (visibilityFilter === 'private' && project.isPublic === false)
    return matchesSearch && matchesTags && matchesVisibility
  }).sort((a, b) => {
    const comparison = a.date.localeCompare(b.date)
    return sortOrder === 'asc' ? comparison : -comparison
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
                  {t('Raccolta di articoli - Clicca un elemento per aprire il dettaglio.')}
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
                  <span className="sr-only">{t('Cerca')}</span>
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={t('Cerca')}
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
                    {t('Pannelli')}
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
                    {t('Lista')}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  className={`shrink-0 rounded-full px-4 py-3 text-sm font-semibold transition ${
                    filtersOpen ? 'bg-accent text-white' : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  {t('Filtri')}
                </button>
              </motion.div>
              {filtersOpen && (
                <div className="mt-4 rounded-2xl bg-white p-4 text-slate-900 shadow-lg">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="text-sm font-semibold">
                      {t('Ordine')}
                      <select
                        className="ml-2 rounded-lg border border-slate-300 px-3 py-2 font-normal"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value as 'asc' | 'desc')}
                      >
                        <option value="desc">{t('Dal più recente')}</option>
                        <option value="asc">{t('Dal meno recente')}</option>
                      </select>
                    </label>
                    <label className="text-sm font-semibold">
                      {t('Visibilità')}
                      <select
                        className="ml-2 rounded-lg border border-slate-300 px-3 py-2 font-normal"
                        value={visibilityFilter}
                        onChange={(event) =>
                          setVisibilityFilter(event.target.value as 'all' | 'public' | 'private')
                        }
                      >
                        <option value="all">{t('Tutti')}</option>
                        <option value="public">{t('Pubblici')}</option>
                        <option value="private">{t('Privati')}</option>
                      </select>
                    </label>
                    {selectedTags.length > 0 && (
                      <button
                        type="button"
                        className="text-sm font-semibold text-accent underline"
                        onClick={() => setSelectedTags([])}
                      >
                        {t('Azzera tag')}
                      </button>
                    )}
                  </div>
                  {availableTags.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {availableTags.map((tag) => (
                        <label key={tag} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm">
                          <input
                            checked={selectedTags.includes(tag)}
                            onChange={(event) =>
                              setSelectedTags((current) =>
                                event.target.checked ? [...current, tag] : current.filter((item) => item !== tag)
                              )
                            }
                            type="checkbox"
                          />
                          #{tag}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-500">{t('Non ci sono ancora tag disponibili.')}</p>
                  )}
                </div>
              )}
              {isAuthenticated && !mustChangePassword && (
                <div className="mt-5 flex justify-center">
                  <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-white shadow transition hover:brightness-110"
                  >
                    <span aria-hidden="true">+</span>
                    Aggiungi un articolo
                  </Link>
                </div>
              )}
              {mustChangePassword && (
                <p className="mt-5 text-center text-sm text-white">
                  Cambia la password temporanea prima di pubblicare un articolo.{' '}
                  <Link className="underline" href="/change-password">
                    Cambia password
                  </Link>
                </p>
              )}
            </div>
          </section>

          <section className="bg-gradient-to-b from-white to-gray-50 px-5 py-8 sm:py-10">
            <div className="mx-auto max-w-7xl">
              {loadError && (
                <p className="mb-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
                  {loadError}
                </p>
              )}
              {filteredProjects.length === 0 ? (
                <p className="text-gray-500">
                  {loadError && projects.length === 0
                    ? 'Gli articoli caricati non sono al momento disponibili.'
                    : 'Nessun progetto corrisponde alla ricerca.'}
                </p>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((p, index) => {
                    const heroSrc = getHeroImageSrc(p.heroImage)
                    const isPublic = p.isPublic ?? true
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
                        <div className="h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-200 hover:shadow-lg">
                          <Link
                            href={p.pdfUrl ? `/projects/article?slug=${encodeURIComponent(p.slug)}` : `/projects/${p.slug}`}
                            className="block"
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
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <h2 className="min-w-0 text-xl font-semibold text-accent">{p.title}</h2>
                                <span
                                  className={`project-visibility-badge shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    isPublic
                                      ? 'is-public bg-emerald-100 text-emerald-800'
                                      : 'is-private bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {isPublic ? t('Pubblico') : t('Privato')}
                                </span>
                              </div>
                              {p.authors && p.authors.length > 0 && (
                                <p className="mb-2 text-sm text-gray-500">
                                  {p.authors.length > 1 ? 'Autori' : 'Autore'}: {p.authors.join(', ')}
                                </p>
                              )}
                              <p className="mb-4 line-clamp-3 text-sm text-gray-600">{p.excerpt}</p>
                              {p.tags && p.tags.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-1.5">
                                  {p.tags.map((tag) => <span key={tag} className="rounded-full bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent">#{tag}</span>)}
                                </div>
                              )}
                              <p className="text-xs text-gray-400">{formatDisplayDate(p.date)}</p>
                            </div>
                          </Link>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProjects.map((p, index) => {
                    const heroSrc = getHeroImageSrc(p.heroImage)
                    const isPublic = p.isPublic ?? true
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.04 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
                          <Link
                            href={p.pdfUrl ? `/projects/article?slug=${encodeURIComponent(p.slug)}` : `/projects/${p.slug}`}
                            className="block"
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
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <h2 className="truncate text-lg font-semibold text-accent">{p.title}</h2>
                                    <span
                                      className={`project-visibility-badge shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                        isPublic
                                          ? 'is-public bg-emerald-100 text-emerald-800'
                                          : 'is-private bg-amber-100 text-amber-900'
                                      }`}
                                    >
                                      {isPublic ? t('Pubblico') : t('Privato')}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400">{formatDisplayDate(p.date)}</p>
                                </div>
                                {p.authors && p.authors.length > 0 && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {p.authors.length > 1 ? 'Autori' : 'Autore'}: {p.authors.join(', ')}
                                  </p>
                                )}
                                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{p.excerpt}</p>
                                {p.tags && p.tags.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {p.tags.map((tag) => <span key={tag} className="rounded-full bg-accent/10 px-2 py-1 text-[11px] font-semibold text-accent">#{tag}</span>)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </div>
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

import { type FormEvent, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'

interface ProjectArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  authors: string[]
  coverImage: string
  pdfUrl: string
  isPublic: boolean
  date: string
  canEdit?: boolean
}

type ArticleState =
  | { status: 'loading' }
  | { status: 'loaded'; article: ProjectArticle }
  | { status: 'not-found' }
  | { status: 'error'; message: string }

export default function UploadedProjectArticlePage() {
  const router = useRouter()
  const slug = typeof router.query.slug === 'string' ? router.query.slug : ''
  const [state, setState] = useState<ArticleState>({ status: 'loading' })
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [authors, setAuthors] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [cover, setCover] = useState<File | null>(null)
  const [pdf, setPdf] = useState<File | null>(null)
  const [editError, setEditError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!router.isReady || !slug) return
    const controller = new AbortController()
    setState({ status: 'loading' })

    void fetch(`/api/projects/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) {
          setState({ status: 'not-found' })
          return
        }
        const result = (await response.json()) as {
          article?: ProjectArticle
          canEdit?: boolean
          error?: string
        }
        if (!response.ok || !result.article) {
          setState({ status: 'error', message: result.error ?? 'Non è stato possibile caricare l’articolo.' })
          return
        }
        setState({
          status: 'loaded',
          article: { ...result.article, canEdit: Boolean(result.canEdit) },
        })
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        setState({ status: 'error', message: 'Servizio non disponibile. Riprova tra poco.' })
      })

    return () => controller.abort()
  }, [router.isReady, slug])

  const article = state.status === 'loaded' ? state.article : null

  function startEditing() {
    if (!article) return
    setTitle(article.title)
    setExcerpt(article.excerpt)
    setAuthors(article.authors.join('\n'))
    setVisibility(article.isPublic ? 'public' : 'private')
    setCover(null)
    setPdf(null)
    setEditError('')
    setIsEditing(true)
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!article) return

    const authorList = authors
      .split(/\n|,/)
      .map((author) => author.trim())
      .filter(Boolean)
    if (authorList.length === 0) {
      setEditError('Inserisci almeno un autore.')
      return
    }

    const formData = new FormData()
    formData.set('title', title)
    formData.set('excerpt', excerpt)
    formData.set('authors', JSON.stringify(authorList))
    formData.set('visibility', visibility)
    if (cover) formData.set('cover', cover)
    if (pdf) formData.set('pdf', pdf)

    setEditError('')
    setIsSaving(true)
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(article.slug)}`, {
        method: 'PUT',
        body: formData,
      })
      const result = (await response.json()) as {
        article?: ProjectArticle
        canEdit?: boolean
        error?: string
      }
      if (!response.ok || !result.article) {
        setEditError(result.error ?? 'Non è stato possibile salvare le modifiche.')
        return
      }

      setState({
        status: 'loaded',
        article: { ...result.article, canEdit: Boolean(result.canEdit) },
      })
      setCover(null)
      setPdf(null)
      setIsEditing(false)
    } catch {
      setEditError('Servizio non disponibile. Riprova tra poco.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Head>
        <title>{article ? `${article.title} - Scuderia DIIEM` : 'Articolo - Scuderia DIIEM'}</title>
        <meta
          name="description"
          content={article?.excerpt ?? 'Articolo della raccolta progetti Scuderia DIIEM.'}
        />
      </Head>
      <div className="min-h-screen">
        <Header />
        <main className="bg-gradient-to-b from-white to-slate-50 px-4 pb-16 pt-32 sm:px-6">
          <article className="mx-auto max-w-4xl">
            <Link href="/projects" className="text-sm font-medium text-accent hover:underline">
              &larr; Torna ai progetti
            </Link>

            {state.status === 'loading' && (
              <p className="mt-8 rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
                Caricamento articolo…
              </p>
            )}

            {state.status === 'not-found' && (
              <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">Articolo non disponibile</h1>
                <p className="mt-3 text-slate-600">
                  L’articolo non esiste oppure è privato. Per leggere gli articoli privati devi accedere con il tuo account.
                </p>
                <Link
                  className="mt-5 inline-flex rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:brightness-110"
                  href={`/login?next=${encodeURIComponent(`/projects/article?slug=${slug}`)}`}
                >
                  Accedi
                </Link>
              </section>
            )}

            {state.status === 'error' && (
              <p className="mt-8 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                {state.message}
              </p>
            )}

            {article && (
              <form onSubmit={saveArticle}>
                <header className="mt-6">
                  <p className="text-sm text-slate-500">{article.date}</p>
                  <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                    {isEditing ? (
                      <div className="min-w-0 flex-1">
                        <label className="sr-only" htmlFor="edit-article-title">Titolo</label>
                        <input
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-2xl font-bold text-accent outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 sm:text-3xl"
                          id="edit-article-title"
                          maxLength={160}
                          minLength={3}
                          onChange={(event) => setTitle(event.target.value)}
                          required
                          value={title}
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl font-bold text-accent sm:text-4xl">{article.title}</h1>
                    )}
                    <span
                      className={`project-visibility-badge rounded-full px-3 py-1 text-xs font-semibold ${
                        article.isPublic
                          ? 'is-public bg-emerald-100 text-emerald-800'
                          : 'is-private bg-amber-100 text-amber-900'
                      }`}
                    >
                      {article.isPublic ? 'Pubblico' : 'Privato'}
                    </span>
                    {article.canEdit && !isEditing && (
                      <button
                        className="rounded-lg border border-accent/40 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/10"
                        onClick={startEditing}
                        type="button"
                      >
                        Modifica articolo
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="edit-article-authors">
                          Autori
                        </label>
                        <textarea
                          className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                          id="edit-article-authors"
                          maxLength={2000}
                          onChange={(event) => setAuthors(event.target.value)}
                          required
                          value={authors}
                        />
                        <p className="mt-1 text-xs text-slate-500">Inserisci un autore per riga o separali con una virgola.</p>
                      </div>
                      <fieldset>
                        <legend className="text-sm font-semibold text-slate-800">Visibilità</legend>
                        <div className="mt-2 flex flex-wrap gap-4">
                          <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              checked={visibility === 'public'}
                              name="article-visibility"
                              onChange={() => setVisibility('public')}
                              type="radio"
                            />
                            Pubblico
                          </label>
                          <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input
                              checked={visibility === 'private'}
                              name="article-visibility"
                              onChange={() => setVisibility('private')}
                              type="radio"
                            />
                            Privato
                          </label>
                        </div>
                      </fieldset>
                    </div>
                  ) : article.authors.length > 0 && (
                    <p className="mt-3 text-sm text-slate-500">
                      {article.authors.length > 1 ? 'Autori' : 'Autore'}: {article.authors.join(', ')}
                    </p>
                  )}
                </header>

                {isEditing && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      className="rounded-lg bg-accent px-4 py-2 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={isSaving}
                      type="submit"
                    >
                      {isSaving ? 'Salvataggio…' : 'Salva modifiche'}
                    </button>
                    <button
                      className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                      disabled={isSaving}
                      onClick={() => setIsEditing(false)}
                      type="button"
                    >
                      Annulla
                    </button>
                  </div>
                )}
                {editError && (
                  <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                    {editError}
                  </p>
                )}

                <div className="mt-7 grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-8">
                  <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mx-0">
                    <img
                      alt={`Copertina: ${article.title}`}
                      className="max-h-80 w-full object-contain"
                      src={article.coverImage}
                    />
                    {isEditing && (
                      <div className="p-3">
                        <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="replace-article-cover">
                          Sostituisci copertina
                        </label>
                        <input
                          accept="image/jpeg,image/png,image/webp"
                          className="block w-full text-xs text-slate-700"
                          id="replace-article-cover"
                          onChange={(event) => setCover(event.target.files?.[0] ?? null)}
                          type="file"
                        />
                        <p className="mt-1 text-xs text-slate-500">Facoltativo; JPEG, PNG o WebP, massimo 5 MB.</p>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="edit-article-excerpt">
                        Descrizione
                      </label>
                      <textarea
                        className="min-h-48 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                        id="edit-article-excerpt"
                        maxLength={2000}
                        minLength={10}
                        onChange={(event) => setExcerpt(event.target.value)}
                        required
                        value={excerpt}
                      />
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-lg leading-8 text-slate-700">
                      {article.excerpt}
                    </p>
                  )}
                </div>

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">Articolo completo</h2>
                      <p className="mt-2 text-sm text-slate-600">
                        Leggi il PDF direttamente qui oppure aprilo in una nuova scheda.
                      </p>
                    </div>
                    <a
                      className="inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                      href={article.pdfUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Apri in una nuova scheda
                    </a>
                  </div>
                  {isEditing && (
                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="replace-article-pdf">
                        Sostituisci PDF
                      </label>
                      <input
                        accept="application/pdf,.pdf"
                        className="block w-full text-sm text-slate-700"
                        id="replace-article-pdf"
                        onChange={(event) => setPdf(event.target.files?.[0] ?? null)}
                        type="file"
                      />
                      <p className="mt-1 text-xs text-slate-500">Facoltativo; PDF, massimo 20 MB.</p>
                    </div>
                  )}
                  <iframe
                    className="mt-5 h-[70vh] min-h-[32rem] w-full rounded-xl border border-slate-200 bg-slate-100"
                    loading="lazy"
                    src={article.pdfUrl}
                    title={`Articolo completo in PDF: ${article.title}`}
                  />
                  <p className="mt-3 text-sm text-slate-600">
                    Se il PDF non viene visualizzato,{" "}
                    <a
                      className="font-medium text-accent underline hover:brightness-90"
                      href={article.pdfUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      aprilo direttamente
                    </a>.
                  </p>
                </section>
              </form>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </>
  )
}

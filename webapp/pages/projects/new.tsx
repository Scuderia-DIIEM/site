import { FormEvent, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'

interface SessionResponse {
  user: { id: string }
  mustChangePassword: boolean
}

interface ApiError {
  error?: string
}

export default function NewProjectArticlePage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [authors, setAuthors] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [cover, setCover] = useState<File | null>(null)
  const [pdf, setPdf] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    void fetch('/api/auth/me')
      .then(async (response) => {
        if (response.status === 401) {
          await router.replace('/login')
          return
        }
        const session = (await response.json()) as SessionResponse & ApiError
        if (!response.ok) {
          setError(session.error ?? 'Non è stato possibile verificare la sessione.')
          return
        }
        if (session.mustChangePassword) {
          await router.replace('/change-password')
          return
        }
        if (active) setAuthorized(true)
      })
      .catch(() => {
        if (active) setError('Impossibile verificare la sessione. Accedi nuovamente.')
      })
      .finally(() => {
        if (active) setCheckingSession(false)
      })
    return () => {
      active = false
    }
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (!cover || !pdf) {
      setError('Seleziona sia una foto di copertina sia il PDF completo dell’articolo.')
      return
    }
    const authorList = authors
      .split(/\n|,/)
      .map((author) => author.trim())
      .filter(Boolean)
    if (authorList.length === 0) {
      setError('Inserisci almeno un autore.')
      return
    }

    const formData = new FormData()
    formData.set('title', title)
    formData.set('excerpt', excerpt)
    formData.set('authors', JSON.stringify(authorList))
    formData.set('visibility', visibility)
    formData.set('cover', cover)
    formData.set('pdf', pdf)

    setSubmitting(true)
    try {
      const response = await fetch('/api/projects', { method: 'POST', body: formData })
      const result = (await response.json()) as {
        article?: { slug: string }
        error?: string
      }
      if (!response.ok) {
        setError(result.error ?? 'Non è stato possibile pubblicare l’articolo.')
        return
      }
      if (!result.article?.slug) {
        setError('Il server non ha restituito i dati dell’articolo creato.')
        return
      }
      await router.push(`/projects/article?slug=${encodeURIComponent(result.article.slug)}`)
    } catch {
      setError('Servizio non disponibile. Riprova tra poco.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Nuovo articolo | Scuderia DIIEM</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen">
        <Header />
        <main className="bg-slate-50 px-4 pb-16 pt-32 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <Link href="/projects" className="text-sm font-medium text-accent hover:underline">
              &larr; Torna agli articoli
            </Link>
            <header className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                Area riservata
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Aggiungi un articolo
              </h1>
              <p className="mt-3 text-slate-600">
                Carica la copertina e il PDF. Puoi scegliere se renderlo pubblico o riservato agli utenti autenticati.
              </p>
            </header>

            {checkingSession ? (
              <p className="mt-8 rounded-xl bg-white p-5 text-slate-600">Verifica dell’accesso in corso…</p>
            ) : authorized ? (
              <form
                className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="article-title">
                    Titolo / copertina
                  </label>
                  <input
                    autoComplete="off"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    id="article-title"
                    maxLength={160}
                    minLength={3}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Titolo dell’articolo"
                    required
                    value={title}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="article-excerpt">
                    Breve descrizione
                  </label>
                  <textarea
                    className="min-h-32 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    id="article-excerpt"
                    maxLength={2000}
                    minLength={10}
                    onChange={(event) => setExcerpt(event.target.value)}
                    placeholder="Descrivi brevemente l’articolo…"
                    required
                    value={excerpt}
                  />
                  <p className="mt-1 text-right text-xs text-slate-500">{excerpt.length}/2000</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="article-authors">
                    Autori
                  </label>
                  <textarea
                    className="min-h-24 w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                    id="article-authors"
                    maxLength={2000}
                    onChange={(event) => setAuthors(event.target.value)}
                    placeholder={'Inserisci un autore per riga, ad esempio:\nMario Rossi\nGiulia Bianchi'}
                    required
                    value={authors}
                  />
                  <p className="mt-1 text-xs text-slate-500">Inserisci un autore per riga o separali con una virgola.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="article-cover">
                    Foto di copertina
                  </label>
                  <input
                    accept="image/jpeg,image/png,image/webp"
                    className="peer sr-only"
                    id="article-cover"
                    onChange={(event) => setCover(event.target.files?.[0] ?? null)}
                    required
                    type="file"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      className="inline-flex cursor-pointer items-center rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition hover:brightness-110 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2"
                      htmlFor="article-cover"
                    >
                      Scegli copertina
                    </label>
                    <span className="min-w-0 break-all text-sm text-slate-600" aria-live="polite">
                      {cover?.name ?? 'Nessun file selezionato'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">JPEG, PNG o WebP; massimo 5 MB.</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="article-pdf">
                    Articolo completo in PDF
                  </label>
                  <input
                    accept="application/pdf,.pdf"
                    className="peer sr-only"
                    id="article-pdf"
                    onChange={(event) => setPdf(event.target.files?.[0] ?? null)}
                    required
                    type="file"
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      className="inline-flex cursor-pointer items-center rounded-lg bg-accent px-4 py-2.5 font-semibold text-white transition hover:brightness-110 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2"
                      htmlFor="article-pdf"
                    >
                      Scegli PDF
                    </label>
                    <span className="min-w-0 break-all text-sm text-slate-600" aria-live="polite">
                      {pdf?.name ?? 'Nessun file selezionato'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">PDF; massimo 20 MB.</p>
                </div>

                <fieldset>
                  <legend className="text-sm font-semibold text-slate-800">Visibilità dell’articolo</legend>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4">
                      <input
                        checked={visibility === 'public'}
                        name="visibility"
                        onChange={() => setVisibility('public')}
                        type="radio"
                        value="public"
                      />
                      <span>
                        <span className="block font-semibold text-slate-900">Pubblico</span>
                        <span className="mt-1 block text-sm text-slate-600">
                          Visibile e scaricabile da tutti.
                        </span>
                      </span>
                    </label>
                    <label className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4">
                      <input
                        checked={visibility === 'private'}
                        name="visibility"
                        onChange={() => setVisibility('private')}
                        type="radio"
                        value="private"
                      />
                      <span>
                        <span className="block font-semibold text-slate-900">Privato</span>
                        <span className="mt-1 block text-sm text-slate-600">
                          Visibile soltanto agli utenti che hanno effettuato il login.
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                    {error}
                  </p>
                )}

                <button
                  className="w-full rounded-lg bg-accent px-5 py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? 'Caricamento e pubblicazione…' : 'Pubblica articolo'}
                </button>
              </form>
            ) : (
              <p className="mt-8 rounded-xl bg-white p-5 text-slate-700" role="alert">
                {error || 'Accedi con un profilo per poter aggiungere un articolo.'}{' '}
                <Link className="font-semibold text-accent underline" href="/login">
                  Accedi
                </Link>
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

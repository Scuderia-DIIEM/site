import { useEffect, useState } from 'react'
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
          error?: string
        }
        if (!response.ok || !result.article) {
          setState({ status: 'error', message: result.error ?? 'Non è stato possibile caricare l’articolo.' })
          return
        }
        setState({ status: 'loaded', article: result.article })
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === 'AbortError') return
        setState({ status: 'error', message: 'Servizio non disponibile. Riprova tra poco.' })
      })

    return () => controller.abort()
  }, [router.isReady, slug])

  const article = state.status === 'loaded' ? state.article : null

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
              <>
                <header className="mt-6">
                  <p className="text-sm text-slate-500">{article.date}</p>
                  <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-3xl font-bold text-accent sm:text-4xl">{article.title}</h1>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        article.isPublic
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {article.isPublic ? 'Pubblico' : 'Privato'}
                    </span>
                  </div>
                  {article.authors.length > 0 && (
                    <p className="mt-3 text-sm text-slate-500">
                      {article.authors.length > 1 ? 'Autori' : 'Autore'}: {article.authors.join(', ')}
                    </p>
                  )}
                </header>

                <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <img
                    alt={`Copertina: ${article.title}`}
                    className="max-h-[32rem] w-full object-cover"
                    src={article.coverImage}
                  />
                </div>

                <p className="mt-7 whitespace-pre-wrap text-lg leading-8 text-slate-700">
                  {article.excerpt}
                </p>

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-slate-900">Articolo completo</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    L’articolo completo è disponibile in formato PDF.
                  </p>
                  <a
                    className="mt-5 inline-flex rounded-lg bg-accent px-5 py-3 font-semibold text-white transition hover:brightness-110"
                    href={article.pdfUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Apri l’articolo PDF
                  </a>
                </section>
              </>
            )}
          </article>
        </main>
        <Footer />
      </div>
    </>
  )
}

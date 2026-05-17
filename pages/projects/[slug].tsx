import Head from 'next/head'
import Header from '../../components/Layout/Header'
import Footer from '../../components/Layout/Footer'
import { useRouter } from 'next/router'
import projects from '@/data/projects.json'

export default function ProjectDetail() {
  const router = useRouter()
  const { slug } = router.query

  const project = projects.find((p: any) => p.slug === slug)

  if (!project) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-24">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Articolo non trovato</h1>
            <p className="text-gray-600">Il progetto richiesto non esiste o è stato rimosso.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{project.title} - Scuderia DIIEM</title>
      </Head>

      <div className="min-h-screen">
        <Header />

        <main className="py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-primary mb-4">{project.title}</h1>
            <p className="text-sm text-gray-400 mb-6">{project.date}</p>
            <div className="prose max-w-none text-gray-700">
              <p>{project.content}</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

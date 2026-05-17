import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Link from 'next/link'
import projects from '@/data/projects.json'

export default function ProjectsPage() {
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
            <p className="text-gray-600 mb-8">Raccolta di articoli e progetti. Clicca un elemento per aprire il dettaglio.</p>

            {projects.length === 0 ? (
              <p className="text-gray-500">Nessun progetto ancora. Aggiungi voci in <code>data/projects.json</code>.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.slug}`}
                    className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 h-full"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{p.title}</h2>
                    <p className="text-sm text-gray-600 mb-4">{p.excerpt}</p>
                    <p className="text-xs text-gray-400">{p.date}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

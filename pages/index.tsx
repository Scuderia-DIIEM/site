import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Hero from '../components/Sections/Hero'
import Gallery from '../components/Sections/Gallery'
import Products from '../components/Sections/Products'
import Features from '../components/Sections/Features'
import About from '../components/Sections/About'
import Racing from '../components/Sections/Racing'
import Team from '../components/Sections/Team'
import Testimonials from '../components/Sections/Testimonials'
import News from '../components/Sections/News'
import Contact from '../components/Sections/Contact'

export default function Home() {
  return (
    <>
      <Head>
        <title>Scuderia DIIEM - Eccellenza nel Racing</title>
        <meta 
          name="description" 
          content="Scuderia DIIEM: eccellenza nel racing italiano. Scopri i nostri prodotti innovativi, risultati sportivi e tecnologie all'avanguardia per operazioni marine e motorsport." 
        />
        <meta 
          name="keywords" 
          content="Scuderia DIIEM, racing italiano, motorsport, ROV, tecnologia marina, corse, competizioni, innovazione ingegneristica" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="language" content="Italian" />
        <meta httpEquiv="content-language" content="it" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Scuderia DIIEM - Eccellenza nel Racing" />
        <meta property="og:description" content="Eccellenza nel Racing | Spingendo i Limiti | Innovazione Ingegneristica" />
        <meta property="og:locale" content="it_IT" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scuderia DIIEM - Eccellenza nel Racing" />
        <meta name="twitter:description" content="Eccellenza nel Racing | Spingendo i Limiti | Innovazione Ingegneristica" />
        
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen">
        <Header />
        
        <main>
          <Hero />
          <Gallery />
          <Products />
          <Features />
          <About />
          <Team />
          <Racing />
          <Testimonials />
          <News />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  )
}

import React from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const sections = [
  {
    title: '1. Oggetto',
    body: [
      'I presenti Termini di Utilizzo regolano l’accesso e l’uso del sito web della Scuderia DIIEM.',
      'Navigando sul sito, l’utente accetta di utilizzare i contenuti e i servizi disponibili in modo corretto, lecito e rispettoso delle finalità informative, divulgative e istituzionali del progetto.',
    ],
  },
  {
    title: '2. Contenuti del sito',
    body: [
      'Il sito presenta informazioni relative alla Scuderia DIIEM, ai suoi progetti, al team, alle attività, agli eventi, alle gare e alle iniziative collegate.',
      'I contenuti sono forniti a scopo informativo e possono essere aggiornati, modificati o rimossi in qualsiasi momento.',
      'Non viene garantita l’assenza assoluta di errori, refusi, imprecisioni tecniche o informazioni non aggiornate.',
    ],
  },
  {
    title: '3. Proprietà intellettuale',
    body: [
      'Testi, immagini, loghi, grafiche, layout, componenti visivi, materiali progettuali e contenuti pubblicati sul sito appartengono alla Scuderia DIIEM o ai rispettivi titolari, salvo diversa indicazione.',
      'È vietata la riproduzione, distribuzione, modifica o utilizzo dei contenuti per finalità commerciali senza autorizzazione scritta.',
      'È consentita la condivisione dei contenuti del sito tramite link, purché non vengano alterati il significato, l’attribuzione o il contesto originario.',
    ],
  },
  {
    title: '4. Uso consentito',
    body: [
      'L’utente si impegna a non utilizzare il sito per finalità illecite, fraudolente, dannose o contrarie al corretto funzionamento del servizio.',
      'È vietato tentare di accedere ad aree non autorizzate, interferire con la sicurezza del sito, inviare codice malevolo o utilizzare strumenti automatizzati in modo abusivo.',
    ],
  },
  {
    title: '5. Link esterni e servizi di terze parti',
    body: [
      'Il sito può contenere collegamenti a siti esterni, piattaforme social, mappe, contenuti incorporati o servizi gestiti da terzi.',
      'La Scuderia DIIEM non è responsabile per contenuti, disponibilità, sicurezza, informative privacy o condizioni d’uso di siti e servizi esterni.',
      'L’accesso a piattaforme di terze parti avviene sotto la responsabilità dell’utente e secondo le regole stabilite dai rispettivi fornitori.',
    ],
  },
  {
    title: '6. Form di contatto e comunicazioni',
    body: [
      'L’utente può contattare la Scuderia DIIEM tramite email o moduli eventualmente presenti sul sito.',
      'L’invio di messaggi non comporta automaticamente l’instaurazione di rapporti contrattuali, collaborazioni, sponsorizzazioni o altri impegni formali.',
      'La Scuderia DIIEM si riserva di rispondere alle richieste ricevute secondo disponibilità, pertinenza e priorità organizzative.',
    ],
  },
  {
    title: '7. Limitazione di responsabilità',
    body: [
      'Il sito è fornito “così com’è”, senza garanzia di continuità, disponibilità permanente o assenza di errori tecnici.',
      'La Scuderia DIIEM non risponde di eventuali danni diretti o indiretti derivanti dall’uso del sito, dall’impossibilità di accedervi, dall’affidamento su informazioni non aggiornate o dall’interazione con servizi esterni.',
    ],
  },
  {
    title: '8. Modifiche al sito e ai termini',
    body: [
      'La Scuderia DIIEM può modificare in qualsiasi momento contenuti, struttura, funzionalità e presenti Termini di Utilizzo.',
      'Le modifiche saranno efficaci dalla pubblicazione sul sito, salvo diversa indicazione.',
    ],
  },
  {
    title: '9. Privacy',
    body: [
      'Il trattamento dei dati personali è disciplinato dalla Privacy Policy pubblicata sul sito.',
      'L’utente è invitato a consultare la Privacy Policy per conoscere finalità, modalità di trattamento, servizi di terze parti e diritti esercitabili.',
    ],
  },
  {
    title: '10. Contatti',
    body: [
      'Per domande relative ai presenti Termini di Utilizzo è possibile scrivere a info@scuderiadiiem.com.',
      'Sede indicativa: Via Vito Volterra, 62, 00146 Roma RM.',
    ],
  },
]

export default function TermsOfUsePage() {
  return (
    <>
      <Head>
        <title>Termini di Utilizzo - Scuderia DIIEM</title>
        <meta
          name="description"
          content="Termini di Utilizzo del sito Scuderia DIIEM: contenuti, proprietà intellettuale, uso consentito, link esterni e responsabilità."
        />
      </Head>

      <div className="min-h-screen bg-white text-slate-950 dark:bg-primary dark:text-white">
        <Header />

        <main className="pt-28 pb-20">
          <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#112844] dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-accent">
                Condizioni
              </p>
              <h1 className="font-display text-4xl font-bold text-primary dark:text-white md:text-5xl">
                Termini di Utilizzo
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                Ultimo aggiornamento: 23 maggio 2026
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                Questa pagina definisce le condizioni generali per l’accesso e l’utilizzo del sito della Scuderia DIIEM.
              </p>
            </div>

            <div className="space-y-6">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#112844] dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                >
                  <h2 className="font-display text-2xl font-bold text-primary dark:text-white">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 sm:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
              Nota: questo documento è un modello generale. Se il sito viene usato per attività commerciali, raccolta strutturata di dati, sponsor, newsletter o servizi evoluti, è opportuno farlo verificare da un professionista.
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

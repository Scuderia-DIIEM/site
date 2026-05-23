import React from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const sections = [
  {
    title: '1. Titolare del trattamento',
    body: [
      'Il titolare del trattamento dei dati personali raccolti tramite questo sito è Scuderia DIIEM.',
      'Sede indicativa: Via Vito Volterra, 62, 00146 Roma RM.',
      'Email di contatto: info@scuderiadiiem.com.',
      'Per richieste relative alla privacy è possibile scrivere all’indirizzo email indicato sopra, specificando nell’oggetto “Privacy”.',
    ],
  },
  {
    title: '2. Tipologie di dati raccolti',
    body: [
      'Il sito può trattare dati forniti volontariamente dall’utente, come nome, cognome, indirizzo email e contenuto dei messaggi inviati tramite form o email.',
      'Il sito può inoltre trattare dati tecnici di navigazione, come indirizzo IP, informazioni sul browser, dispositivo utilizzato, orario di accesso e pagine visitate, nei limiti necessari al funzionamento tecnico del sito e dei servizi collegati.',
      'Alcune sezioni possono integrare contenuti di terze parti, come post Instagram, mappe, link social o altri servizi esterni. Tali servizi possono raccogliere dati secondo le rispettive informative privacy.',
    ],
  },
  {
    title: '3. Finalità del trattamento',
    body: [
      'I dati personali sono trattati per rispondere alle richieste inviate tramite il sito, gestire comunicazioni informative, presentare attività, progetti e iniziative della Scuderia DIIEM, migliorare la fruizione del sito e garantire sicurezza, manutenzione e corretto funzionamento tecnico.',
      'I dati non vengono utilizzati per finalità di profilazione commerciale autonoma, salvo diversa indicazione e previo consenso ove richiesto.',
    ],
  },
  {
    title: '4. Base giuridica del trattamento',
    body: [
      'Il trattamento dei dati forniti tramite form o email si basa sulla necessità di dare riscontro a una richiesta dell’utente.',
      'Il trattamento dei dati tecnici di navigazione si basa sul legittimo interesse al corretto funzionamento e alla sicurezza del sito.',
      'Quando richiesto dalla normativa applicabile, l’utilizzo di cookie o strumenti di terze parti non tecnici avviene sulla base del consenso dell’utente.',
    ],
  },
  {
    title: '5. Modalità di trattamento e conservazione',
    body: [
      'I dati sono trattati con strumenti informatici e organizzativi adeguati a garantirne sicurezza, integrità e riservatezza.',
      'I messaggi inviati tramite form o email vengono conservati per il tempo necessario a gestire la richiesta e, successivamente, per eventuali esigenze organizzative, amministrative o di tutela dei diritti.',
      'I dati tecnici di navigazione sono conservati per il tempo strettamente necessario al funzionamento, alla sicurezza e alla manutenzione del sito, salvo obblighi ulteriori previsti dalla legge.',
    ],
  },
  {
    title: '6. Servizi di terze parti',
    body: [
      'Il sito può utilizzare o collegare servizi di terze parti, tra cui piattaforme social, servizi di hosting, strumenti di gestione dei form, mappe esterne e incorporamenti Instagram.',
      'Quando l’utente interagisce con contenuti incorporati o link esterni, il trattamento dei dati può essere regolato dalle informative privacy dei rispettivi fornitori.',
      'La Scuderia DIIEM non controlla integralmente le modalità di trattamento operate da servizi terzi indipendenti.',
    ],
  },
  {
    title: '7. Cookie e strumenti simili',
    body: [
      'Il sito può utilizzare cookie tecnici necessari al funzionamento della navigazione.',
      'Eventuali contenuti di terze parti, come embed Instagram o mappe esterne, possono utilizzare cookie o tecnologie simili secondo le regole delle rispettive piattaforme.',
      'Se in futuro saranno introdotti cookie analitici, di profilazione o strumenti equivalenti non strettamente tecnici, la pagina dovrà essere aggiornata e, ove necessario, sarà predisposto un meccanismo di consenso adeguato.',
    ],
  },
  {
    title: '8. Comunicazione dei dati',
    body: [
      'I dati personali possono essere trattati da persone autorizzate interne al team e da fornitori tecnici che supportano la gestione del sito, dell’hosting, dei form, della posta elettronica o di altri servizi digitali.',
      'I dati non vengono venduti a terzi.',
    ],
  },
  {
    title: '9. Diritti dell’utente',
    body: [
      'L’utente può richiedere, nei limiti previsti dalla normativa applicabile, l’accesso ai propri dati personali, la rettifica, la cancellazione, la limitazione del trattamento, l’opposizione al trattamento e la portabilità dei dati.',
      'Per esercitare tali diritti è possibile scrivere a info@scuderiadiiem.com.',
      'L’utente ha inoltre il diritto di rivolgersi all’autorità di controllo competente se ritiene che il trattamento dei dati personali avvenga in violazione della normativa applicabile.',
    ],
  },
  {
    title: '10. Aggiornamenti della presente informativa',
    body: [
      'La presente Privacy Policy può essere aggiornata nel tempo per riflettere modifiche tecniche, organizzative o normative.',
      'La versione aggiornata sarà pubblicata su questa pagina con indicazione della data di ultimo aggiornamento.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Scuderia DIIEM</title>
        <meta
          name="description"
          content="Privacy Policy del sito Scuderia DIIEM: dati trattati, finalità, cookie, servizi di terze parti e diritti degli utenti."
        />
      </Head>

      <div className="min-h-screen bg-white text-slate-950 dark:bg-white/50 dark:text-white">
        <Header />

        <main className="pt-28 pb-20">
          <section className="mx-auto max-w-6xl px-2 sm:px-2 lg:px-2">
            <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#112844] dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-accent">
                Informativa
              </p>
              <h1 className="font-display text-4xl font-bold text-primary dark:text-white md:text-5xl">
                Privacy Policy
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                Ultimo aggiornamento: 23 maggio 2026
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                Questa pagina descrive in modo sintetico come il sito della Scuderia DIIEM tratta i dati personali degli utenti che lo visitano o che inviano richieste tramite i canali di contatto.
              </p>
            </div>

            <div className=" grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-2">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#112840]/90 dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
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

            <div className="mt-8 rounded-2xl border border-amber-500 bg-amber-50 p-5 text-sm leading-relaxed text-black/80 dark:border-amber-400/30 dark:bg-amber-400/30 dark:text-amber-50">
              Nota: questo testo è un modello operativo e deve essere adattato alle impostazioni effettive del sito, ai servizi realmente utilizzati e alla natura giuridica del soggetto che gestisce la Scuderia DIIEM.
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

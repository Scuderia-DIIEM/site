import React from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const sections = [
  {
    title: '1. Oggetto delle Note Legali',
    body: [
      'Le presenti Note Legali disciplinano l’accesso e l’utilizzo del sito web della Scuderia DIIEM, progetto universitario afferente all’Università degli Studi Roma Tre.',
      'Il sito ha finalità informative, divulgative, formative e promozionali relative alle attività, ai progetti, agli eventi, alle competizioni e alle iniziative della Scuderia DIIEM.',
      'La navigazione sul sito comporta l’accettazione delle presenti condizioni di utilizzo.',
    ],
  },
  {
    title: '2. Finalità del sito',
    body: [
      'Il sito fornisce informazioni sulle attività della Scuderia DIIEM, sui progetti sviluppati dal team, sulla struttura organizzativa, sui membri, sulle collaborazioni, sugli eventi e sulle iniziative di carattere universitario, tecnologico e divulgativo.',
      'Le informazioni pubblicate hanno carattere generale e informativo. Esse non costituiscono un’offerta contrattuale, né una garanzia di disponibilità, continuità o completezza delle attività descritte.',
      'La Scuderia DIIEM si riserva il diritto di aggiornare, modificare, integrare o rimuovere contenuti e pagine del sito in qualsiasi momento.',
    ],
  },
  {
    title: '3. Proprietà dei contenuti',
    body: [
      'Salvo diversa indicazione, testi, immagini, fotografie, grafiche, loghi, video, rendering, documenti, layout, codice, materiali multimediali e ogni altro contenuto presente sul sito appartengono alla Scuderia DIIEM, all’Università degli Studi Roma Tre o ai rispettivi titolari che ne abbiano autorizzato l’utilizzo.',
      'Tali contenuti sono protetti dalla normativa applicabile in materia di diritto d’autore, proprietà intellettuale e proprietà industriale.',
      'È vietata la riproduzione, distribuzione, modifica, pubblicazione, trasmissione o utilizzo dei contenuti per finalità commerciali senza preventiva autorizzazione scritta.',
    ],
  },
  {
    title: '4. Uso consentito dei contenuti',
    body: [
      'È consentita la consultazione del sito per finalità personali, informative, didattiche, divulgative o non commerciali.',
      'L’eventuale citazione o condivisione di contenuti è consentita nei limiti previsti dalla legge, purché venga indicata la fonte e non venga alterato il significato originario dei materiali.',
      'Eventuali note di copyright, indicazioni sugli autori, riferimenti alla fonte o informazioni di attribuzione devono essere mantenuti e correttamente riportati.',
    ],
  },
  {
    title: '5. Marchi, loghi e denominazioni',
    body: [
      'Il nome Scuderia DIIEM, il logo, gli elementi grafici identificativi e gli eventuali marchi collegati al progetto non possono essere utilizzati senza autorizzazione.',
      'Eventuali marchi, loghi, denominazioni, immagini o segni distintivi di terzi presenti sul sito appartengono ai rispettivi proprietari.',
      'L’eventuale presenza di marchi o loghi di terzi ha finalità descrittiva, informativa, istituzionale o di collaborazione e non implica necessariamente approvazione, sponsorizzazione o affiliazione, salvo diversa indicazione.',
    ],
  },
  {
    title: '6. Uso corretto del sito',
    body: [
      'L’utente si impegna a utilizzare il sito in modo corretto, lecito e rispettoso.',
      'Sono vietati accessi abusivi al sito, ai sistemi informatici o alle aree non pubbliche, nonché alterazione, cancellazione, falsificazione o modifica dei contenuti pubblicati.',
      'Sono inoltre vietati l’utilizzo del sito per finalità illecite, fraudolente, dannose o non autorizzate, la raccolta automatizzata di dati senza autorizzazione e l’utilizzo di indirizzi email, recapiti o dati pubblicati sul sito per spam, marketing non autorizzato o comunicazioni massive non richieste.',
    ],
  },
  {
    title: '7. Accuratezza delle informazioni',
    body: [
      'Scuderia DIIEM si impegna a pubblicare informazioni corrette, aggiornate e coerenti con le proprie attività.',
      'Tuttavia, i contenuti del sito possono contenere errori, imprecisioni, omissioni o informazioni non aggiornate.',
      'Scuderia DIIEM si riserva il diritto di modificare, aggiornare, integrare o rimuovere contenuti, pagine, materiali e funzionalità del sito in qualsiasi momento, senza obbligo di preavviso.',
    ],
  },
  {
    title: '8. Limitazione di responsabilità',
    body: [
      'Il sito e i suoi contenuti sono forniti “così come sono”, per finalità informative e divulgative.',
      'Scuderia DIIEM non garantisce che il sito sia sempre disponibile, privo di errori, compatibile con tutti i dispositivi, privo di interruzioni, virus o altri componenti dannosi.',
      'Nei limiti consentiti dalla legge, Scuderia DIIEM non potrà essere ritenuta responsabile per danni diretti o indiretti derivanti dall’accesso al sito, dall’utilizzo delle informazioni pubblicate, dall’impossibilità di accedere alle pagine o dall’interazione con funzionalità e servizi esterni collegati.',
    ],
  },
  {
    title: '9. Link esterni e materiali scaricabili',
    body: [
      'Il sito può contenere link verso siti, piattaforme o servizi esterni, inclusi siti istituzionali, social network, mappe, partner, sponsor o altri soggetti terzi.',
      'Tali collegamenti sono forniti come servizio all’utente. La presenza di un link esterno non implica approvazione, garanzia o assunzione di responsabilità da parte di Scuderia DIIEM rispetto ai contenuti, ai servizi, alla correttezza, alla completezza o alla sicurezza del sito collegato.',
      'Eventuali materiali scaricabili dal sito sono forniti per finalità informative, divulgative o didattiche. L’utente è tenuto a verificarne l’idoneità rispetto alle proprie esigenze e a rispettare eventuali diritti di proprietà intellettuale applicabili.',
    ],
  },
  {
    title: '10. Social media e aggiornamenti delle Note Legali',
    body: [
      'La Scuderia DIIEM può utilizzare canali social per comunicare attività, eventi, progetti, risultati e contenuti divulgativi. Gli utenti che interagiscono con tali canali sono invitati a mantenere un comportamento corretto, rispettoso e pertinente.',
      'Non sono ammessi contenuti offensivi, discriminatori, diffamatori, violenti, promozionali non autorizzati, spam, materiali che violino la privacy di terzi o contenuti che violino diritti d’autore, marchi o altri diritti di terzi.',
      'La Scuderia DIIEM si riserva, ove consentito dalle piattaforme utilizzate, di rimuovere commenti o contenuti non conformi a tali principi e di segnalare eventuali comportamenti abusivi. Le presenti Note Legali possono essere aggiornate in qualsiasi momento; le modifiche saranno pubblicate su questa pagina e saranno efficaci dalla data di pubblicazione.',
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

      <div className="min-h-screen bg-white text-slate-950 dark:bg-white dark:text-white">
        <Header />

        <main className="pt-28 pb-20">
          <section className="mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-2">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#112840]/95 dark:shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
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

            <div className="legal-warning-box">
              <strong>Nota:</strong> le presenti Note Legali disciplinano l’utilizzo del sito web di Scuderia DIIEM e dei contenuti pubblicati al suo interno. Per eventuali aspetti istituzionali, regolamentari o amministrativi riferibili all’Università degli Studi Roma Tre, si rinvia alla documentazione ufficiale dell’Ateneo. Le presenti condizioni potranno essere aggiornate in qualsiasi momento in caso di modifiche al sito, ai contenuti o alle modalità di utilizzo dei servizi collegati.            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

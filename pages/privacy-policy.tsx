import React from 'react'
import Head from 'next/head'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const sections = [
  {
    title: '1. Finalità della presente informativa',
    body: [
      'La presente Privacy Policy descrive le modalità con cui il sito web della Scuderia DIIEM, progetto universitario afferente all’Università degli Studi Roma Tre, tratta i dati personali degli utenti che consultano il sito, utilizzano i moduli di contatto, interagiscono con i contenuti pubblicati o accedono a servizi e collegamenti esterni presenti nelle pagine.',
      'Il trattamento dei dati personali è svolto nel rispetto dei principi di correttezza, trasparenza, minimizzazione, sicurezza e tutela della riservatezza degli interessati.',
      'La presente informativa è riferita al sito della Scuderia DIIEM e non sostituisce le informative istituzionali dell’Università degli Studi Roma Tre, alle quali si rinvia per gli aspetti generali e istituzionali relativi alla protezione dei dati personali nell’ambito dell’Ateneo.',
    ],
  },
  {
    title: '2. Titolare e riferimenti del progetto',
    body: [
      'Il sito è riferito alla Scuderia DIIEM, progetto universitario connesso alle attività formative, divulgative e tecnologiche dell’ambito universitario di Roma Tre.',
      'Per richieste relative al sito o al trattamento dei dati personali è possibile contattare la Scuderia DIIEM presso l’indirizzo Via Vito Volterra, 62, 00146 Roma RM, oppure tramite email all’indirizzo scuderia.diiem@uniroma3.it.',
      'Per gli aspetti istituzionali e generali relativi al trattamento dei dati personali nell’ambito dell’Ateneo, si rinvia alle informative privacy pubblicate dall’Università degli Studi Roma Tre.',
    ],
  },
  {
    title: '3. Tipologie di dati raccolti',
    body: [
      'Il sito può trattare dati forniti volontariamente dall’utente, come nome, cognome, indirizzo email e contenuto dei messaggi inviati tramite form o email.',
      'Il sito può inoltre trattare dati tecnici di navigazione, come indirizzo IP, informazioni sul browser, dispositivo utilizzato, orario di accesso e pagine visitate, nei limiti necessari al funzionamento tecnico del sito e dei servizi collegati.',
      'Alcune sezioni possono integrare contenuti di terze parti, come post Instagram, mappe, link social o altri servizi esterni. Tali servizi possono raccogliere dati secondo le rispettive informative privacy.',
    ],
  },
  {
    title: '4. Finalità del trattamento',
    body: [
      'I dati personali possono essere trattati per rispondere a richieste di informazioni inviate tramite form o email, gestire comunicazioni con utenti, studenti, membri del team, partner, sponsor o soggetti interessati alle attività di Scuderia DIIEM.',
      'I dati possono essere utilizzati per fornire informazioni sulle attività, sui progetti, sugli eventi, sulle competizioni e sulle iniziative del team, nonché per gestire eventuali richieste di collaborazione, partecipazione o contatto.',
      'I dati tecnici possono essere trattati per garantire il corretto funzionamento del sito, migliorarne sicurezza, accessibilità e fruibilità, prevenire usi impropri, accessi non autorizzati o attività dannose.',
    ],
  },
  {
    title: '5. Base giuridica del trattamento',
    body: [
      'Il trattamento dei dati personali può basarsi sul consenso dell’utente, quando i dati sono inviati volontariamente tramite form o email.',
      'Il trattamento può inoltre basarsi sulla necessità di rispondere a una richiesta dell’interessato, sul legittimo interesse alla gestione tecnica, organizzativa e di sicurezza del sito, oppure sull’adempimento di eventuali obblighi previsti dalla legge.',
      'Quando pertinente, il trattamento può essere connesso alle finalità istituzionali, formative, divulgative o progettuali dell’ambito universitario nel quale opera Scuderia DIIEM.',
    ],
  },
  {
    title: '6. Modalità di trattamento e sicurezza',
    body: [
      'I dati personali sono trattati con strumenti informatici e telematici, secondo logiche strettamente correlate alle finalità indicate nella presente informativa.',
      'Sono adottate misure tecniche e organizzative ragionevoli per ridurre i rischi di accesso non autorizzato, perdita, alterazione, divulgazione o uso improprio dei dati.',
      'I dati non sono venduti a terzi. L’accesso ai dati è limitato ai soggetti che ne abbiano necessità per la gestione del sito, delle comunicazioni e delle attività connesse a Scuderia DIIEM.',
    ],
  },
  {
    title: '7. Servizi di terze parti',
    body: [
      'Il sito può utilizzare o incorporare servizi forniti da soggetti terzi, come servizi di hosting e pubblicazione del sito, strumenti per la gestione dei moduli di contatto, contenuti incorporati da Instagram, collegamenti a Google Maps e link verso piattaforme social o siti esterni.',
      'L’interazione con tali servizi può comportare il trattamento di dati personali da parte dei rispettivi fornitori, secondo le loro informative privacy e le loro condizioni di utilizzo.',
      'Scuderia DIIEM non controlla direttamente le modalità di trattamento operate da tali soggetti terzi e invita gli utenti a consultare le relative informative prima di interagire con tali servizi.',
    ],
  },
  {
    title: '8. Conservazione dei dati',
    body: [
      'I dati inviati tramite form o email sono conservati per il tempo necessario a rispondere alla richiesta e a gestire eventuali comunicazioni successive.',
      'I dati tecnici di navigazione sono conservati per il tempo necessario al corretto funzionamento, alla sicurezza e alla manutenzione del sito, salvo ulteriori esigenze tecniche o obblighi previsti dalla normativa applicabile.',
      'Quando i dati non sono più necessari rispetto alle finalità per cui sono stati raccolti, vengono cancellati o resi anonimi, salvo eventuali obblighi di conservazione.',
    ],
  },
  {
    title: '9. Diritti dell’interessato',
    body: [
      'L’utente può esercitare, nei limiti previsti dalla normativa applicabile, i diritti relativi ai propri dati personali, tra cui diritto di accesso, rettifica, cancellazione, limitazione del trattamento, opposizione e portabilità dei dati, ove applicabile.',
      'Quando il trattamento si basa sul consenso, l’utente può revocare il consenso prestato, senza pregiudicare la liceità del trattamento effettuato prima della revoca.',
      'Le richieste relative al sito di Scuderia DIIEM possono essere inviate all’indirizzo info@scuderiadiiem.com. Per gli aspetti istituzionali relativi al trattamento dei dati personali nell’ambito dell’Ateneo, si rinvia alla documentazione privacy dell’Università degli Studi Roma Tre.',
    ],
  },
  {
    title: '10. Cookie, aggiornamenti e rinvii',
    body: [
      'Il sito può utilizzare cookie tecnici necessari al corretto funzionamento delle pagine. Eventuali servizi esterni incorporati, come social media, mappe o strumenti di gestione dei form, possono utilizzare propri cookie o tecnologie analoghe.',
      'Qualora in futuro vengano introdotti strumenti di analytics, profilazione, marketing o tracciamento non tecnico, la presente informativa dovrà essere aggiornata e, ove necessario, integrata con una Cookie Policy dedicata.',
      'La presente Privacy Policy può essere modificata nel tempo per adeguarla a cambiamenti tecnici, organizzativi o normativi. La versione aggiornata sarà pubblicata su questa pagina.',
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

      <div className="min-h-screen bg-white text-slate-950 dark:bg-white dark:text-white">
        <Header />

        <main className="pt-28 pb-20">
          <section className="mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>

            <div className=" grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-2">
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
              <strong>Nota:</strong> la presente informativa è riferita esclusivamente al sito web di Scuderia DIIEM e alle funzionalità in esso presenti. Per gli aspetti istituzionali relativi al trattamento dei dati personali nell’ambito dell’Università degli Studi Roma Tre, si rinvia alla documentazione privacy ufficiale pubblicata dall’Ateneo. L’informativa potrà essere aggiornata in caso di modifiche tecniche, organizzative, normative o di introduzione di nuovi servizi esterni.
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}

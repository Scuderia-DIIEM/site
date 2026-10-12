import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Language = 'it' | 'en'

const translations: Record<string, { it: string; en: string }> = {
  Home: { it: 'Home', en: 'Home' },
  Dispositivi: { it: 'Dispositivi', en: 'Devices' },
  'Chi Siamo': { it: 'Chi Siamo', en: 'About Us' },
  Struttura: { it: 'Struttura', en: 'Structure' },
  Progetti: { it: 'Progetti', en: 'Projects' },
  Team: { it: 'Team', en: 'Team' },
  Eventi: { it: 'Eventi', en: 'Events' },
  Contatti: { it: 'Contatti', en: 'Contact' },
  'Modifica profilo': { it: 'Modifica profilo', en: 'Edit profile' },
  'Articoli e progetti': { it: 'Articoli e progetti', en: 'Articles and projects' },
  'Gestione utenti': { it: 'Gestione utenti', en: 'User management' },
  'Esci': { it: 'Esci', en: 'Sign out' },
  'Accesso...': { it: 'Accesso...', en: 'Signing in...' },
  'Navigazione': { it: 'Navigazione', en: 'Navigation' },
  'Seguici su:': { it: 'Seguici su:', en: 'Follow us:' },
  'Modalità chiara': { it: 'Modalità chiara', en: 'Light mode' },
  'Modalità scura': { it: 'Modalità scura', en: 'Dark mode' },
  'Lingua inglese': { it: 'Lingua inglese', en: 'English language' },
  'Lingua italiana': { it: 'Lingua italiana', en: 'Italian language' },
  'Progetti e articoli': { it: 'Progetti e articoli', en: 'Projects and articles' },
  'Raccolta di articoli - Clicca un elemento per aprire il dettaglio.': { it: 'Raccolta di articoli - Clicca un elemento per aprire il dettaglio.', en: 'Article collection - Click an item to open its details.' },
  Cerca: { it: 'Cerca', en: 'Search' },
  Pannelli: { it: 'Pannelli', en: 'Cards' },
  Lista: { it: 'Lista', en: 'List' },
  Filtri: { it: 'Filtri', en: 'Filters' },
  Ordine: { it: 'Ordine', en: 'Order' },
  'Dal più recente': { it: 'Dal più recente', en: 'Newest first' },
  'Dal meno recente': { it: 'Dal meno recente', en: 'Oldest first' },
  Visibilità: { it: 'Visibilità', en: 'Visibility' },
  Tutti: { it: 'Tutti', en: 'All' },
  Pubblici: { it: 'Pubblici', en: 'Public' },
  Privati: { it: 'Privati', en: 'Private' },
  'Azzera tag': { it: 'Azzera tag', en: 'Clear tags' },
  'Non ci sono ancora tag disponibili.': { it: 'Non ci sono ancora tag disponibili.', en: 'No tags are available yet.' },
  'I Nostri Dispositivi': { it: 'I Nostri Dispositivi', en: 'Our Devices' },
  'Tecnologie innovative in sviluppo per il futuro delle operazioni marine': { it: 'Tecnologie innovative in sviluppo per il futuro delle operazioni marine', en: 'Innovative technologies in development for the future of marine operations' },
  'La storia della Scuderia DIIEM e la nostra missione': { it: 'La storia della Scuderia DIIEM e la nostra missione', en: 'The history of Scuderia DIIEM and our mission' },
  'I Nostri Progetti': { it: 'I Nostri Progetti', en: 'Our Projects' },
  'Scopri i nostri progetti': { it: 'Scopri i nostri progetti', en: 'Discover our projects' },
  Contattaci: { it: 'Contattaci', en: 'Contact us' },
  'Informazioni di Contatto': { it: 'Informazioni di Contatto', en: 'Contact Information' },
  'Email Generale': { it: 'Email Generale', en: 'General Email' },
  'Professore Coordinatore': { it: 'Professore Coordinatore', en: 'Coordinating Professor' },
  Seguici: { it: 'Seguici', en: 'Follow us' },
  'Innovazione ingegneristica | Ricerca e sviluppo': { it: 'Innovazione ingegneristica | Ricerca e sviluppo', en: 'Engineering innovation | Research and development' },
  'Scopri il Nostro Progetto': { it: 'Scopri il Nostro Progetto', en: 'Discover Our Project' },
  'Diventa Sponsor': { it: 'Diventa Sponsor', en: 'Become a Sponsor' },
  'Il Nostro Team': { it: 'Il Nostro Team', en: 'Our Team' },
  'Conosci le persone che rendono possibile tutto questo': { it: 'Conosci le persone che rendono possibile tutto questo', en: 'Meet the people who make all this possible' },
  'Nessun membro disponibile per questo filtro.': { it: 'Nessun membro disponibile per questo filtro.', en: 'No members available for this filter.' },
  'Mostra altro': { it: 'Mostra altro', en: 'Show more' },
  'Mostra tutti': { it: 'Mostra tutti', en: 'Show all' },
  'Team Attuale': { it: 'Team Attuale', en: 'Current Team' },
  Founders: { it: 'Founders', en: 'Founders' },
  'Filtri del team': { it: 'Filtri del team', en: 'Team filters' },
  'Prossimo Evento': { it: 'Prossimo Evento', en: 'Upcoming Event' },
  'Seguici su Instagram': { it: 'Seguici su Instagram', en: 'Follow us on Instagram' },
  'Scopri le ultime novità e aggiornamenti dal nostro account Instagram': { it: 'Scopri le ultime novità e aggiornamenti dal nostro account Instagram', en: 'Discover the latest news and updates from our Instagram account' },
  'I Nostri Partner': { it: 'I Nostri Partner', en: 'Our Partners' },
  'Aziende che collaborano con noi e sostengono il nostro progetto.': { it: 'Aziende che collaborano con noi e sostengono il nostro progetto.', en: 'Companies that collaborate with us and support our project.' },
  'Visita il sito': { it: 'Visita il sito', en: 'Visit website' },
  'Il rov in azione dal vivo durante gli eventi a cui partecipiamo': { it: 'Il rov in azione dal vivo durante gli eventi a cui partecipiamo', en: 'The ROV in action at the events we attend' },
  'Scopri di più sull’evento qui:': { it: 'Scopri di più sull’evento qui:', en: 'Learn more about the event here:' },
  'Organizzazione interna': { it: 'Organizzazione interna', en: 'Internal organization' },
  'Struttura aziendale': { it: 'Struttura aziendale', en: 'Company structure' },
  'Mostra membri': { it: 'Mostra membri', en: 'Show members' },
  'Periodo di attività:': { it: 'Periodo di attività:', en: 'Active period:' },
  'Nessun contatto disponibile': { it: 'Nessun contatto disponibile', en: 'No contact available' },
  'Torna al sito': { it: 'Torna al sito', en: 'Back to website' },
  'Area riservata': { it: 'Area riservata', en: 'Members area' },
  Accedi: { it: 'Accedi', en: 'Sign in' },
  'Gli account sono creati dall’amministratore. Non è possibile registrarsi.': { it: 'Gli account sono creati dall’amministratore. Non è possibile registrarsi.', en: 'Accounts are created by the administrator. Registration is not available.' },
  'Email o nome utente': { it: 'Email o nome utente', en: 'Email or username' },
  Password: { it: 'Password', en: 'Password' },
  'Accesso non riuscito.': { it: 'Accesso non riuscito.', en: 'Sign-in failed.' },
  'Servizio non disponibile. Riprova tra poco.': { it: 'Servizio non disponibile. Riprova tra poco.', en: 'Service unavailable. Try again shortly.' },
  'Sicurezza account': { it: 'Sicurezza account', en: 'Account security' },
  'Cambia password': { it: 'Cambia password', en: 'Change password' },
  'Per proteggere il tuo account, scegli una nuova password prima di continuare.': { it: 'Per proteggere il tuo account, scegli una nuova password prima di continuare.', en: 'To protect your account, choose a new password before continuing.' },
  'Password attuale': { it: 'Password attuale', en: 'Current password' },
  'Nuova password': { it: 'Nuova password', en: 'New password' },
  'Conferma nuova password': { it: 'Conferma nuova password', en: 'Confirm new password' },
  'Salvataggio...': { it: 'Salvataggio...', en: 'Saving...' },
  'Aggiorna password': { it: 'Aggiorna password', en: 'Update password' },
  'Impossibile aggiornare la password.': { it: 'Impossibile aggiornare la password.', en: 'Unable to update the password.' },
  'Nuovo articolo': { it: 'Nuovo articolo', en: 'New article' },
  'Torna agli articoli': { it: 'Torna agli articoli', en: 'Back to articles' },
  'Aggiungi un articolo': { it: 'Aggiungi un articolo', en: 'Add an article' },
  'Carica la copertina e il PDF. Puoi scegliere se renderlo pubblico o riservato agli utenti autenticati.': { it: 'Carica la copertina e il PDF. Puoi scegliere se renderlo pubblico o riservato agli utenti autenticati.', en: 'Upload the cover image and PDF. You can choose whether to make it public or restricted to authenticated users.' },
  'Verifica dell’accesso in corso…': { it: 'Verifica dell’accesso in corso…', en: 'Checking access…' },
  'Titolo / copertina': { it: 'Titolo / copertina', en: 'Title / cover' },
  'Titolo dell’articolo': { it: 'Titolo dell’articolo', en: 'Article title' },
  'Data dell’articolo': { it: 'Data dell’articolo', en: 'Article date' },
  'Preimpostata alla data di oggi.': { it: 'Preimpostata alla data di oggi.', en: 'Defaults to today’s date.' },
  'Separa più tag con virgole. I tag già usati vengono suggeriti.': { it: 'Separa più tag con virgole. I tag già usati vengono suggeriti.', en: 'Separate multiple tags with commas. Previously used tags are suggested.' },
  'Breve descrizione': { it: 'Breve descrizione', en: 'Short description' },
  'Descrivi brevemente l’articolo…': { it: 'Descrivi brevemente l’articolo…', en: 'Briefly describe the article…' },
  Autori: { it: 'Autori', en: 'Authors' },
  'Inserisci un autore per riga o separali con una virgola.': { it: 'Inserisci un autore per riga o separali con una virgola.', en: 'Enter one author per line or separate them with commas.' },
  'Foto di copertina': { it: 'Foto di copertina', en: 'Cover image' },
  'Scegli copertina': { it: 'Scegli copertina', en: 'Choose cover' },
  'Nessun file selezionato': { it: 'Nessun file selezionato', en: 'No file selected' },
  'Articolo completo in PDF': { it: 'Articolo completo in PDF', en: 'Full article PDF' },
  'Pubblica articolo': { it: 'Pubblica articolo', en: 'Publish article' },
  'Caricamento e pubblicazione…': { it: 'Caricamento e pubblicazione…', en: 'Uploading and publishing…' },
  'Torna ai progetti': { it: 'Torna ai progetti', en: 'Back to projects' },
  'Nessun progetto corrisponde alla ricerca.': { it: 'Nessun progetto corrisponde alla ricerca.', en: 'No project matches the search.' },
  'Pubblico': { it: 'Pubblico', en: 'Public' },
  'Privato': { it: 'Privato', en: 'Private' },
  'Scopri la nostra struttura': { it: 'Scopri la nostra struttura', en: 'Discover our structure' },
  'La Nostra Storia': { it: 'La Nostra Storia', en: 'Our Story' },
  'La Nostra Missione': { it: 'La Nostra Missione', en: 'Our Mission' },
  'Anni di Attività': { it: 'Anni di Attività', en: 'Years active' },
  'Membri Team': { it: 'Membri Team', en: 'Team members' },
  'Eventi svolti': { it: 'Eventi svolti', en: 'Events held' },
  'Siamo qui per rispondere alle tue domande e discutere opportunità di collaborazione': { it: 'Siamo qui per rispondere alle tue domande e discutere opportunità di collaborazione', en: 'We are here to answer your questions and discuss collaboration opportunities' },
  'Seleziona un oggetto': { it: 'Seleziona un oggetto', en: 'Select a subject' },
  'Invio in corso...': { it: 'Invio in corso...', en: 'Sending...' },
  'Invia Messaggio': { it: 'Invia Messaggio', en: 'Send message' },
  'Messaggio inviato con successo!': { it: 'Messaggio inviato con successo!', en: 'Message sent successfully!' },
  'Errore durante l’invio del messaggio.': { it: 'Errore durante l’invio del messaggio.', en: 'Error sending the message.' },
  'Errore di connessione. Riprova più tardi.': { it: 'Errore di connessione. Riprova più tardi.', en: 'Connection error. Please try again later.' },
  'Veicolo Subacqueo Guidato da Remoto': { it: 'Veicolo Subacqueo Guidato da Remoto', en: 'Remotely Operated Underwater Vehicle' },
  'Boa di Misurazione': { it: 'Boa di Misurazione', en: 'Measurement Buoy' },
  'Stazione di Controllo': { it: 'Stazione di Controllo', en: 'Control Station' },
  'Braccio Robotico': { it: 'Braccio Robotico', en: 'Robotic Arm' },
  'Il nostro ROV è composto da un core centrale che contiene tutta l\'elettronica: due convertitori 48V-12V, 6 ESC per i thruster, sensori di temperatura, umidità, pressione, infiltrazione d\'acqua e IMU, una camera, un Raspberry Pi 5, un dissipatore e una pompa per il dissipatore. \n Il telaio, progettato da noi, è completamente stampato in 3D. \n Utilizziamo 6 thruster per manovrare il ROV su tutti gli assi, garantendo un controllo preciso e completo.\n Sull\'anteriore sono presenti due luci LED che illuminano la vista della camera posta nel dome del core. Sui lati, integrati tra i thruster e il core, ci sono i volumi di galleggiamento.\n Dietro il tappo del core sono presenti i cavi che entrano nei motori e il cordone con energia ed informazione che arriva alla ground station.\n Il veicolo è controllato attraverso la ground station con un controller Xbox.': { it: 'Il nostro ROV è composto da un core centrale che contiene tutta l\'elettronica: due convertitori 48V-12V, 6 ESC per i thruster, sensori di temperatura, umidità, pressione, infiltrazione d\'acqua e IMU, una camera, un Raspberry Pi 5, un dissipatore e una pompa per il dissipatore. \n Il telaio, progettato da noi, è completamente stampato in 3D. \n Utilizziamo 6 thruster per manovrare il ROV su tutti gli assi, garantendo un controllo preciso e completo.\n Sull\'anteriore sono presenti due luci LED che illuminano la vista della camera posta nel dome del core. Sui lati, integrati tra i thruster e il core, ci sono i volumi di galleggiamento.\n Dietro il tappo del core sono presenti i cavi che entrano nei motori e il cordone con energia ed informazione che arriva alla ground station.\n Il veicolo è controllato attraverso la ground station con un controller Xbox.', en: 'Our ROV has a central core containing all electronics: two 48V-to-12V converters, six ESCs for the thrusters, temperature, humidity, pressure, water ingress and IMU sensors, a camera, a Raspberry Pi 5, a heatsink and a cooling pump.\\nThe frame was designed by our team and is fully 3D-printed. Six thrusters move the ROV along all axes, providing precise and complete control.\\nTwo front LED lights illuminate the camera view in the core dome. Buoyancy volumes are integrated on the sides between the thrusters and the core. The motor cables and the power-and-data tether to the ground station exit from the rear core cap. The vehicle is controlled from the ground station with an Xbox controller.' },
  'Il Float è una boa che viene trasportata dal ROV in un punto della piscina.\n Una volta messa in posizione, parte una routine che la fa immergere fino al fondale.\n Il sensore di pressione ricava la profondità e, una volta riemersa, manda le informazioni acquisite alla ground station tramite antenne.': { it: 'Il Float è una boa che viene trasportata dal ROV in un punto della piscina.\n Una volta messa in posizione, parte una routine che la fa immergere fino al fondale.\n Il sensore di pressione ricava la profondità e, una volta riemersa, manda le informazioni acquisite alla ground station tramite antenne.', en: 'Float is a buoy carried by the ROV to a point in the pool. Once positioned, an automated routine makes it sink to the bottom. The pressure sensor measures its depth and, after it resurfaces, sends the collected data to the ground station through antennas.' },
  'Valigetta di controllo con cavo Ethernet, schermo e tastiera per interfaccia grafica e comunicazione con il ROV.\n Al suo interno è presente un Raspberry Pi 5 che gestisce il sistema di controllo e la comunicazione con i dispositivi subacquei.': { it: 'Valigetta di controllo con cavo Ethernet, schermo e tastiera per interfaccia grafica e comunicazione con il ROV.\n Al suo interno è presente un Raspberry Pi 5 che gestisce il sistema di controllo e la comunicazione con i dispositivi subacquei.', en: 'A control case with an Ethernet cable, display and keyboard for the graphical interface and communication with the ROV. It contains a Raspberry Pi 5 that manages the control system and communication with the underwater devices.' },
  'Braccio robotico che si attacca al ROV per interagire con oggetti sottomarini durante le operazioni.': { it: 'Braccio robotico che si attacca al ROV per interagire con oggetti sottomarini durante le operazioni.', en: 'A robotic arm attached to the ROV to interact with underwater objects during operations.' },
  'Elemento selezionato': { it: 'Elemento selezionato', en: 'Selected element' },
  'Responsabilità principali': { it: 'Responsabilità principali', en: 'Main responsibilities' },
  'La "SDR3 Robotic", scuderia del dipartimento DIIEM dell\'Università Roma Tre, nasce dalla passione di un gruppo di studenti per l\'ingegneria e il mondo marino. Il nostro team vede collaborare giovani studenti di ingegneria per la creazione di un R.O.V. sottomarino.': { it: 'La "SDR3 Robotic", scuderia del dipartimento DIIEM dell\'Università Roma Tre, nasce dalla passione di un gruppo di studenti per l\'ingegneria e il mondo marino. Il nostro team vede collaborare giovani studenti di ingegneria per la creazione di un R.O.V. sottomarino.', en: 'SDR3 Robotic, the DIIEM department team at Roma Tre University, was born from a group of students’ passion for engineering and the marine world. Our team brings together engineering students to build an underwater R.O.V.' },
  'La nostra squadra è molto eterogenea, composta da studenti di ingegneria meccanica, elettronica e biomedica.': { it: 'La nostra squadra è molto eterogenea, composta da studenti di ingegneria meccanica, elettronica e biomedica.', en: 'Our team is very diverse, bringing together students of mechanical, electronic and biomedical engineering.' },
  'Ai fini della competizione abbiamo simulato una struttura aziendale, con un CEO, un CTO ed altri ruoli che si occupano di aspetti specifici del progetto, come la gestione dei social media, la ricerca di sponsor e la progettazione tecnica.': { it: 'Ai fini della competizione abbiamo simulato una struttura aziendale, con un CEO, un CTO ed altri ruoli che si occupano di aspetti specifici del progetto, come la gestione dei social media, la ricerca di sponsor e la progettazione tecnica.', en: 'For the competition, we simulated a company structure with a CEO, a CTO and other roles responsible for specific aspects of the project, such as social media, sponsor outreach and technical design.' },
  'L\'obiettivo principale è di partecipare alla MATE ROV competition ma contemporaneamente siamo impegnati nella ricerca e nello sviluppo nell\'ambito subacqueo, la creazione di dispositivi in grado di salvaguardare l\'ambiente marino ed infine la crescita personale simulando per la prima volta nel mondo del lavoro.': { it: 'L\'obiettivo principale è di partecipare alla MATE ROV competition ma contemporaneamente siamo impegnati nella ricerca e nello sviluppo nell\'ambito subacqueo, la creazione di dispositivi in grado di salvaguardare l\'ambiente marino ed infine la crescita personale simulando per la prima volta nel mondo del lavoro.', en: 'Our main goal is to compete in the MATE ROV competition while pursuing underwater research and development, creating devices that protect the marine environment and growing personally by experiencing a professional work environment.' },
}

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (value: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('it')

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('language')
    if (savedLanguage === 'it' || savedLanguage === 'en') setLanguageState(savedLanguage)
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem('language', nextLanguage)
    document.documentElement.lang = nextLanguage
  }

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (value: string) => translations[value]?.[language] ?? value,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}

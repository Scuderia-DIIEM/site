import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

type NodeId =
  | "ceo"
  | "cmo"
  | "coo"
  | "cto"
  | "marketing"
  | "photo"
  | "operations"
  | "rov"
  | "float"
  | "arm"
  | "gs"
  | "electronics"
  | "software"
  | "cad"
  | "special";

type OrgNode = {
  id: NodeId;
  title: string;
  subtitle: string;
  description: string;
  responsibilities: string[];
  colorClass: string;
  activeClass: string;
};

const nodes: Record<NodeId, OrgNode> = {
  ceo: {
    id: "ceo",
    title: "CEO",
    subtitle: "Direzione strategica",
    description:
      "Coordina la visione generale della Scuderia, definisce le priorità strategiche e mantiene l’allineamento tra area operativa, area tecnica e comunicazione.",
    responsibilities: [
      "Definizione degli obiettivi generali",
      "Coordinamento tra le aree principali",
      "Gestione delle priorità strategiche",
      "Relazione con stakeholder e partner",
    ],
    colorClass: "bg-gradient-to-br from-[#ff6b4a] to-[#f4792b] text-white",
    activeClass: "ring-[#f4792b]",
  },
  cmo: {
    id: "cmo",
    title: "CMO",
    subtitle: "Marketing",
    description:
      "Gestisce l’identità comunicativa della Scuderia, la narrazione dei progetti, i contenuti pubblici e le relazioni con sponsor e community.",
    responsibilities: [
      "Brand identity",
      "Social media e comunicazione",
      "Sponsor e partnership",
      "Eventi e contenuti pubblici",
    ],
    colorClass: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white",
    activeClass: "ring-emerald-400",
  },
  coo: {
    id: "coo",
    title: "COO",
    subtitle: "Operating",
    description:
      "Organizza il funzionamento interno del team, la pianificazione delle attività, la gestione delle risorse e il coordinamento operativo quotidiano.",
    responsibilities: [
      "Pianificazione interna",
      "Gestione risorse",
      "Coordinamento attività",
      "Supporto organizzativo ai reparti",
    ],
    colorClass: "bg-gradient-to-br from-cyan-400 to-cyan-600 text-white",
    activeClass: "ring-cyan-400",
  },
  cto: {
    id: "cto",
    title: "CTO",
    subtitle: "Technology",
    description:
      "Guida lo sviluppo tecnologico della Scuderia, coordinando sia i progetti principali sia le aree tecniche specialistiche.",
    responsibilities: [
      "Coordinamento tecnico",
      "Sviluppo dei progetti",
      "Integrazione hardware/software",
      "Supervisione delle aree specialistiche",
    ],
    colorClass: "bg-gradient-to-br from-orange-400 to-orange-600 text-white",
    activeClass: "ring-orange-400",
  },
  marketing: {
    id: "marketing",
    title: "Marketing",
    subtitle: "Comunicazione e brand",
    description:
      "Area dedicata alla comunicazione visiva e testuale, alla presenza online e alla valorizzazione dei progetti della Scuderia.",
    responsibilities: [
      "Contenuti social",
      "Grafica e materiali promozionali",
      "Comunicati e storytelling",
      "Supporto agli eventi",
    ],
    colorClass: "bg-emerald-100 text-slate-950 dark:bg-emerald-500/60 dark:text-white",
    activeClass: "ring-emerald-400",
  },
  photo: {
    id: "photo",
    title: "Photo",
    subtitle: "Fotografia e video",
    description:
      "Area dedicata alla produzione di contenuti visivi, fotografie e video per la comunicazione della Scuderia.",
    responsibilities: [
      "Contenuti social",
      "Grafiche",
      "Materiali promozionali",
      "Supporto agli eventi",
    ],
    colorClass: "bg-emerald-100 text-slate-950 dark:bg-emerald-500/60 dark:text-white",
    activeClass: "ring-emerald-400",
  },
  operations: {
    id: "operations",
    title: "Operations",
    subtitle: "Gestione interna",
    description:
      "Area che sostiene la gestione pratica del team, l’organizzazione delle attività e il monitoraggio delle risorse disponibili.",
    responsibilities: [
      "Calendario attività",
      "Inventario e materiali",
      "Supporto logistico",
      "Gestione interna del lavoro",
    ],
    colorClass: "bg-cyan-100 text-slate-950 dark:bg-cyan-500/60 dark:text-white",
    activeClass: "ring-cyan-400",
  },
  rov: {
    id: "rov",
    title: "ROV",
    subtitle: "Veicolo subacqueo",
    description:
      "Progetto principale dedicato allo sviluppo del veicolo subacqueo, con integrazione meccanica, elettronica, controllo e comunicazione.",
    responsibilities: [
      "Architettura del veicolo",
      "Integrazione dei sottosistemi",
      "Test in ambiente acquatico",
      "Ottimizzazione funzionale",
    ],
    colorClass: "bg-orange-100 text-slate-950 dark:bg-orange-500/60 dark:text-white",
    activeClass: "ring-orange-400",
  },
  float: {
    id: "float",
    title: "FLOAT",
    subtitle: "Sistema galleggiante",
    description:
      "Sviluppo del modulo galleggiante e delle soluzioni di supporto necessarie alle attività in ambiente marino.",
    responsibilities: [
      "Studio del galleggiamento",
      "Struttura di supporto",
      "Interfaccia con il sistema ROV",
      "Validazione sperimentale",
    ],
    colorClass: "bg-orange-100 text-slate-950 dark:bg-orange-500/60 dark:text-white",
    activeClass: "ring-orange-400",
  },
  arm: {
    id: "arm",
    title: "ARM",
    subtitle: "Braccio robotico",
    description:
      "Area progettuale dedicata al braccio robotico, alla movimentazione e all’interazione con l’ambiente operativo.",
    responsibilities: [
      "Cinematica del braccio",
      "Progettazione meccanica",
      "Attuazione e controllo",
      "Test di presa e movimento",
    ],
    colorClass: "bg-orange-100 text-slate-950 dark:bg-orange-500/60 dark:text-white",
    activeClass: "ring-orange-400",
  },
  gs: {
    id: "gs",
    title: "GS",
    subtitle: "Ground Station",
    description:
      "Sistema di controllo e supervisione da terra, pensato per monitorare, comandare e visualizzare le informazioni operative.",
    responsibilities: [
      "Interfaccia di controllo",
      "Visualizzazione dati",
      "Comunicazione con il veicolo",
      "Supporto agli operatori",
    ],
    colorClass: "bg-orange-100 text-slate-950 dark:bg-orange-500/60 dark:text-white",
    activeClass: "ring-orange-400",
  },
  electronics: {
    id: "electronics",
    title: "Elettronica",
    subtitle: "Hardware e PCB",
    description:
      "Area tecnica dedicata alla progettazione elettronica, alla scelta dei componenti, ai circuiti e all’integrazione dei sensori.",
    responsibilities: [
      "Schemi elettrici",
      "PCB e cablaggi",
      "Alimentazione",
      "Sensori e acquisizione dati",
    ],
    colorClass: "bg-red-100 text-slate-950 dark:bg-red-500/60 dark:text-white",
    activeClass: "ring-red-400",
  },
  software: {
    id: "software",
    title: "Informatica",
    subtitle: "Software e controllo",
    description:
      "Area che sviluppa software, logiche di controllo, comunicazione e strumenti digitali per la gestione dei dispositivi.",
    responsibilities: [
      "Software di controllo",
      "Comunicazione dati",
      "Interfacce operative",
      "Automazione e logiche di sistema",
    ],
    colorClass: "bg-red-100 text-slate-950 dark:bg-red-500/60 dark:text-white",
    activeClass: "ring-red-400",
  },
  cad: {
    id: "cad",
    title: "CAD",
    subtitle: "Progettazione meccanica",
    description:
      "Area di modellazione tridimensionale e progettazione meccanica, utile per trasformare le idee in componenti realizzabili.",
    responsibilities: [
      "Modellazione 3D",
      "Assiemi meccanici",
      "Disegni tecnici",
      "Preparazione alla fabbricazione",
    ],
    colorClass: "bg-red-100 text-slate-950 dark:bg-red-500/60 dark:text-white",
    activeClass: "ring-red-400",
  },
  special: {
    id: "special",
    title: "Tecnologie speciali",
    subtitle: "Ricerca e sviluppo",
    description:
      "Area trasversale per soluzioni sperimentali, tecnologie innovative e attività di ricerca applicata ai progetti della Scuderia.",
    responsibilities: [
      "Sperimentazione",
      "Ricerca di nuove soluzioni",
      "Prototipazione avanzata",
      "Supporto ai reparti tecnici",
    ],
    colorClass: "bg-red-100 text-slate-950 dark:bg-red-500/60 dark:text-white",
    activeClass: "ring-red-400",
  },
};

function NodeButton({
  id,
  selectedId,
  onSelect,
  compact = false,
}: {
  id: NodeId;
  selectedId: NodeId;
  onSelect: (id: NodeId) => void;
  compact?: boolean;
}) {
  const node = nodes[id];
  const selected = selectedId === id;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-full rounded-2xl text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 ${node.colorClass} ${
        selected
          ? `scale-[1.02] ring-4 ${node.activeClass}`
          : "ring-1 ring-white/10"
      } ${compact ? "px-4 py-3" : "px-5 py-4"}`}
    >
      <div
        className={`${compact ? "text-base" : "text-xl"} font-black tracking-wide`}
      >
        {node.title}
      </div>
      <div className="mt-1 text-xs font-medium opacity-85 sm:text-sm">
        {node.subtitle}
      </div>
    </button>
  );
}

function DepartmentCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="structure-blue-card rounded-3xl border border-white/10 !bg-[#012245] p-4 text-white shadow-xl backdrop-blur-md dark:border-white/10 dark:!bg-[#012245] dark:text-white dark:shadow-2xl sm:p-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-black text-white sm:text-xl">{title}</h3>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}

export default function StructurePage() {
  const [selectedId, setSelectedId] = useState<NodeId>("ceo");
  const detailsRef = useRef<HTMLDivElement | null>(null);

  const selectedNode = nodes[selectedId];

  const handleNodeClick = (nodeId: NodeId) => {
  setSelectedId(nodeId);

  setTimeout(() => {
    if (!detailsRef.current) return;

    const rect = detailsRef.current.getBoundingClientRect();
    const absoluteTop = rect.top + window.scrollY;

    window.scrollTo({
      top: absoluteTop - window.innerHeight + rect.height + 40,
      behavior: "smooth",
    });
  }, 100);
};

  const projectIds = useMemo<NodeId[]>(() => ["rov", "float", "arm", "gs"], []);
  const technicalIds = useMemo<NodeId[]>(
    () => ["electronics", "software", "cad", "special"],
    [],
  );

  return (
    <>
      <Head>
        <title>Struttura aziendale - Scuderia DIIEM</title>
        <meta
          name="description"
          content="Organigramma interattivo della Scuderia DIIEM: direzione, marketing, operations, tecnologia, progetti e aree tecniche."
        />
      </Head>

      <style jsx global>{`
        .structure-page {
          background-color: #ffffff !important;
          color: #0f172a !important;
        }

        .structure-page main,
        .structure-page .structure-section {
          background-color: #ffffff !important;
          color: #0f172a !important;
        }

        .structure-page .structure-title {
          color: #012245 !important;
        }

        .structure-page .structure-description {
          color: #334155 !important;
        }

        .structure-page .structure-blue-card,
        .structure-page .structure-blue-card *:not(.text-accent) {
          color: #ffffff !important;
        }

        .dark .structure-page {
          background-color: #012245 !important;
          color: #ffffff !important;
        }

        .dark .structure-page main,
        .dark .structure-page .structure-section {
          background-color: #012245 !important;
          color: #ffffff !important;
        }

        .dark .structure-page .structure-title,
        .dark .structure-page .structure-description {
          color: #ffffff !important;
        }
      `}</style>

      <div className="structure-page min-h-screen !bg-white text-slate-950 dark:!bg-primary dark:text-white">
        <Header />

        <main>
          <section className="structure-section !bg-white pt-28 pb-12 text-slate-950 dark:!bg-primary dark:text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-accent">
                  Organizzazione interna
                </p>
                <h1 className="structure-title font-display text-4xl font-black md:text-5xl">
                  Struttura aziendale
                </h1>
                <p className="structure-description mx-auto mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">
                  La Scuderia DIIEM è organizzata in aree operative e tecniche
                  che collaborano tra loro: direzione strategica, comunicazione,
                  gestione interna e sviluppo tecnologico dei progetti.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="structure-section !bg-white pb-16 text-slate-950 dark:!bg-primary dark:text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <motion.div
                className="structure-blue-card rounded-[2rem] border border-white/10 !bg-[#012245] p-4 shadow-xl backdrop-blur-md dark:border-white/10 dark:!bg-[#003366] dark:shadow-2xl sm:p-6 lg:p-8"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {/* CEO */}
                <div className="flex justify-center">
                  <motion.div
                    className="w-full max-w-xs"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45 }}
                  >
                    <NodeButton
                      id="ceo"
                      selectedId={selectedId}
                      onSelect={handleNodeClick}
                    />
                  </motion.div>
                </div>

                <div className="mx-auto my-6 h-10 w-0.5 bg-accent/80" />

                {/* Aree principali */}
                <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.75fr]">
                  <DepartmentCard
                    title="Marketing e comunicazione"
                    subtitle=""
                  >
                    <div className="space-y-4">
                      <NodeButton
                        id="cmo"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                      />
                      <div className="ml-8 h-6 w-0.5 bg-white/25" />
                      <NodeButton
                        id="marketing"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                        compact
                      />
                      <div className="ml-8 h-6 w-0.5 bg-white/25" />
                      <NodeButton
                        id="photo"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                        compact
                      />
                    </div>
                  </DepartmentCard>

                  <DepartmentCard title="Gestione operativa" subtitle="">
                    <div className="space-y-4">
                      <NodeButton
                        id="coo"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                      />
                      <div className="ml-8 h-6 w-0.5 bg-white/25" />
                      <NodeButton
                        id="operations"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                        compact
                      />
                    </div>
                  </DepartmentCard>

                  <DepartmentCard
                    title="Tecnologia, progetti e aree specialistiche"
                    subtitle=""
                  >
                    <div className="space-y-5">
                      <NodeButton
                        id="cto"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <div className="mb-3 rounded-full border border-white/10 !bg-white/10 px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-white shadow-sm dark:border-white/10 dark:!bg-white/10 dark:text-white">
                            Progetti
                          </div>
                          <div className="space-y-3">
                            {projectIds.map((id) => (
                              <NodeButton
                                key={id}
                                id={id}
                                selectedId={selectedId}
                                onSelect={handleNodeClick}
                                compact
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="mb-3 rounded-full border border-white/10 !bg-white/10 px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-white shadow-sm dark:border-white/10 dark:!bg-white/10 dark:text-white">
                            Aree tecniche
                          </div>
                          <div className="space-y-3">
                            {technicalIds.map((id) => (
                              <NodeButton
                                key={id}
                                id={id}
                                selectedId={selectedId}
                                onSelect={handleNodeClick}
                                compact
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </DepartmentCard>
                </div>
              </motion.div>

              {/* Pannello descrittivo */}
              <motion.div
                className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <div
                  ref={detailsRef}
                  className="structure-blue-card scroll-mt-28 rounded-3xl border border-white/10 !bg-[#012245] p-6 text-white shadow-xl backdrop-blur-md dark:border-white/10 dark:!bg-[#003366] dark:text-white"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
                    Elemento selezionato
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedNode.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4"
                    >
                      <h2 className="font-display text-3xl font-black text-white">
                        {selectedNode.title}
                      </h2>
                      <p className="mt-1 text-accent">
                        {selectedNode.subtitle}
                      </p>
                      <p className="mt-4 leading-relaxed text-white/80">
                        {selectedNode.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="structure-blue-card rounded-3xl border border-white/10 !bg-[#012245] p-6 text-white shadow-xl backdrop-blur-md dark:border-white/10 dark:!bg-[#003366] dark:text-white">
                  <h3 className="font-display text-2xl font-black text-white">
                    Responsabilità principali
                  </h3>
                  <AnimatePresence mode="wait">
                    <motion.ul
                      key={selectedNode.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 grid gap-3 sm:grid-cols-2"
                    >
                      {selectedNode.responsibilities.map((item) => (
                        <li
                          key={item}
                          className="rounded-2xl border border-white/10 !bg-white/10 px-4 py-3 text-sm text-white/85 shadow-sm dark:border-white/10 dark:!bg-white/10 dark:text-white/85"
                        >
                          <span className="mr-2 text-accent">•</span>
                          {item}
                        </li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

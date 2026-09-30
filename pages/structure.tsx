import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import teamMembersData from "@/data/team-members.json";
import Modal from "@/components/UI/Modal";
import MemberSkills from "@/components/UI/MemberSkills";

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
  | "mechanics"
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
    colorClass: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white",
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
    colorClass: "bg-gradient-to-br from-emerald-600 to-emerald-800 text-white",
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
    colorClass: "bg-gradient-to-br from-cyan-600 to-cyan-800 text-white",
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
    colorClass: "bg-gradient-to-br from-orange-600 to-orange-800 text-white",
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
    colorClass: "bg-gradient-to-br from-orange-600 to-orange-800 text-white",
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
    colorClass: "bg-gradient-to-br from-orange-600 to-orange-800 text-white",
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
    colorClass: "bg-gradient-to-br from-orange-600 to-orange-800 text-white",
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
    colorClass: "bg-gradient-to-br from-red-600 to-red-800 text-white",
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
    colorClass: "bg-gradient-to-br from-red-600 to-red-800 text-white",
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
    colorClass: "bg-gradient-to-br from-red-600 to-red-800 text-white",
    activeClass: "ring-red-400",
  },
  mechanics: {
    id: "mechanics",
    title: "Meccanica",
    subtitle: "Strutture e componenti",
    description:
      "Area tecnica dedicata alla progettazione, realizzazione e integrazione delle strutture e dei componenti meccanici dei progetti.",
    responsibilities: [
      "Progettazione di strutture e componenti",
      "Assiemi e lavorazioni meccaniche",
      "Integrazione dei sottosistemi",
      "Test e manutenzione dei prototipi",
    ],
    colorClass: "bg-gradient-to-br from-red-600 to-red-800 text-white",
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
    colorClass: "bg-gradient-to-br from-orange-600 to-orange-800 text-white",
    activeClass: "ring-orange-400",
  },
};

const teamMembers = Array.isArray(teamMembersData) ? teamMembersData : [];
type TeamMember = (typeof teamMembers)[number];
const MemberSelectionContext = createContext<(member: TeamMember) => void>(() => undefined);
const ShowMembersContext = createContext(false);

function getNodeMembers(id: NodeId) {
  const technicalAreas: Partial<Record<NodeId, string[]>> = {
    electronics: ["Elettronica", "Electronics&Informatics"],
    software: ["Informatica", "Electronics&Informatics"],
    cad: ["CAD", "CAD&Design"],
    mechanics: ["Meccanica", "Research&Assembly"],
  };
  const projects: Partial<Record<NodeId, string[]>> = {
    rov: ["ROV"],
    float: ["FLOAT"],
    arm: ["ARM"],
    gs: ["GS", "Electronics&Informatics"],
    special: ["Tecnologie speciali", "Research&Assembly", "CAD&Design"],
  };
  const leadership: Partial<Record<NodeId, string[]>> = {
    ceo: ["CEO"],
    cto: ["CTO"],
    cmo: ["CMO"],
    coo: ["COO"],
  };
  const technicalArea = technicalAreas[id];
  const project = projects[id];
  const leadershipRole = leadership[id];
  const technicalRoles = technicalArea ?? [];
  const projectTeams = project ?? [];
  const leadershipRoles = leadershipRole ?? [];

  return teamMembers.filter((member) => {
    const roles = Array.isArray(member.role) ? member.role : [member.role];
    return Boolean(
      (technicalRoles.length > 0 && (roles.some((role) => technicalRoles.includes(role)) || (member.team !== undefined && technicalRoles.includes(member.team)))) ||
      (projectTeams.length > 0 && member.team !== undefined && projectTeams.includes(member.team)) ||
      (leadershipRoles.length > 0 && (roles.some((role) => leadershipRoles.includes(role)) || (member.team !== undefined && leadershipRoles.includes(member.team)))),
    );
  });
}

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
  const nodeMembers = getNodeMembers(id);
  const onMemberSelect = useContext(MemberSelectionContext);
  const showMembers = useContext(ShowMembersContext);
  const memberGridColumns = nodeMembers.length === 1
    ? "grid-cols-1"
    : nodeMembers.length === 2
      ? "grid-cols-2"
      : "grid-cols-4";

  const headOfNode = (member: TeamMember) => {
    if (member.headOf === "team") {
      const teamHeadNodes: Record<string, NodeId> = {
        ROV: "rov",
        FLOAT: "float",
        ARM: "arm",
        GS: "gs",
        "Research&Assembly": "special",
        "CAD&Design": "cad",
      };
      return member.team !== undefined && teamHeadNodes[member.team] === id;
    }

    if (member.headOf === "role") {
      const roles = Array.isArray(member.role) ? member.role : [member.role];
      const roleHeadNodes: Record<string, NodeId> = {
        Elettronica: "electronics",
        Informatica: "software",
        CAD: "cad",
        Meccanica: "mechanics",
      };
      return roles.some((role) => roleHeadNodes[role] === id);
    }

    return false;
  };

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.45, ease: "easeInOut" } }}
      className={`group relative z-0 w-full rounded-2xl text-left shadow-lg transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-2xl focus-within:z-20 focus-within:scale-[1.04] focus:outline-none focus:ring-4 ${node.colorClass} ${
        selected
          ? `scale-[1.02] ring-4 ${node.activeClass}`
          : "ring-1 ring-white/10"
      } ${compact ? "px-4 py-3" : "px-5 py-4"}`}
    >
      <button
        type="button"
        onClick={() => onSelect(id)}
        className="w-full text-left focus:outline-none"
      >
        <div className={`${compact ? "text-base" : "text-xl"} font-black tracking-wide`}>
          {node.title}
        </div>
        <div className="mt-1 text-xs font-medium opacity-85 sm:text-sm">
          {node.subtitle}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {showMembers && nodeMembers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`grid ${memberGridColumns} justify-items-start gap-1 overflow-hidden border-t border-white/20 pt-2`}
          >
            {nodeMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => onMemberSelect(member)}
                className={`w-fit max-w-full min-w-0 rounded-lg border px-1 py-1 text-left text-[8px] font-medium leading-tight break-words transition-colors focus:outline-none focus:ring-2 focus:ring-white/70 sm:px-1.5 sm:text-[10px] ${
                  headOfNode(member)
                    ? "border-amber-200/70 bg-amber-300/30 hover:bg-amber-300/40"
                    : "border-white/20 bg-white/10 hover:bg-white/20"
                }`}
              >
                {member.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
      className="structure-blue-card rounded-3xl border border-white/10 !bg-[#012245] p-3 text-white shadow-xl dark:border-white/10 dark:!bg-[#012245] dark:text-white dark:shadow-2xl sm:p-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="mb-3">
        <h3 className="text-lg font-black text-white sm:text-xl">{title}</h3>
        <p className="text-sm text-white/70">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}

export default function StructurePage() {
  const [selectedId, setSelectedId] = useState<NodeId>("ceo");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMembers, setShowMembers] = useState(false);
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

  const projectIds = useMemo<NodeId[]>(
    () => ["rov", "float", "arm", "gs", "special"],
    [],
  );
  const technicalIds = useMemo<NodeId[]>(
    () => ["electronics", "software", "cad", "mechanics"],
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

      <MemberSelectionContext.Provider value={setSelectedMember}>
      <ShowMembersContext.Provider value={showMembers}>
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
                className="structure-blue-card rounded-[2rem] border border-white/10 !bg-[#012245] p-4 shadow-xl dark:border-white/10 dark:!bg-[#003366] dark:shadow-2xl sm:p-6 lg:p-8"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="mb-4 flex justify-end">
                  <label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/15 sm:text-sm">
                    <span>Mostra membri</span>
                    <input
                      type="checkbox"
                      checked={showMembers}
                      onChange={(event) => setShowMembers(event.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="relative h-5 w-9 rounded-full bg-white/25 transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-white/80 after:absolute after:left-1 after:top-1 after:h-3 after:w-3 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                  </label>
                </div>

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

                <div className="mx-auto my-4 h-7 w-0.5 bg-accent/80" />

                {/* Aree principali */}
                <div className={`grid gap-4 transition-[grid-template-columns] duration-500 ease-in-out ${showMembers ? "lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.65fr)_minmax(0,2.7fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.75fr)]"}`}>
                  <DepartmentCard
                    title="Relazioni esterne"
                    subtitle=""
                  >
                    <div className="space-y-3">
                      <NodeButton
                        id="cmo"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                      />
                      <div className="ml-5 h-4 w-0.5 bg-white/25" />
                      <NodeButton
                        id="marketing"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                        compact
                      />
                      <div className="ml-5 h-4 w-0.5 bg-white/25" />
                      <NodeButton
                        id="photo"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                        compact
                      />
                    </div>
                  </DepartmentCard>

                  <DepartmentCard title="Gestione operativa" subtitle="">
                    <div className="space-y-3">
                      <NodeButton
                        id="coo"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                      />
                      <div className="ml-5 h-4 w-0.5 bg-white/25" />
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
                    <div className="space-y-4">
                      <NodeButton
                        id="cto"
                        selectedId={selectedId}
                        onSelect={handleNodeClick}
                      />

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <div className="mb-3 rounded-full border border-white/10 !bg-white/10 px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-white shadow-sm dark:border-white/10 dark:!bg-white/10 dark:text-white">
                            Progetti
                          </div>
                          <div className="space-y-2">
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
                          <div className="space-y-2">
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
      </ShowMembersContext.Provider>
      <Modal
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name || ""}
      >
        <div className="member-modal-body flex flex-col items-center gap-6 md:flex-row">
          {selectedMember && (
            <div className="member-modal-photo w-full flex-shrink-0 self-center">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-100 dark:border-white/10 dark:bg-[#071425]">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={selectedMember.image}
                    alt={selectedMember.name}
                    fill
                    className="object-cover object-center"
                    style={{ objectPosition: "center center" }}
                  />
                </div>
              </div>
              <div className="mt-3">
                {(selectedMember as any).yearsActive && (
                  <p className="mt-1 text-xs text-gray-500">Periodo di attività: {(selectedMember as any).yearsActive}</p>
                )}
              </div>
            </div>
          )}

          <div className="member-modal-info w-full">
            {selectedMember && (
              <div className="px-1 md:px-4">
                <div className="member-modal-heading-row">
                  <div>
                    <p className="text-lg font-semibold text-gray-600">
                      {selectedMember.headOf && (
                        <span className="text-lg font-semibold text-primary">
                          Head of {selectedMember.headOf === "role"
                            ? (Array.isArray(selectedMember.role) ? selectedMember.role.join(", ") : selectedMember.role)
                            : selectedMember.team}
                        </span>
                      )}
                    </p>
                    {selectedMember.headOf !== "team" && (
                      <p className="text-lg font-semibold text-gray-600">{selectedMember.team}</p>
                    )}
                    {selectedMember.headOf !== "role" && (
                      <p className="text-lg font-semibold text-gray-700">
                        {Array.isArray(selectedMember.role) ? selectedMember.role.join(", ") : selectedMember.role}
                      </p>
                    )}
                  </div>
                  <MemberSkills skills={(selectedMember as { skills?: string[] }).skills} />
                </div>
                <h4 className="mb-3 mt-4 text-lg font-bold text-primary">Contatti</h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedMember.email && (
                    <div className="flex items-start gap-3">
                      <span className="mt-1 text-primary">📧</span>
                      <a href={`mailto:${selectedMember.email}`} className="break-all text-blue-600 hover:underline">
                        {selectedMember.email}
                      </a>
                    </div>
                  )}
                  {(selectedMember as any).phone && (
                    <div className="flex items-start gap-3">
                      <span className="mt-1 text-primary">📱</span>
                      <a href={`tel:${(selectedMember as any).phone}`} className="text-blue-600 hover:underline">
                        {(selectedMember as any).phone}
                      </a>
                    </div>
                  )}
                  {(selectedMember as any).email2 && (
                    <div className="flex items-start gap-3">
                      <span className="mt-1 text-primary">✉️</span>
                      <a href={`mailto:${(selectedMember as any).email2}`} className="break-all text-blue-600 hover:underline">
                        {(selectedMember as any).email2}
                      </a>
                    </div>
                  )}
                  {(selectedMember as any).linkedin && (
                    <div className="flex items-start gap-3">
                      <span className="mt-1 text-primary">💼</span>
                      <a href={(selectedMember as any).linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {!selectedMember.email &&
                    !(selectedMember as any).phone &&
                    !(selectedMember as any).linkedin &&
                    !(selectedMember as any).email2 && (
                      <p className="italic text-gray-500">Nessun contatto disponibile</p>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
      </MemberSelectionContext.Provider>
    </>
  );
}

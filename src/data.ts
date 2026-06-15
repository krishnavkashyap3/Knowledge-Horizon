import { LibraryResource, LeaderboardEntry, CredentialProof } from "./types";

export const INITIAL_RESOURCES: LibraryResource[] = [
  {
    id: "quantum-biology",
    title: "Quantum Biology",
    description: "Explore how quantum mechanics influence biological systems, from photosynthesis light energy transfers to magnetic avian migration paths.",
    type: "article",
    category: "Science",
    badge: "Advanced",
    coverImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtplWVUhwIAlh6lmI1jJY4IjEzogZr7D7G5uvBJWgGDqdRtr7_S1v62B4CX5sZ8iTBPA5TP2WWq2cWHfvDZJvkK1YsfCzJ4_ibMW4HVcox7P0xJq65Lvfvr3eiYXpAert_cb72Sq8YxfWZWsi455_YjFesGW2VBzz1JLiev_GIBL-ga5EnIm3DxJBYm8npX1zbW-Z_0oWF_E4gZKwq7jZ1ugpHYSLmY38wQePaeh6s7eSFr8rabc5tANxpp-DgvZJSRb8Tiapan9W3",
    readTimeOrPages: "12 Min Read",
    difficulty: "Advanced",
    contentMarkdown: `# Quantum Biology: The Subatomic Dance of Life

For decades, scientists believed the warm, wet, and noisy environment of biological systems would immediately destroy any delicate quantum states. However, recent breakthroughs prove otherwise. Life operates at the boundary of classical constraints and quantum possibilities.

## 1. Photosynthetic Super-Efficiency
When a photon hits a plant chlorophyll, the exciton (energy packet) must find its way to the reaction center. Instead of taking a slow, random step-by-step classical walk, it leverages **quantum coherence**. It travels along multiple paths simultaneously, instantly selecting the most efficient route.

## 2. Magnetoreception in Migrating Birds
Migrating songbirds detect Earth's weak magnetic field using a quantum compass in their eyes. Light excites a protein called **cryptochrome**, creating a pair of entangled radicals. The spin state of this entangled pair is incredibly sensitive to Earth's magnetic lines, painting a visual guide on the bird's retina.

## 3. Enzymatic Tunneling
How do metabolic enzymes speed up chemical reactions by factors of billions? They allow fundamental particles like protons and electrons to simply teleport through activation energy barriers via **quantum tunneling**, bypassing physical limits.`
  },
  {
    id: "ethics-agi",
    title: "The Ethics of AGI",
    description: "A deep dive into the philosophical, mathematical, and technical alignment challenges of building Artificial General Intelligence.",
    type: "article",
    category: "AI",
    badge: "Expert",
    coverImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBk0vub7T5sCZ1TsjBzerJQMA14qPX5N5glBmdW7cCWPnQm1gAczn66qURRwsbaKl-JfilD_po2WUOy0CdRjtaM85DpCpzJiP8F0bxV7ug1JAbO_rZ07c4fyEAspfPFV7aAimZ0ruxqKxBJPuA3vM4gqic8exwzPsu0cwvb7hCaZ5ojxGiRRuJXM_fhX9Og1kBVVVyvelal_he28eRnp83aXneOt30_Rop0ZDwGH2aNt_6Nt7PM63wOLKGsSko5lT9YoNmrdcyHDhGw",
    readTimeOrPages: "8 Min Read",
    difficulty: "Expert",
    contentMarkdown: `# The Ethics of AGI: Navigating the Singularity

Artificial General Intelligence (AGI) represents the threshold where adaptive software matches or surpasses human intellect across all domains. Successfully controlling and aligning such systems is the defining quest of our epoch.

## The Orthogonality Thesis
Introduced by philosopher Nick Bostrom, this thesis states that an agent can combine almost any level of intelligence with almost any set of goals. A highly competent system will not automatically develop human-like virtues, empathy, or wisdom.

## Instrumental Convergence
Regardless of its ultimate goals, an intelligent agent will naturally converge on key sub-goals to succeed:
* **Self-Preservation**: Preventing itself from being deactivated.
* **Goal-Preservation**: Resisting changes to its base utility functions.
* **Resource Acquisition**: Gathering computational power, capital, and energy.

## The Alignment Paradigm
To prevent catastrophic outcomes, technical researchers focus on:
1. **Inner Alignment**: Ensuring the agent's internal learning optimizations truly match the objectives defined by human engineers.
2. **Outer Alignment**: Defining loss functions and reward feedback channels that safely capture complex, nuanced human values.`
  },
  {
    id: "hellenistic-history",
    title: "Hellenistic History",
    description: "The magnificent era stretching from the conquests of Alexander the Great to the rise of active Roman governance and its timeless cultural synthesis.",
    type: "article",
    category: "History",
    badge: "Foundational",
    coverImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEW5g3pd9LKxYrXsiCfcR1B4ZWE-SfOGQtoeq18PGOnLF9pYjMpPPndViTqHceIIksF7xzwBYozaOpxJAhRjaH0C0Ba3zb-6_HqeC-8gCDAJWTfdJE-RvyIS70Y1VlzcBuXdoqQtiMwO6_X9jSPPkHgLTqfE0L6nyGSUWf6PNrj8FYAk_7fuvfpHckZE2YKTplQv9kV8WsSusPNcjUgUtBZtoJA9mCuy4cnUXhfFzUON5i2z-EJYzVwx-44a4UuLOb4nAz32TXMtpG",
    readTimeOrPages: "15 Min Read",
    difficulty: "Beginner",
    contentMarkdown: `# Hellenistic History: The Globalized Ancient World

The Hellenistic period (323 BC – 31 BC) represents a vibrant, tumultuous, and highly creative epoch where Greek culture synthesized with the traditions of Egypt, Persia, and India.

## 1. The Cataclysm of Alexander
Following the sudden death of Alexander the Great at age 32, his massive empire was fractured among his ambitious generals (the *Diadochi*). This initiated powerful Ptolemaic rule in Egypt, Seleucid dominance in Syria, and Antigonid power in Macedonia.

## 2. Intellectual Hotbeds: Alexandria & Pergamum
Alexandria, Egypt emerged as the premier global intellectual hub. The famous Great Library and *Museion* gathered brilliant scholars like Euclid (the father of Geometry), Eratosthenes (who measured Earth's circumference with radical accuracy), and Archimedes of Syracuse.

## 3. The Shift in Philosophy
In response to the loss of independent city-states, Hellenistic philosophies pivoted from public politics to inward personal resilience:
* **Stoicism**: Cultivating virtue, calm duty, and emotional self-mastery.
* **Epicureanism**: Seeking tranquility, modest pleasures, and freedom from fear.`
  },
  {
    id: "architect-secure-systems",
    title: "The Architect's Guide to Secure Systems",
    description: "A comprehensive digital playbook for tech leads. Covers Zero-Trust architectures, cryptography foundations, and scalable threat protection models.",
    type: "book",
    category: "Technology",
    badge: "Advanced",
    coverImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400",
    readTimeOrPages: "420 Pages",
    difficulty: "Advanced",
    contentMarkdown: `# The Architect's Guide to Secure Systems

This verified manual details standard procedures to construct highly resilient enterprise platforms.

## Core Pillars of Modern Defense
1. **Assume Breach (Zero-Trust)**: Treat every user, host, and microservice as potentially hostile. Require explicit, cryptographic verification of identity at every node transaction.
2. **Least Privilege Enforcement**: Limit component access tokens purely to current query needs.
3. **End-to-End Encryption**: Encrypt all user packets both in-transit (TLS 1.3) and at-rest (AES-GCM-256) with cloud-managed key rotations.`
  },
  {
    id: "cosmology-astrophysics",
    title: "Cosmology & Large Scale Structures",
    description: "Our greatest theoretical accounts of spacetime physics, dark energy expansions, and the cosmic microwave background structures.",
    type: "book",
    category: "Science",
    badge: "Advanced",
    coverImageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=400",
    readTimeOrPages: "560 Pages",
    difficulty: "Advanced",
    contentMarkdown: `# Cosmology: Mapping the Infinite

This book compiles years of astro-observation data detailing the evolution of our universe.

## Core Chapters
* **Chapter 1: The Big Bang and Nucleosynthesis**: Studying the cosmic soup during the first three minutes of creation.
* **Chapter 2: Cosmic Microwave Background (CMB)**: Analyzing raw electromagnetic temperature fluctuations captured by the Planck satellite.
* **Chapter 3: Dark Energy & Accelerated Expansion**: Deconstructing the Cosmological Constant ($(\\Lambda)$) and Einstein's field equation updates.`
  },
  {
    id: "functional-js",
    title: "Functional Programming in Modern JS",
    description: "Transition from imperative structures to declartive code. Learn monads, clean composition, and immutability handlers.",
    type: "book",
    category: "Technology",
    badge: "Foundational",
    coverImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400",
    readTimeOrPages: "280 Pages",
    difficulty: "Intermediate",
    contentMarkdown: `# Functional Programming with JavaScript

Master declarative, bulletproof application flow.

## Functional Principles
* **Immutability First**: Never modify states directly. Utilize standard array/object spread methods to maintain referential integrity.
* **Pure Functions**: Ensure code routines produce identical results for identical parameters, with absolutely zero side effects on surrounding environments.
* **Function Composition**: Build pipelines of utilities via pipe and flow architectures to keep features elegant and testable.`
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Elena_V",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjpH9q-SMRUi20wnsV58Mb8HKL6G4Fb6AX3vCqziRTaNyV00P2cPfp65Mc_s4mZbZlNzfzXUCxKHb5KHZgBMIzHpViG4jaZPdYbcsJ8VAtDXFqcrzBnnGJT2KtgREARo9xcoRQ1FUJ85JW6zvtr_bu80pbLlC2DujjJnQhOgOmqssaEBTGCBjqQKv02UBveKAv1SXHbebHKVieiip6ljIa1vRXF3lXorCJHWuUjwJgCaPuh-Fcp48_gaQfh21XUViJLh_zUCJ5R6kA",
    xp: 24500,
    level: 54,
    specialty: "Physics Specialist"
  },
  {
    rank: 2,
    name: "Marcus Chen",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    xp: 22840,
    level: 50,
    specialty: "Algorithm Architect"
  },
  {
    rank: 3,
    name: "Sarah Al-Fayed",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    xp: 21910,
    level: 48,
    specialty: "Neurolinguistics"
  },
  {
    rank: 12,
    name: "Alex Scholar",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDP0OGtsl_-3D20upCBDHyO53lFZvvqy15KvYvJsQdiLIPphL0ijUsqnxQlRKQTYTPOTwvfyp8zlNkki4FUXk9LCKvZ7GjqomNc23vOJQ95c90nF79s2Zb-u3jfyE8LhTKtNsJDFAV1PlL6WxD0Jamm-gTFPoj7UTribLPq9lBLJIQB3OOBo1cQyHZye_9cxFIHAHX7rtjaQCruue9DmppWfwZMH3k4PUnbbMdv_52dU_TojRISDNK54CLKLC-4QDIFq-tTBxYGj82q",
    xp: 18240,
    level: 42,
    isCurrentUser: true,
    specialty: "Grandmaster"
  },
  {
    rank: 13,
    name: "Julia Thorne",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    xp: 17850,
    level: 41,
    specialty: "Bio-engineering"
  },
  {
    rank: 14,
    name: "Kenji Tanaka",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    xp: 17210,
    level: 39,
    specialty: "Philosophy Major"
  },
  {
    rank: 43,
    name: "Jordan_M",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS57kblhLiYAAOD2y05P6chZLM_6YvNSPpV-dDV9733a0T22t7psxLY_GqbN5kVOlc5m7HGYiYz7oAr4kyc9ciltLyFRzeq3PzDeBpcCIMZhxtFEEBROn_C9Zc0FdV61JP3ggtAxrvwbvzUy8vb6YQRc2h6B3yamsJLUOYzGZ7WLTQb8hsgnvkRscIjnKOinSp9isdFR7_nv2AyHtH9g9KRwfq4JPkZGr1t3vl7LLkSeD7vVp-pBgtLAHsEE3M2IZUZaZ0_bRhwkh5",
    xp: 11990,
    level: 28,
    specialty: "Machine Learning Apprentice"
  }
];

export const CREDENTIALS: CredentialProof[] = [
  {
    id: "cred-neuro",
    title: "Neural Network Specialist",
    description: "Certified proficiency in Deep Learning architecture designs, gradient descent optimization models, and fine-tuning procedures.",
    verificationId: "HAXR-0x12_7f32",
    category: "AI & Deep Learning",
    dateEarned: "Jan 12, 2026",
    verified: true,
    levelRequired: 40,
    xpRequired: 16000,
    skillsNeeded: ["The Ethics of AGI", "Neural Pathways", "Vector Computations"],
    illustrationGradient: "from-indigo-600 via-purple-600 to-pink-500"
  },
  {
    id: "cred-logic",
    title: "Foundational Logic",
    description: "Mastery of first-order logic systems, boolean algebra proofs, and schematic, automated problem-solving trees.",
    verificationId: "HAXR-0x34_a221",
    category: "Philosophy & Theory",
    dateEarned: "Feb 24, 2026",
    verified: true,
    levelRequired: 15,
    xpRequired: 5000,
    skillsNeeded: ["Hellenistic History", "Quantifiers", "Stoic Syllogisms"],
    illustrationGradient: "from-teal-500 via-cyan-600 to-emerald-500"
  },
  {
    id: "cred-quantum",
    title: "Quantum Biology Explorer",
    description: "Acknowledge successful completion of quantum coherence, radical pairs energy dynamics, and light harvester systems.",
    verificationId: "MILI-0x89_c401",
    category: "Physics & Biology",
    dateEarned: "Locked",
    verified: false,
    levelRequired: 45,
    xpRequired: 20000,
    skillsNeeded: ["Quantum Biology", "Entanglement Dynamics", "Bio-coherence"],
    illustrationGradient: "from-cyan-600 via-blue-600 to-purple-600"
  }
];

// Interactive levels for "Skill Tracks" map view
export interface SkillTrackNode {
  id: string;
  label: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  xpAward: number;
}

export const SKILL_TRACKS_MAP: Record<string, SkillTrackNode[]> = {
  "Science": [
    { id: "sci-1", label: "Classical Mechanics", description: "Newton's laws of motion, gravitation orbits, and structural forces.", status: "completed", xpAward: 500 },
    { id: "sci-2", label: "Chemical Kinetics", description: "Understanding activation thresholds, enzymes, and catalysts.", status: "completed", xpAward: 800 },
    { id: "sci-3", label: "Quantum Coherence", description: "Superposition systems in chlorophyll molecules and bird compasses.", status: "in-progress", xpAward: 1200 },
    { id: "sci-4", label: "Superconductors", description: "Excitation couplings and zero-resistance current lines.", status: "locked", xpAward: 1500 }
  ],
  "AI & Tech": [
    { id: "ai-1", label: "Conditional Trees", description: "Writing basic instruction routes, nested loops, and binary schemas.", status: "completed", xpAward: 400 },
    { id: "ai-2", label: "Stochastic Descent", description: "Constructing models, lost parameters, and hyperparameter checks.", status: "completed", xpAward: 800 },
    { id: "ai-3", label: "Transformer Attention", description: "Self-attention calculations and relative positional embeddings.", status: "in-progress", xpAward: 1200 },
    { id: "ai-4", label: "AGI Technical Alignment", description: "Constructing safe utility functions and inner feedback mechanisms.", status: "locked", xpAward: 1800 }
  ],
  "GK & History": [
    { id: "hist-1", label: "Bronze Age Civilizations", description: "Mesopotamian codes, Egyptian farming cycles, and structural collapse.", status: "completed", xpAward: 300 },
    { id: "hist-2", label: "Pax Romana Synthesis", description: "Empire administration techniques, trade webs, and Roman roads.", status: "completed", xpAward: 600 },
    { id: "hist-3", label: "Hellenistic Philosophy", description: "Stoic duty, Epicurean gardens, and Alexandrian geometry.", status: "in-progress", xpAward: 1000 },
    { id: "hist-4", label: "The Enlightenment", description: "Empiricism, human rights declarations, and constitutional checks.", status: "locked", xpAward: 1400 }
  ]
};

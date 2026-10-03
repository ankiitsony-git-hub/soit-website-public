export interface PolaroidMoment {
  id: string;
  title: string;
  hindiTitle: string;
  image: string;
  caption: string;
  moodTag: string;
  tagColor: string;
  gradient?: string;
  glowColor?: string;
  bubbleSize?: number; // Exact size requested: 255px, 175px, 150px, 205px, 255px, 280px
  floatDelay?: string;
  date: string;
  rotation?: string;
  pageNumber?: number;
}

export interface StudentQuote {
  id: string;
  name: string;
  role: string;
  branch: string;
  year: string;
  avatarSeed: string;
  avatarBg: string;
  quote: string;
  highlightText: string;
  topic: string;
}

export interface ImpactProject {
  id: string;
  title: string;
  tagline: string;
  category: "Startup" | "AI & ML" | "SIH Winner" | "Research" | "Open Source";
  team: string[];
  metrics: { label: string; value: string }[];
  techStack: string[];
  description: string;
  linkText?: string;
  statusBadge: string;
}

export interface TechArticle {
  id: string;
  title: string;
  hindiTitle: string;
  leadParagraph: string;
  bodySnippet: string;
  author: string;
  authorRole: string;
  readingTime: string;
  statBadge: { number: string; label: string };
  tags: string[];
}

export interface AchievementItem {
  id: string;
  studentName: string;
  achievement: string;
  organization: string;
  packageOrAward: string;
  category: "Placement" | "National Hackathon" | "Research Publication" | "University Rank";
  badgeIcon: string;
  year: string;
}

export interface CreativeWork {
  id: string;
  title: string;
  hindiTitle?: string;
  author: string;
  type: "Hindi Poetry" | "English Prose" | "Digital Art" | "Calligraphy";
  excerpt: string;
  fullContent?: string;
  accentBg: string;
}

// 1. KSHAN: Bubble Shot Moments (with wave progression +20px: 275px -> 195px -> 170px -> 225px -> 275px -> 300px)
export const polaroidMoments: PolaroidMoment[] = [
  {
    id: "pol-1",
    title: "Annual Tech Fest Inception",
    hindiTitle: "अध्यांत उत्सव",
    image: "/assets/GalleryImages/Adhyaant.jpeg",
    caption: "3 sleepless nights, 48 hours of debugging, 1 unforgettable trophy!",
    moodTag: "Fest Vibes",
    tagColor: "#8C7A6B",
    gradient: "linear-gradient(135deg, #8C7A6B 0%, #B8A89A 100%)",
    glowColor: "rgba(140, 122, 107, 0.55)",
    bubbleSize: 275, // Bubble 1: 255 + 20 = 275px
    floatDelay: "0s",
    date: "Spring '25",
    rotation: "-5deg",
    pageNumber: 28,
  },
  {
    id: "pol-2",
    title: "Smart India Hackathon Finals",
    hindiTitle: "राष्ट्रीय मंच पर विजय",
    image: "/assets/GalleryImages/SIH_2024.jpeg",
    caption: "Representing SOIT RGPV on the national grand finale stage.",
    moodTag: "Hackathon Rush",
    tagColor: "#8C7A6B",
    gradient: "linear-gradient(135deg, #8C7A6B 0%, #B8A89A 100%)",
    glowColor: "rgba(140, 122, 107, 0.55)",
    bubbleSize: 195, // Bubble 2: 175 + 20 = 195px
    floatDelay: "1.2s",
    date: "Dec 2024",
    rotation: "4.5deg",
    pageNumber: 26,
  },
  {
    id: "pol-3",
    title: "Induction of 2025",
    hindiTitle: "दीक्षारंभ २०२५",
    image: "/assets/GalleryImages/conference-2.jpeg",
    caption: "Welcoming the new batch of aspiring engineers into the SOIT RGPV family.",
    moodTag: "Induction Day",
    tagColor: "#8C7A6B",
    gradient: "linear-gradient(135deg, #8C7A6B 0%, #B8A89A 100%)",
    glowColor: "rgba(140, 122, 107, 0.55)",
    bubbleSize: 180, // Bubble 3: 170 + 10 = 180px
    floatDelay: "2.4s",
    date: "2025",
    rotation: "-4.2deg",
  },
  {
    id: "pol-4",
    title: "Canteen & Chai Adda",
    hindiTitle: "चाय पर चर्चा",
    image: "/assets/GalleryImages/Rangotsav.jpeg",
    caption: "Where all great startup ideas and semester survival plans are born.",
    moodTag: "Campus Chai",
    tagColor: "#8C7A6B",
    gradient: "linear-gradient(135deg, #8C7A6B 0%, #B8A89A 100%)",
    glowColor: "rgba(140, 122, 107, 0.55)",
    bubbleSize: 225, // Bubble 4: 205 + 20 = 225px
    floatDelay: "0.8s",
    date: "Every Evening",
    rotation: "5.5deg",
    pageNumber: 60,
  },
  {
    id: "pol-5",
    title: "Distinguished Guest Colloquium",
    hindiTitle: "विचार संगम",
    image: "/assets/GalleryImages/VichaarSangam.jpeg",
    caption: "Industry stalwarts sharing the cutting-edge of quantum & AI.",
    moodTag: "Lab Life",
    tagColor: "#8C7A6B",
    gradient: "linear-gradient(135deg, #8C7A6B 0%, #B8A89A 100%)",
    glowColor: "rgba(140, 122, 107, 0.55)",
    bubbleSize: 275, // Bubble 5: 255 + 20 = 275px
    floatDelay: "1.8s",
    date: "Nov 2024",
    rotation: "-5.8deg",
    pageNumber: 26,
  },
  {
    id: "pol-6",
    title: "TCS & Capgemini Placement Day",
    hindiTitle: "सफलता के पल",
    image: "/assets/GalleryImages/TCSDrive.jpeg",
    caption: "The smiles of accomplishment as offer letters roll in.",
    moodTag: "Convocation Day",
    tagColor: "#8C7A6B",
    gradient: "linear-gradient(135deg, #8C7A6B 0%, #B8A89A 100%)",
    glowColor: "rgba(140, 122, 107, 0.55)",
    bubbleSize: 300, // Bubble 6: 280 + 20 = 300px
    floatDelay: "3s",
    date: "Oct 2024",
    rotation: "3.8deg",
    pageNumber: 8,
  },
  {
    id: "pol-7",
    title: "Events of Clubs",
    hindiTitle: "क्लब गतिविधियाँ",
    image: "/assets/GalleryImages/events-of-clubs.png",
    caption: "Empowering innovation, leadership, and technical excellence through vibrant club activities and IEEE chapters.",
    moodTag: "Club Life",
    tagColor: "#8C7A6B",
    gradient: "linear-gradient(135deg, #8C7A6B 0%, #B8A89A 100%)",
    glowColor: "rgba(140, 122, 107, 0.55)",
    bubbleSize: 260,
    floatDelay: "2.1s",
    date: "2025-26",
    rotation: "-3.5deg",
    pageNumber: 46,
  },
];

// 2. SWAR: Student Voices
export const studentVoices: StudentQuote[] = [
  {
    id: "quote-1",
    name: "Aman Sharma",
    role: "AI/ML Lead, Batch '25",
    branch: "B.Tech Information Technology",
    year: "Final Year",
    avatarSeed: "AS",
    avatarBg: "linear-gradient(135deg, #7A1229, #CB2D4C)",
    quote:
      "SOIT gave us the freedom to break code in the lab until we built systems that actually scaled. Bodhika is proof that our curiosity wasn't in vain.",
    highlightText: "freedom to break code until we built systems that scaled",
    topic: "Engineering Culture",
  },
  {
    id: "quote-2",
    name: "Soumya Singh",
    role: "SIH Grand Finalist & Open Source Contributor",
    branch: "B.Tech Computer Science & IT",
    year: "Third Year",
    avatarSeed: "SS",
    avatarBg: "linear-gradient(135deg, #CB2D4C, #F48B30)",
    quote:
      "The transition from writing your first syntax to pitching a live patent-pending idea to VC juries in Bhopal happened right between these brick corridors.",
    highlightText: "from first syntax to pitching patent-pending ideas",
    topic: "Innovation Journey",
  },
  {
    id: "quote-3",
    name: "Priyanshu Verma",
    role: "President, SOIT Coding Club",
    branch: "B.Tech Information Technology",
    year: "Final Year",
    avatarSeed: "PV",
    avatarBg: "linear-gradient(135deg, #8B1D32, #E54F38)",
    quote:
      "Technology is only as profound as the human problem it solves. Our professors taught us to engineer with empathy, not just efficiency.",
    highlightText: "engineer with empathy, not just efficiency",
    topic: "Tech Philosophy",
  },
  {
    id: "quote-4",
    name: "Ananya Dixit",
    role: "Editor, Bodhika Literary Wing",
    branch: "B.Tech IT",
    year: "Second Year",
    avatarSeed: "AD",
    avatarBg: "linear-gradient(135deg, #B92B48, #FBB940)",
    quote:
      "In a campus obsessed with algorithms, Bodhika is where our poets, artists, and storytellers prove that engineers have the most colorful minds.",
    highlightText: "engineers have the most colorful minds",
    topic: "Creative Spirit",
  },
];

// 3. SANKALP: Ideas to Impact Projects
export const impactProjects: ImpactProject[] = [
  {
    id: "proj-1",
    title: "MedVani: Indic Healthcare LLM",
    tagline: "Voice-driven EHR assistant for rural primary healthcare centers across MP.",
    category: "SIH Winner",
    team: ["Aditya Joshi", "Rohan Patel", "Sneha Roy", "Prof. Guide"],
    metrics: [
      { label: "Accuracy", value: "94.2%" },
      { label: "Languages", value: "8 Indic Dialects" },
      { label: "Grant Award", value: "₹1,00,000" },
    ],
    techStack: ["PyTorch", "Whisper AI", "FastAPI", "React Native"],
    description:
      "Converts doctor-patient rural consultations in Bundelkhandi & Malwi into structured HL7 FHIR clinical records in real-time.",
    statusBadge: "National Winner",
  },
  {
    id: "proj-2",
    title: "CyberShield RGPV: Autonomous Threat Sentinel",
    tagline: "AI-powered Intrusion Detection System built for university networks.",
    category: "Research",
    team: ["Kavya Nair", "Tushar Gupta"],
    metrics: [
      { label: "Detection Speed", value: "<12ms" },
      { label: "False Positives", value: "0.03%" },
      { label: "Citations", value: "IEEE '24" },
    ],
    techStack: ["eBPF", "Kafka", "Graph Neural Networks", "Go"],
    description:
      "Analyzes encrypted zero-day traffic across campus subnets without decrypting student packet payloads.",
    statusBadge: "Published in IEEE",
  },
  {
    id: "proj-3",
    title: "KisanDrishti: AgriTech Drone Vision",
    tagline: "Edge-AI multispectral crop blight diagnosis for Central Indian agriculture.",
    category: "Startup",
    team: ["Devansh Mishra", "Mayank Soni", "Ayushi Jain"],
    metrics: [
      { label: "Hectares Mapped", value: "450+" },
      { label: "Farmer Adoption", value: "120+ Farms" },
      { label: "Seed Funding", value: "Incubated" },
    ],
    techStack: ["YOLOv10", "TensorRT", "DJI SDK", "Next.js"],
    description:
      "Detects soybean yellow mosaic virus 6 days before visual human inspection using affordable drone cameras.",
    statusBadge: "Incubated at RGPV TBI",
  },
  {
    id: "proj-4",
    title: "CampusFlow: Decentralized Micro-Credentials",
    tagline: "Tamper-proof student verifiable transcripts on Polygon blockchain.",
    category: "Open Source",
    team: ["Harshwardhan Rao", "Nikhil Chouhan"],
    metrics: [
      { label: "Certificates Minted", value: "4,200+" },
      { label: "Verification Latency", value: "0.8s" },
      { label: "GitHub Stars", value: "280+" },
    ],
    techStack: ["Solidity", "IPFS", "Polygon", "Wagmi"],
    description:
      "Enables students to share cryptographic proof of hackathons, honors, and semester grades directly with employers.",
    statusBadge: "Open Source",
  },
];

// 4. BHAVISHYA: Tech & Tomorrow
export const techArticles: TechArticle[] = [
  {
    id: "tech-1",
    title: "From Silicon to Sovereignty: India’s AI Compute Revolution",
    hindiTitle: "कृत्रिम बुद्धिमत्ता और आत्मनिर्भर भारत",
    leadParagraph:
      "As sovereign AI models take center stage, the intersection of indigenous semiconductor fabrication and vernacular LLMs is redefining IT curricula.",
    bodySnippet:
      "The next decade of Indian computer science won't just be about building wrapper APIs over Silicon Valley foundation models. At SOIT RGPV, our laboratories are actively fine-tuning parameter-efficient models on regional Hindi corpuses, proving that compute efficiency and cultural fidelity can coexist.",
    author: "Dr. Faculty Lead & Research Scholars",
    authorRole: "Dept. of Information Technology",
    readingTime: "5 min read",
    statBadge: { number: "10x", label: "Cost Reduction via LoRA" },
    tags: ["Generative AI", "Indic LLM", "Compute"],
  },
  {
    id: "tech-2",
    title: "Zero-Trust Architecture in Public Cloud Infrastructure",
    hindiTitle: "सुरक्षित डिजिटल भारत",
    leadParagraph:
      "Why perimeter defenses are obsolete in an era of distributed remote compute and hyper-connected IoT nodes.",
    bodySnippet:
      "Never trust, always verify. As state and national digital registries migrate to multi-cloud ecosystems, our student research team benchmarks identity-aware micro-segmentation algorithms that prevent lateral threat movement across university endpoints.",
    author: "Student Cyber Defense Lab",
    authorRole: "Special Interest Group in Security",
    readingTime: "4 min read",
    statBadge: { number: "99.98%", label: "Zero-Trust Accuracy" },
    tags: ["Cybersecurity", "Zero Trust", "Cloud"],
  },
  {
    id: "tech-3",
    title: "Quantum Key Distribution: The Post-RSA Cryptography Era",
    hindiTitle: "क्वांटम संगणना का प्रभात",
    leadParagraph:
      "Preparing institutional security protocols before Shor’s algorithm challenges legacy asymmetric encryption.",
    bodySnippet:
      "With quantum annealers and superconducting qubits scaling rapidly, the cryptographic primitives safeguarding today's banking and defence networks must evolve. Our honors track explores lattice-based cryptography implementations.",
    author: "Theoretical Computer Science Wing",
    authorRole: "SOIT Research Group",
    readingTime: "6 min read",
    statBadge: { number: "PQ-NIST", label: "Standardized Ciphers" },
    tags: ["Quantum Tech", "Cryptography", "Algorithms"],
  },
];

// 5. GAURAV: Achievements
export const achievementsList: AchievementItem[] = [
  {
    id: "ach-1",
    studentName: "Aditya Jain",
    achievement: "Software Development Engineer",
    organization: "Amazon AWS",
    packageOrAward: "44.14 LPA",
    category: "Placement",
    badgeIcon: "💎",
    year: "2025",
  },
  {
    id: "ach-2",
    studentName: "Team BodhiBytes (6 Members)",
    achievement: "1st Prize - Ministry of Education Category",
    organization: "Smart India Hackathon 2024",
    packageOrAward: "₹1,00,000 Cash Prize",
    category: "National Hackathon",
    badgeIcon: "🏆",
    year: "2024",
  },
  {
    id: "ach-3",
    studentName: "Ritika Malviya",
    achievement: "Product Systems Engineer",
    organization: "Razorpay",
    packageOrAward: "28.5 LPA",
    category: "Placement",
    badgeIcon: "🚀",
    year: "2025",
  },
  {
    id: "ach-4",
    studentName: "Shashank Tiwari",
    achievement: "Best Student Research Paper Award",
    organization: "IEEE International Conf. on Computing",
    packageOrAward: "Gold Medal & Citation",
    category: "Research Publication",
    badgeIcon: "📜",
    year: "2024",
  },
  {
    id: "ach-5",
    studentName: "Pooja Kushwaha",
    achievement: "University Rank 1 (Gold Medalist)",
    organization: "RGPV University Examination",
    packageOrAward: "Chancellor's Gold Medal",
    category: "University Rank",
    badgeIcon: "🥇",
    year: "2024",
  },
  {
    id: "ach-6",
    studentName: "Mohit Verma & Team",
    achievement: "Winner - Central India Cyber Challenge",
    organization: "CERT-In & MP Police Hackathon",
    packageOrAward: "Trophy & Fellowship",
    category: "National Hackathon",
    badgeIcon: "🛡️",
    year: "2025",
  },
];

// 6. SRIJAN: Creative Corner
export const creativeWorks: CreativeWork[] = [
  {
    id: "art-1",
    title: "रातों की कोड पंक्तियाँ (Lines of Late Night Code)",
    hindiTitle: "काव्य संकलन",
    author: "हर्षित पाठक (B.Tech IT '26)",
    type: "Hindi Poetry",
    excerpt: `जब बुझ जाती हैं शहर की सारी बत्तियां,
मेरी स्क्रीन पर जलती हैं कुछ उम्मीद की बत्तियां।
एक सेमीकोलन के पीछे छुपी है सारी रात,
मशीन समझती है जब दिल की हर बात।
हम सिर्फ प्रोग्रामर नहीं, नए युग के शिल्पकार हैं,
शून्य और एक से रचते हम नया संसार हैं।`,
    accentBg: "linear-gradient(135deg, #FFF6F7 0%, #FEE8EC 100%)",
  },
  {
    id: "art-2",
    title: "The Architecture of a Dream",
    hindiTitle: "An Essay in Solitude",
    author: "Meera Sen (B.Tech IT '25)",
    type: "English Prose",
    excerpt: `An engineer’s sketchpad is rarely clean. It is scarred with crossed-out logic gates, caffeine rings, and sudden epiphanies at 4 AM. In those messy scribbles lies the genesis of the next digital era. We do not just build systems; we build sanctuaries for thought.`,
    accentBg: "linear-gradient(135deg, #FFFDF8 0%, #FEF4E2 100%)",
  },
  {
    id: "art-3",
    title: "Bhopal Monsoons over Campus Hill",
    hindiTitle: "स्मृति चित्र",
    author: "Rituja Bhattacharya (B.Tech '27)",
    type: "Digital Art",
    excerpt: `A digital oil tribute capturing the crimson reflections of the SOIT facade through rain-drenched Gulmohar trees on the RGPV campus hillock.`,
    accentBg: "linear-gradient(135deg, #FBF6FE 0%, #F4E8FC 100%)",
  },
  {
    id: "art-4",
    title: "कुरुक्षेत्र से क्लाउड तक",
    hindiTitle: "विचार दर्शन",
    author: "आकाश दुबे (B.Tech '25)",
    type: "Hindi Poetry",
    excerpt: `अर्जुन सा संधान हो, हर बग पर प्रहार हो,
विद्या की इस भूमि पर, नव चेतना का संचार हो।
ज्ञान दीप जलता रहे, बोधिका का गान हो,
सत्य, शोध और सृजन से, भारत का उत्थान हो।`,
    accentBg: "linear-gradient(135deg, #FFF9F5 0%, #FFE9DC 100%)",
  },
];

// Magazine Metadata & Archive
export const magazineIssues = [
  {
    year: "2025-26",
    edition: "Vol. IV (Current Edition)",
    theme: "Sovereign Intelligence & Human Empathy",
    pdfUrl: "/magazines/bodhika-the-soit-gazette.pdf",
    coverImg: "/magazines/bodhika-3d-upright-book.png",
    pages: 64,
    badge: "Current Issue",
  },
  {
    year: "2024-25",
    edition: "Vol. III",
    theme: "Decoding Horizons: Quantum & Cloud",
    pdfUrl: "#",
    coverImg: "/magazines/bodhika-3d-upright-book.png",
    pages: 56,
    badge: "Archive",
  },
  {
    year: "2023-24",
    edition: "Vol. II",
    theme: "The Inception of Smart Campus",
    pdfUrl: "#",
    coverImg: "/magazines/bodhika-3d-upright-book.png",
    pages: 48,
    badge: "Archive",
  },
];

export const editorialBoard = [
  { role: "Chief Patron", name: "Prof. (Dr.) Sunil Kumar", title: "Hon'ble Vice Chancellor, RGPV Bhopal" },
  { role: "Patron & Guide", name: "Prof. (Dr.) Sanjeev Sharma", title: "Director, School of Information Technology" },
  { role: "Faculty Chief Editor", name: "Dr. Shikha Agrawal", title: "Associate Professor, SOIT RGPV" },
  { role: "Student Chief Editor", name: "Aman Sharma & Soumya Singh", title: "Dept. of Information Technology" },
  { role: "Design & Layout Head", name: "Bodhika Creative Collective", title: "Student Design Council" },
];

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
// 1. KSHAN: Moments for Cascading Photo Slider & Gallery
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

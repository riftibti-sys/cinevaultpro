// Premium feature specs per streaming/subscription service.
// Matched loosely by service name (case-insensitive substring).

export type ServiceSpec = {
  quality: string;       // e.g. "4K Ultra HD + HDR"
  screens: string;       // e.g. "4 devices simultaneously"
  downloads: string;     // e.g. "Unlimited offline downloads"
  devices: string;       // e.g. "Mobile, TV, Laptop, Tablet"
  highlights: string[];  // 3-5 short USPs (Bangla + English mix ok)
  howTo: string[];       // 2-4 short "how to use" steps
};

const SPECS: Record<string, ServiceSpec> = {
  netflix: {
    quality: "4K Ultra HD + Dolby Vision · HDR10",
    screens: "৪টি device একসাথে",
    downloads: "Unlimited offline downloads",
    devices: "Mobile · Smart TV · Laptop · Tablet · Console",
    highlights: [
      "Ad-free — সম্পূর্ণ বিজ্ঞাপন মুক্ত",
      "Dolby Atmos surround sound",
      "সব Netflix Originals + latest সিরিজ",
      "Multi-language subtitles & audio",
    ],
    howTo: [
      "Payment confirm করুন",
      "Email/password পেয়ে যাবেন ১৫ মিনিটে",
      "Netflix app-এ login করে দেখা শুরু করুন",
    ],
  },
  "amazon prime": {
    quality: "4K UHD + HDR10+",
    screens: "৩টি device একসাথে",
    downloads: "Offline downloads সব titles-এ",
    devices: "Mobile · Fire TV · Smart TV · Laptop",
    highlights: [
      "Prime Video + Music + Reading",
      "Exclusive originals & Bollywood catalog",
      "Free trial এর ঝামেলা ছাড়াই",
      "X-Ray feature সব movies-এ",
    ],
    howTo: [
      "Payment complete করুন",
      "আমাদের দেওয়া account details দিয়ে login",
      "যেকোনো device থেকে stream করুন",
    ],
  },
  prime: {
    quality: "4K UHD + HDR10+",
    screens: "৩টি device একসাথে",
    downloads: "Offline downloads available",
    devices: "Mobile · Smart TV · Laptop · Tablet",
    highlights: [
      "Prime Video full library",
      "Bollywood + Hollywood + Bangla",
      "Ad-free streaming",
      "Multi-language support",
    ],
    howTo: ["Payment করুন", "Login credentials নিন", "যেকোনো device-এ দেখুন"],
  },
  spotify: {
    quality: "Very High 320 kbps",
    screens: "১ premium account (family plan available)",
    downloads: "Unlimited offline playlists",
    devices: "Mobile · Desktop · Web · Smart Speaker",
    highlights: [
      "Ad-free music",
      "যেকোনো song, unlimited skip",
      "Podcast + Audiobooks access",
      "High quality audio streaming",
    ],
    howTo: [
      "Payment confirm হলেই account active",
      "Existing Spotify app-এ login",
      "Offline mode enable করে অফলাইনেও শুনুন",
    ],
  },
  "youtube premium": {
    quality: "4K + 1080p HD সব videos",
    screens: "১ account, multiple devices",
    downloads: "Video + Music offline download",
    devices: "Mobile · TV · Laptop · Tablet",
    highlights: [
      "সম্পূর্ণ Ad-free YouTube",
      "Background play — screen off করেও চলবে",
      "YouTube Music Premium ফ্রি",
      "Picture-in-picture mode",
    ],
    howTo: [
      "Payment করুন",
      "আপনার Gmail-এ premium activate হবে",
      "Background & offline enjoy করুন",
    ],
  },
  youtube: {
    quality: "4K Ultra HD available",
    screens: "১ account সব device-এ",
    downloads: "Offline downloads",
    devices: "Mobile · TV · Laptop",
    highlights: ["Ad-free", "Background play", "YouTube Music included"],
    howTo: ["Payment", "Gmail-এ activate", "Enjoy করুন"],
  },
  "canva pro": {
    quality: "100M+ premium assets · 4K export",
    screens: "১ Pro account",
    downloads: "Unlimited high-res exports",
    devices: "Web · Mobile · Desktop app",
    highlights: [
      "১০০M+ premium images, videos, audio",
      "Background remover + Magic tools",
      "Brand kit + Content planner",
      "1TB cloud storage",
    ],
    howTo: [
      "Payment complete করুন",
      "আপনার email-এ Pro invite পাবেন",
      "Accept করলেই সব premium unlock",
    ],
  },
  canva: {
    quality: "Premium assets + 4K export",
    screens: "১ Pro account",
    downloads: "Unlimited exports",
    devices: "Web · Mobile · Desktop",
    highlights: ["Premium templates", "Background remover", "Brand kit"],
    howTo: ["Payment", "Email invite accept", "Enjoy Pro"],
  },
  chatgpt: {
    quality: "GPT-4o / GPT-5 · latest models",
    screens: "১ Plus account",
    downloads: "Unlimited chats + file uploads",
    devices: "Web · Mobile · Desktop app",
    highlights: [
      "GPT-4o, o1, latest models unlocked",
      "Image generation (DALL·E)",
      "File & PDF analysis",
      "Faster response, priority access",
    ],
    howTo: [
      "Payment confirm করুন",
      "Login credentials পান ১৫ মিনিটে",
      "chat.openai.com-এ login করুন",
    ],
  },
  "chatgpt plus": {
    quality: "GPT-4o / o1 / latest models",
    screens: "১ Plus account",
    downloads: "Unlimited usage",
    devices: "Web · Mobile · Desktop",
    highlights: [
      "সব latest AI models",
      "Priority speed",
      "Image generation & vision",
      "Advanced data analysis",
    ],
    howTo: ["Payment", "Login details নিন", "ChatGPT-এ login করে ব্যবহার করুন"],
  },
  disney: {
    quality: "4K UHD + Dolby Vision",
    screens: "৪টি device একসাথে",
    downloads: "Offline downloads",
    devices: "Mobile · TV · Laptop · Tablet",
    highlights: [
      "Disney + Marvel + Star Wars + Pixar",
      "IMAX Enhanced content",
      "Kids profile with parental control",
      "GroupWatch feature",
    ],
    howTo: ["Payment করুন", "Account details নিন", "Login করে stream করুন"],
  },
  hotstar: {
    quality: "4K UHD available",
    screens: "Multi-device support",
    downloads: "Offline downloads",
    devices: "Mobile · TV · Laptop",
    highlights: ["Live sports", "Bollywood + regional", "Disney+ content", "Ad-free tier"],
    howTo: ["Payment", "Login details", "Stream করুন"],
  },
};

const DEFAULT_SPEC: ServiceSpec = {
  quality: "Premium HD quality",
  screens: "Multi-device support",
  downloads: "Offline access",
  devices: "Mobile · TV · Laptop",
  highlights: ["Premium features unlocked", "Ad-free experience", "24/7 customer support"],
  howTo: ["Payment confirm করুন", "Account details পাবেন দ্রুত", "Login করে ব্যবহার শুরু করুন"],
};

export function getServiceSpec(name: string): ServiceSpec {
  const key = name.toLowerCase().trim();
  // exact match first
  if (SPECS[key]) return SPECS[key];
  // substring match
  for (const k of Object.keys(SPECS)) {
    if (key.includes(k) || k.includes(key)) return SPECS[k];
  }
  return DEFAULT_SPEC;
}

/* ══════════════════════════════════════════════════════
   kisorkontho/data.ts
   Central data + types for কিশোরকণ্ঠ magazine pages
══════════════════════════════════════════════════════ */

export type PaymentMethod = "bkash" | "nagad" | "rocket" | "card" | "bank"
export type PurchaseType  = "physical" | "digital"
export type ContentType   = "story" | "poem" | "science" | "islamic" | "quiz" | "art" | "travel"

export interface ContentItem {
  type:   ContentType
  title:  string
  author: string
  page:   number
}

export interface Review {
  user:    string
  rating:  number
  comment: string
}

export interface KisorkonthoIssue {
  id:                  string
  title:               string
  month:               string
  year:                number
  price:               number
  discount:            number
  finalPrice:          number
  currency:            "BDT"
  coverImage:          string
  description:         string
  pdf: {
    full:          string
    preview:       string
    isFreePreview: boolean
  }
  purchaseType:        PurchaseType[]
  stock:               number
  isAvailable:         boolean
  slug:                string
  paymentMethods:      PaymentMethod[]
  subscriptionEligible:boolean
  language:            string
  publisher: {
    name:         string
    organization: string
  }
  editor: {
    name: string
    role: string
  }
  content:  ContentItem[]
  tags:     string[]
  rating: {
    average: number
    count:   number
  }
  reviews:  Review[]
  stats: {
    views:     number
    downloads: number
    purchases: number
  }
  createdAt: string
  updatedAt: string
}

/* ── helpers ── */
export const CURRENCY_SYMBOL: Record<string, string> = { BDT: "৳" }

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  bkash:  "bKash",
  nagad:  "Nagad",
  rocket: "Rocket",
  card:   "Card",
  bank:   "Bank",
}

export const CONTENT_LABELS: Record<ContentType, string> = {
  story:   "গল্প",
  poem:    "কবিতা",
  science: "বিজ্ঞান",
  islamic: "ইসলাম",
  quiz:    "কুইজ",
  art:     "শিল্পকলা",
  travel:  "ভ্রমণ",
}

export const CONTENT_COLORS: Record<ContentType, string> = {
  story:   "#4ade80",
  poem:    "#c084fc",
  science: "#60a5fa",
  islamic: "#fbbf24",
  quiz:    "#fb923c",
  art:     "#f472b6",
  travel:  "#2dd4bf",
}

export function paymentLabel(m: PaymentMethod) { return PAYMENT_LABELS[m] ?? m }
export function contentLabel(t: ContentType)   { return CONTENT_LABELS[t]   ?? t }
export function contentColor(t: ContentType)   { return CONTENT_COLORS[t]   ?? "#94a3b8" }

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
export const KISORKONTHO_ISSUES: KisorkonthoIssue[] = [
  {
    id: "kk-2026-03",
    title: "কিশোরকণ্ঠ — মার্চ ২০২৬",
    month: "মার্চ", year: 2026,
    price: 50, discount: 10, finalPrice: 45, currency: "BDT",
    coverImage: "https://wafilife-media.wafilife.com/uploads/2026/03/kishor-kontho-cover.png",
    description: "মার্চ সংখ্যায় রয়েছে মহাকাশের রহস্যময় জগৎ, মুক্তিযুদ্ধের অনুপ্রেরণামূলক গল্প, বিজ্ঞান কুইজ এবং আরও অনেক কিছু।",
    pdf: { full: "https://example.com/pdf/kk-march-2026.pdf", preview: "https://example.com/pdf/preview-march-2026.pdf", isFreePreview: true },
    purchaseType: ["physical", "digital"],
    stock: 30, isAvailable: true,
    slug: "kishorkontho-march-2026",
    paymentMethods: ["bkash", "nagad", "rocket"],
    subscriptionEligible: true, language: "Bangla",
    publisher: { name: "কিশোরকণ্ঠ প্রকাশনা", organization: "বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor: { name: "মোঃ জহিরুল ইসলাম", role: "Editor" },
    content: [
      { type:"story",   title:"স্বপ্নের পথে",    author:"রাহেলা বেগম",    page:5  },
      { type:"poem",    title:"আমার দেশ",         author:"কাজী নজরুল",    page:12 },
      { type:"science", title:"মহাকাশ রহস্য",    author:"ড. আমির হোসেন",  page:20 },
      { type:"islamic", title:"রমজানের ফজিলত",   author:"মাওলানা সাঈদ",  page:28 },
    ],
    tags: ["science","story","islamic","education"],
    rating: { average: 4.6, count: 120 },
    reviews: [
      { user:"Rahim",   rating:5, comment:"খুব সুন্দর একটি সংখ্যা, প্রতিটি লেখা অসাধারণ।" },
      { user:"Fatema",  rating:4, comment:"বিজ্ঞান অংশটা আমার খুব পছন্দ হয়েছে।" },
    ],
    stats: { views:1200, downloads:300, purchases:150 },
    createdAt:"2026-03-01", updatedAt:"2026-03-05",
  },
  {
    id: "kk-2026-02",
    title: "কিশোরকণ্ঠ — ফেব্রুয়ারি ২০২৬",
    month: "ফেব্রুয়ারি", year: 2026,
    price: 50, discount: 0, finalPrice: 50, currency: "BDT",
    coverImage: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Kishorkantha_February_2026-KishorKantho-860f8-536295.jpg",
    description: "ভাষা আন্দোলনের মাসে একুশের চেতনায় ভরপুর বিশেষ সংখ্যা। ইতিহাস, কবিতা, গল্প ও বিজ্ঞানের সমন্বয়।",
    pdf: { full:"https://example.com/pdf/kk-feb-2026.pdf", preview:"https://example.com/pdf/preview-feb-2026.pdf", isFreePreview:true },
    purchaseType: ["physical","digital"],
    stock: 15, isAvailable: true,
    slug: "kishorkontho-february-2026",
    paymentMethods: ["bkash","nagad","card"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"story",   title:"একুশের ভোর",        author:"সালেহা খানম",    page:6  },
      { type:"poem",    title:"মায়ের ভাষা",         author:"হাসান রাজা",     page:14 },
      { type:"science", title:"কৃত্রিম বুদ্ধিমত্তা",author:"ড. করিম সাহেব",  page:22 },
      { type:"quiz",    title:"ভাষা আন্দোলন কুইজ", author:"সম্পাদনা পর্ষদ", page:35 },
    ],
    tags:["language","history","science","poem"],
    rating:{ average:4.8, count:200 },
    reviews:[
      { user:"Karim",  rating:5, comment:"একুশের বিশেষ সংখ্যা সত্যিই অনন্য।" },
    ],
    stats:{ views:2100, downloads:500, purchases:280 },
    createdAt:"2026-02-01", updatedAt:"2026-02-04",
  },
  {
    id:"kk-2026-01",
    title:"কিশোরকণ্ঠ — জানুয়ারি ২০২৬",
    month:"জানুয়ারি", year:2026,
    price:50, discount:20, finalPrice:40, currency:"BDT",
    coverImage:"https://wafilife-media.wafilife.com/uploads/2026/01/WhatsApp-Image-2026-01-14-at-6.24.17-PM.jpeg",
    description:"নতুন বছরে নতুন স্বপ্ন নিয়ে প্রকাশিত জানুয়ারি সংখ্যা। ভ্রমণকাহিনী, বিজ্ঞান গল্প ও ইসলামী শিক্ষামূলক লেখা।",
    pdf:{ full:"https://example.com/pdf/kk-jan-2026.pdf", preview:"https://example.com/pdf/preview-jan-2026.pdf", isFreePreview:false },
    purchaseType:["physical"],
    stock:0, isAvailable:false,
    slug:"kishorkontho-january-2026",
    paymentMethods:["bkash","rocket"],
    subscriptionEligible:false, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"travel",  title:"সুন্দরবন ভ্রমণ",    author:"মোস্তফা কামাল",  page:8  },
      { type:"story",   title:"নতুন বছরের সূচনা",  author:"নাসরিন আক্তার",  page:16 },
      { type:"islamic", title:"নতুন বছরে সংকল্প",  author:"মুফতি আমিন",     page:24 },
      { type:"art",     title:"রঙিন পৃথিবী",        author:"শিল্পী রহিম",    page:30 },
    ],
    tags:["travel","art","islamic","newyear"],
    rating:{ average:4.3, count:90 },
    reviews:[
      { user:"Nadia",  rating:4, comment:"ভ্রমণকাহিনীটা অসাধারণ ছিল।" },
    ],
    stats:{ views:800, downloads:120, purchases:95 },
    createdAt:"2026-01-01", updatedAt:"2026-01-03",
  },
  {
    id:"kk-2025-12",
    title:"কিশোরকণ্ঠ — ডিসেম্বর ২০২৫",
    month:"ডিসেম্বর", year:2025,
    price:50, discount:15, finalPrice:42, currency:"BDT",
    coverImage:"https://wafilife-media.wafilife.com/uploads/2025/12/IMG-20251202-WA0032.jpg",
    description:"বিজয়ের মাসে বিশেষ সংখ্যা। মুক্তিযুদ্ধের বীরত্বগাথা, দেশপ্রেমের কবিতা এবং বিজ্ঞান ও প্রযুক্তির অগ্রযাত্রা।",
    pdf:{ full:"https://example.com/pdf/kk-dec-2025.pdf", preview:"https://example.com/pdf/preview-dec-2025.pdf", isFreePreview:true },
    purchaseType:["physical","digital"],
    stock:50, isAvailable:true,
    slug:"kishorkontho-december-2025",
    paymentMethods:["bkash","nagad","rocket","card"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"story",   title:"বীরের গল্প",          author:"রেজাউল করিম",    page:5  },
      { type:"poem",    title:"বিজয়ের গান",          author:"মাহমুদ কবির",    page:11 },
      { type:"science", title:"প্রযুক্তির ভবিষ্যৎ",  author:"ড. তানভীর",      page:18 },
      { type:"islamic", title:"সত্যিকারের বিজয়",    author:"মাওলানা হাফিজ",  page:26 },
    ],
    tags:["victory","history","technology","poem"],
    rating:{ average:4.9, count:310 },
    reviews:[
      { user:"Hassan",   rating:5, comment:"বিজয়ের মাসে এই সংখ্যাটি একটি অমূল্য উপহার।" },
      { user:"Sumaiya",  rating:5, comment:"প্রতিটি লেখা হৃদয় স্পর্শ করে।" },
    ],
    stats:{ views:3500, downloads:900, purchases:450 },
    createdAt:"2025-12-01", updatedAt:"2025-12-04",
  },
  {
    id:"kk-2025-11",
    title:"কিশোরকণ্ঠ — নভেম্বর ২০২৫",
    month:"নভেম্বর", year:2025,
    price:50, discount:0, finalPrice:50, currency:"BDT",
    coverImage:"https://wafilife-media.wafilife.com/uploads/2025/11/IMG-20251103-WA0034-250x372.jpg",
    description:"জ্ঞান ও অনুপ্রেরণার মাসে পরিবেশ, বিজ্ঞান, কবিতা ও গল্পের অসাধারণ সমন্বয়।",
    pdf:{ full:"https://example.com/pdf/kk-nov-2025.pdf", preview:"https://example.com/pdf/preview-nov-2025.pdf", isFreePreview:true },
    purchaseType:["physical","digital"],
    stock:22, isAvailable:true,
    slug:"kishorkontho-november-2025",
    paymentMethods:["bkash","nagad"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"science", title:"পরিবেশ বাঁচাও",      author:"ড. রুহুল আমিন",  page:7  },
      { type:"story",   title:"স্বপ্নের ডাক্তার",   author:"লতিফা হোসেন",    page:15 },
      { type:"quiz",    title:"বিজ্ঞান কুইজ",        author:"সম্পাদনা পর্ষদ", page:28 },
      { type:"poem",    title:"শিশিরের গান",          author:"কামরুল ইসলাম",   page:32 },
    ],
    tags:["environment","science","quiz"],
    rating:{ average:4.4, count:75 },
    reviews:[
      { user:"Roni", rating:4, comment:"বিজ্ঞান কুইজ অংশটা আমার সবচেয়ে ভালো লেগেছে।" },
    ],
    stats:{ views:950, downloads:180, purchases:110 },
    createdAt:"2025-11-01", updatedAt:"2025-11-03",
  },
  {
    id:"kk-2025-10",
    title:"কিশোরকণ্ঠ — অক্টোবর ২০২৫",
    month:"অক্টোবর", year:2025,
    price:50, discount:5, finalPrice:47, currency:"BDT",
    coverImage:"https://rokbucket.rokomari.io/ProductNew20190903/260X372/Kishorkontho_July_2025-KishorKantho-40ee6-478504.jpg",
    description:"শরতের আলোয় রঙিন এই সংখ্যায় রয়েছে উৎসব, ঐতিহ্য, বিজ্ঞান আবিষ্কার ও ইসলামী মূল্যবোধের গল্প।",
    pdf:{ full:"https://example.com/pdf/kk-oct-2025.pdf", preview:"https://example.com/pdf/preview-oct-2025.pdf", isFreePreview:false },
    purchaseType:["physical"],
    stock:8, isAvailable:true,
    slug:"kishorkontho-october-2025",
    paymentMethods:["bkash","rocket","bank"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"story",   title:"উৎসবের আনন্দ",      author:"সাজিয়া ইসলাম",  page:4  },
      { type:"science", title:"সৌরজগতের রহস্য",    author:"ড. মাসুদ রানা",  page:13 },
      { type:"islamic", title:"ইসলামে উৎসব",        author:"মাওলানা নাসির",  page:21 },
      { type:"art",     title:"রঙের উৎসব",          author:"শিল্পী সুমাইয়া", page:29 },
    ],
    tags:["festival","science","art","tradition"],
    rating:{ average:4.5, count:115 },
    reviews:[
      { user:"Arif", rating:5, comment:"শরতের সংখ্যাটি সত্যিই সুন্দর।" },
    ],
    stats:{ views:1050, downloads:220, purchases:130 },
    createdAt:"2025-10-01", updatedAt:"2025-10-03",
  },
  {
    id: "kk-2026-03",
    title: "কিশোরকণ্ঠ — মার্চ ২০২৬",
    month: "মার্চ", year: 2026,
    price: 50, discount: 10, finalPrice: 45, currency: "BDT",
    coverImage: "https://wafilife-media.wafilife.com/uploads/2026/03/kishor-kontho-cover.png",
    description: "মার্চ সংখ্যায় রয়েছে মহাকাশের রহস্যময় জগৎ, মুক্তিযুদ্ধের অনুপ্রেরণামূলক গল্প, বিজ্ঞান কুইজ এবং আরও অনেক কিছু।",
    pdf: { full: "https://example.com/pdf/kk-march-2026.pdf", preview: "https://example.com/pdf/preview-march-2026.pdf", isFreePreview: true },
    purchaseType: ["physical", "digital"],
    stock: 30, isAvailable: true,
    slug: "kishorkontho-march-2026",
    paymentMethods: ["bkash", "nagad", "rocket"],
    subscriptionEligible: true, language: "Bangla",
    publisher: { name: "কিশোরকণ্ঠ প্রকাশনা", organization: "বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor: { name: "মোঃ জহিরুল ইসলাম", role: "Editor" },
    content: [
      { type:"story",   title:"স্বপ্নের পথে",    author:"রাহেলা বেগম",    page:5  },
      { type:"poem",    title:"আমার দেশ",         author:"কাজী নজরুল",    page:12 },
      { type:"science", title:"মহাকাশ রহস্য",    author:"ড. আমির হোসেন",  page:20 },
      { type:"islamic", title:"রমজানের ফজিলত",   author:"মাওলানা সাঈদ",  page:28 },
    ],
    tags: ["science","story","islamic","education"],
    rating: { average: 4.6, count: 120 },
    reviews: [
      { user:"Rahim",   rating:5, comment:"খুব সুন্দর একটি সংখ্যা, প্রতিটি লেখা অসাধারণ।" },
      { user:"Fatema",  rating:4, comment:"বিজ্ঞান অংশটা আমার খুব পছন্দ হয়েছে।" },
    ],
    stats: { views:1200, downloads:300, purchases:150 },
    createdAt:"2026-03-01", updatedAt:"2026-03-05",
  },
  {
    id: "kk-2026-02",
    title: "কিশোরকণ্ঠ — ফেব্রুয়ারি ২০২৬",
    month: "ফেব্রুয়ারি", year: 2026,
    price: 50, discount: 0, finalPrice: 50, currency: "BDT",
    coverImage: "https://rokbucket.rokomari.io/ProductNew20190903/260X372/Kishorkantha_February_2026-KishorKantho-860f8-536295.jpg",
    description: "ভাষা আন্দোলনের মাসে একুশের চেতনায় ভরপুর বিশেষ সংখ্যা। ইতিহাস, কবিতা, গল্প ও বিজ্ঞানের সমন্বয়।",
    pdf: { full:"https://example.com/pdf/kk-feb-2026.pdf", preview:"https://example.com/pdf/preview-feb-2026.pdf", isFreePreview:true },
    purchaseType: ["physical","digital"],
    stock: 15, isAvailable: true,
    slug: "kishorkontho-february-2026",
    paymentMethods: ["bkash","nagad","card"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"story",   title:"একুশের ভোর",        author:"সালেহা খানম",    page:6  },
      { type:"poem",    title:"মায়ের ভাষা",         author:"হাসান রাজা",     page:14 },
      { type:"science", title:"কৃত্রিম বুদ্ধিমত্তা",author:"ড. করিম সাহেব",  page:22 },
      { type:"quiz",    title:"ভাষা আন্দোলন কুইজ", author:"সম্পাদনা পর্ষদ", page:35 },
    ],
    tags:["language","history","science","poem"],
    rating:{ average:4.8, count:200 },
    reviews:[
      { user:"Karim",  rating:5, comment:"একুশের বিশেষ সংখ্যা সত্যিই অনন্য।" },
    ],
    stats:{ views:2100, downloads:500, purchases:280 },
    createdAt:"2026-02-01", updatedAt:"2026-02-04",
  },
  {
    id:"kk-2026-01",
    title:"কিশোরকণ্ঠ — জানুয়ারি ২০২৬",
    month:"জানুয়ারি", year:2026,
    price:50, discount:20, finalPrice:40, currency:"BDT",
    coverImage:"https://wafilife-media.wafilife.com/uploads/2026/01/WhatsApp-Image-2026-01-14-at-6.24.17-PM.jpeg",
    description:"নতুন বছরে নতুন স্বপ্ন নিয়ে প্রকাশিত জানুয়ারি সংখ্যা। ভ্রমণকাহিনী, বিজ্ঞান গল্প ও ইসলামী শিক্ষামূলক লেখা।",
    pdf:{ full:"https://example.com/pdf/kk-jan-2026.pdf", preview:"https://example.com/pdf/preview-jan-2026.pdf", isFreePreview:false },
    purchaseType:["physical"],
    stock:0, isAvailable:false,
    slug:"kishorkontho-january-2026",
    paymentMethods:["bkash","rocket"],
    subscriptionEligible:false, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"travel",  title:"সুন্দরবন ভ্রমণ",    author:"মোস্তফা কামাল",  page:8  },
      { type:"story",   title:"নতুন বছরের সূচনা",  author:"নাসরিন আক্তার",  page:16 },
      { type:"islamic", title:"নতুন বছরে সংকল্প",  author:"মুফতি আমিন",     page:24 },
      { type:"art",     title:"রঙিন পৃথিবী",        author:"শিল্পী রহিম",    page:30 },
    ],
    tags:["travel","art","islamic","newyear"],
    rating:{ average:4.3, count:90 },
    reviews:[
      { user:"Nadia",  rating:4, comment:"ভ্রমণকাহিনীটা অসাধারণ ছিল।" },
    ],
    stats:{ views:800, downloads:120, purchases:95 },
    createdAt:"2026-01-01", updatedAt:"2026-01-03",
  },
  {
    id:"kk-2025-12",
    title:"কিশোরকণ্ঠ — ডিসেম্বর ২০২৫",
    month:"ডিসেম্বর", year:2025,
    price:50, discount:15, finalPrice:42, currency:"BDT",
    coverImage:"https://wafilife-media.wafilife.com/uploads/2025/12/IMG-20251202-WA0032.jpg",
    description:"বিজয়ের মাসে বিশেষ সংখ্যা। মুক্তিযুদ্ধের বীরত্বগাথা, দেশপ্রেমের কবিতা এবং বিজ্ঞান ও প্রযুক্তির অগ্রযাত্রা।",
    pdf:{ full:"https://example.com/pdf/kk-dec-2025.pdf", preview:"https://example.com/pdf/preview-dec-2025.pdf", isFreePreview:true },
    purchaseType:["physical","digital"],
    stock:50, isAvailable:true,
    slug:"kishorkontho-december-2025",
    paymentMethods:["bkash","nagad","rocket","card"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"story",   title:"বীরের গল্প",          author:"রেজাউল করিম",    page:5  },
      { type:"poem",    title:"বিজয়ের গান",          author:"মাহমুদ কবির",    page:11 },
      { type:"science", title:"প্রযুক্তির ভবিষ্যৎ",  author:"ড. তানভীর",      page:18 },
      { type:"islamic", title:"সত্যিকারের বিজয়",    author:"মাওলানা হাফিজ",  page:26 },
    ],
    tags:["victory","history","technology","poem"],
    rating:{ average:4.9, count:310 },
    reviews:[
      { user:"Hassan",   rating:5, comment:"বিজয়ের মাসে এই সংখ্যাটি একটি অমূল্য উপহার।" },
      { user:"Sumaiya",  rating:5, comment:"প্রতিটি লেখা হৃদয় স্পর্শ করে।" },
    ],
    stats:{ views:3500, downloads:900, purchases:450 },
    createdAt:"2025-12-01", updatedAt:"2025-12-04",
  },
  {
    id:"kk-2025-11",
    title:"কিশোরকণ্ঠ — নভেম্বর ২০২৫",
    month:"নভেম্বর", year:2025,
    price:50, discount:0, finalPrice:50, currency:"BDT",
    coverImage:"https://wafilife-media.wafilife.com/uploads/2025/11/IMG-20251103-WA0034-250x372.jpg",
    description:"জ্ঞান ও অনুপ্রেরণার মাসে পরিবেশ, বিজ্ঞান, কবিতা ও গল্পের অসাধারণ সমন্বয়।",
    pdf:{ full:"https://example.com/pdf/kk-nov-2025.pdf", preview:"https://example.com/pdf/preview-nov-2025.pdf", isFreePreview:true },
    purchaseType:["physical","digital"],
    stock:22, isAvailable:true,
    slug:"kishorkontho-november-2025",
    paymentMethods:["bkash","nagad"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"science", title:"পরিবেশ বাঁচাও",      author:"ড. রুহুল আমিন",  page:7  },
      { type:"story",   title:"স্বপ্নের ডাক্তার",   author:"লতিফা হোসেন",    page:15 },
      { type:"quiz",    title:"বিজ্ঞান কুইজ",        author:"সম্পাদনা পর্ষদ", page:28 },
      { type:"poem",    title:"শিশিরের গান",          author:"কামরুল ইসলাম",   page:32 },
    ],
    tags:["environment","science","quiz"],
    rating:{ average:4.4, count:75 },
    reviews:[
      { user:"Roni", rating:4, comment:"বিজ্ঞান কুইজ অংশটা আমার সবচেয়ে ভালো লেগেছে।" },
    ],
    stats:{ views:950, downloads:180, purchases:110 },
    createdAt:"2025-11-01", updatedAt:"2025-11-03",
  },
  {
    id:"kk-2025-10",
    title:"কিশোরকণ্ঠ — অক্টোবর ২০২৫",
    month:"অক্টোবর", year:2025,
    price:50, discount:5, finalPrice:47, currency:"BDT",
    coverImage:"https://rokbucket.rokomari.io/ProductNew20190903/260X372/Kishorkontho_July_2025-KishorKantho-40ee6-478504.jpg",
    description:"শরতের আলোয় রঙিন এই সংখ্যায় রয়েছে উৎসব, ঐতিহ্য, বিজ্ঞান আবিষ্কার ও ইসলামী মূল্যবোধের গল্প।",
    pdf:{ full:"https://example.com/pdf/kk-oct-2025.pdf", preview:"https://example.com/pdf/preview-oct-2025.pdf", isFreePreview:false },
    purchaseType:["physical"],
    stock:8, isAvailable:true,
    slug:"kishorkontho-october-2025",
    paymentMethods:["bkash","rocket","bank"],
    subscriptionEligible:true, language:"Bangla",
    publisher:{ name:"কিশোরকণ্ঠ প্রকাশনা", organization:"বাংলাদেশ ইসলামী ছাত্রশিবির" },
    editor:{ name:"মোঃ জহিরুল ইসলাম", role:"Editor" },
    content:[
      { type:"story",   title:"উৎসবের আনন্দ",      author:"সাজিয়া ইসলাম",  page:4  },
      { type:"science", title:"সৌরজগতের রহস্য",    author:"ড. মাসুদ রানা",  page:13 },
      { type:"islamic", title:"ইসলামে উৎসব",        author:"মাওলানা নাসির",  page:21 },
      { type:"art",     title:"রঙের উৎসব",          author:"শিল্পী সুমাইয়া", page:29 },
    ],
    tags:["festival","science","art","tradition"],
    rating:{ average:4.5, count:115 },
    reviews:[
      { user:"Arif", rating:5, comment:"শরতের সংখ্যাটি সত্যিই সুন্দর।" },
    ],
    stats:{ views:1050, downloads:220, purchases:130 },
    createdAt:"2025-10-01", updatedAt:"2025-10-03",
  },
]

export function getKisorkonthoIssueBySlug(slug: string) {
  return KISORKONTHO_ISSUES.find((issue) => issue.slug === slug)
}

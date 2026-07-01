import type {
  User, Project, Thumbnail, Template, WalletTransaction,
  DashboardStats, Generation, ThumbnailCategory, ThumbnailStyle
} from "@/types"

// ─── Mock User ────────────────────────────────────────────────────────────────

export const MOCK_USER: User = {
  id: "usr_1",
  name: "Alex Creator",
  email: "alex@thumbfi.io",
  avatar_url: null,
  plan: "creator",
  thumb_balance: 12450,
  credits_used: 134,
  credits_limit: 200,
  created_at: "2024-09-15T08:00:00Z",
}

// ─── Mock Thumbnails ──────────────────────────────────────────────────────────

const GRADIENTS = [
  "from-orange-500 via-amber-500 to-yellow-400",
  "from-slate-900 to-slate-700",
  "from-blue-700 to-cyan-600",
  "from-red-600 to-rose-900",
  "from-purple-700 to-violet-900",
  "from-emerald-600 to-teal-700",
  "from-pink-600 to-rose-600",
  "from-amber-600 to-orange-700",
  "from-indigo-700 to-blue-900",
  "from-gray-800 to-gray-950",
  "from-green-600 to-emerald-800",
  "from-yellow-500 to-amber-600",
]

export const MOCK_THUMBNAILS: Thumbnail[] = [
  {
    id: "th_1", project_id: "proj_1", user_id: "usr_1",
    prompt: "Bitcoin crashes $30K shocked crypto trader",
    title: "BITCOIN CRASHES $30K", preview_gradient: GRADIENTS[0], preview_url: null,
    aspect_ratio: "16:9", style: "dramatic", category: "crypto", tone: "shocking",
    ctr_score: 94, status: "done", is_favorite: true, variation_index: 0,
    generation_id: "gen_1", created_at: "2025-06-29T10:00:00Z", updated_at: "2025-06-29T10:00:00Z",
  },
  {
    id: "th_2", project_id: "proj_1", user_id: "usr_1",
    prompt: "10X your income in 2025 financial freedom",
    title: "10X YOUR INCOME IN 2025", preview_gradient: GRADIENTS[1], preview_url: null,
    aspect_ratio: "16:9", style: "bold_text", category: "finance", tone: "inspiring",
    ctr_score: 91, status: "done", is_favorite: false, variation_index: 0,
    generation_id: "gen_2", created_at: "2025-06-28T14:30:00Z", updated_at: "2025-06-28T14:30:00Z",
  },
  {
    id: "th_3", project_id: "proj_1", user_id: "usr_1",
    prompt: "AI changed everything must watch 2025",
    title: "AI CHANGED EVERYTHING", preview_gradient: GRADIENTS[4], preview_url: null,
    aspect_ratio: "16:9", style: "dark_cinema", category: "ai_tech", tone: "shocking",
    ctr_score: 89, status: "done", is_favorite: true, variation_index: 0,
    generation_id: "gen_3", created_at: "2025-06-28T09:00:00Z", updated_at: "2025-06-28T09:00:00Z",
  },
  {
    id: "th_4", project_id: "proj_2", user_id: "usr_1",
    prompt: "Dark truth about crypto nobody talks about",
    title: "THE DARK TRUTH REVEALED", preview_gradient: GRADIENTS[9], preview_url: null,
    aspect_ratio: "16:9", style: "dramatic", category: "crypto", tone: "controversial",
    ctr_score: 96, status: "done", is_favorite: false, variation_index: 0,
    generation_id: "gen_4", created_at: "2025-06-27T16:00:00Z", updated_at: "2025-06-27T16:00:00Z",
  },
  {
    id: "th_5", project_id: "proj_2", user_id: "usr_1",
    prompt: "World record gaming speedrun attempt live",
    title: "WORLD RECORD ATTEMPT", preview_gradient: GRADIENTS[5], preview_url: null,
    aspect_ratio: "16:9", style: "bright_pop", category: "gaming", tone: "curious",
    ctr_score: 88, status: "done", is_favorite: false, variation_index: 0,
    generation_id: "gen_5", created_at: "2025-06-27T11:00:00Z", updated_at: "2025-06-27T11:00:00Z",
  },
  {
    id: "th_6", project_id: "proj_3", user_id: "usr_1",
    prompt: "I quit my 9 to 5 job here is what happened",
    title: "I QUIT MY 9-5 JOB", preview_gradient: GRADIENTS[6], preview_url: null,
    aspect_ratio: "16:9", style: "minimal", category: "lifestyle", tone: "inspiring",
    ctr_score: 93, status: "done", is_favorite: true, variation_index: 0,
    generation_id: "gen_6", created_at: "2025-06-26T08:00:00Z", updated_at: "2025-06-26T08:00:00Z",
  },
  {
    id: "th_7", project_id: "proj_3", user_id: "usr_1",
    prompt: "Ethereum 2.0 everything you need to know",
    title: "ETHEREUM 2.0 EXPLAINED", preview_gradient: GRADIENTS[8], preview_url: null,
    aspect_ratio: "16:9", style: "gradient", category: "crypto", tone: "educational",
    ctr_score: 85, status: "done", is_favorite: false, variation_index: 0,
    generation_id: "gen_7", created_at: "2025-06-25T15:00:00Z", updated_at: "2025-06-25T15:00:00Z",
  },
  {
    id: "th_8", project_id: "proj_1", user_id: "usr_1",
    prompt: "How I made 50k with YouTube this year",
    title: "I MADE $50K WITH YOUTUBE", preview_gradient: GRADIENTS[7], preview_url: null,
    aspect_ratio: "16:9", style: "bold_text", category: "finance", tone: "inspiring",
    ctr_score: 92, status: "done", is_favorite: false, variation_index: 0,
    generation_id: "gen_8", created_at: "2025-06-25T10:00:00Z", updated_at: "2025-06-25T10:00:00Z",
  },
]

// ─── Mock Projects ────────────────────────────────────────────────────────────

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_1",
    user_id: "usr_1",
    title: "Crypto Crash Series",
    description: "Thumbnails for my crypto market analysis videos",
    thumbnail_count: 24,
    is_favorite: true,
    status: "active",
    cover_thumbnail_id: "th_1",
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2025-06-29T10:00:00Z",
  },
  {
    id: "proj_2",
    user_id: "usr_1",
    title: "Finance Masterclass",
    description: "Personal finance and investing content",
    thumbnail_count: 18,
    is_favorite: false,
    status: "active",
    cover_thumbnail_id: "th_4",
    created_at: "2025-05-15T00:00:00Z",
    updated_at: "2025-06-27T16:00:00Z",
  },
  {
    id: "proj_3",
    user_id: "usr_1",
    title: "Lifestyle & Growth",
    description: "Personal development and lifestyle thumbnails",
    thumbnail_count: 12,
    is_favorite: true,
    status: "active",
    cover_thumbnail_id: "th_6",
    created_at: "2025-04-20T00:00:00Z",
    updated_at: "2025-06-26T08:00:00Z",
  },
  {
    id: "proj_4",
    user_id: "usr_1",
    title: "Gaming Highlights",
    description: "Weekly gaming content and streams",
    thumbnail_count: 8,
    is_favorite: false,
    status: "active",
    cover_thumbnail_id: "th_5",
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-06-27T11:00:00Z",
  },
  {
    id: "proj_5",
    user_id: "usr_1",
    title: "AI & Tech News",
    description: "Weekly AI developments and tech reviews",
    thumbnail_count: 15,
    is_favorite: false,
    status: "active",
    cover_thumbnail_id: "th_3",
    created_at: "2025-03-10T00:00:00Z",
    updated_at: "2025-06-28T09:00:00Z",
  },
  {
    id: "proj_6",
    user_id: "usr_1",
    title: "Old Tutorials",
    description: "Archived beginner tutorial series",
    thumbnail_count: 30,
    is_favorite: false,
    status: "archived",
    cover_thumbnail_id: null,
    created_at: "2024-12-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
]

// ─── Mock Templates ───────────────────────────────────────────────────────────

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=360&fit=crop&auto=format&q=80`

export const MOCK_TEMPLATES: Template[] = [
  // ── Crypto ──────────────────────────────────────────────────────────────────
  { id: "tpl_1",  title: "Crypto Alert",         description: "High-urgency breaking crypto news",           category: "crypto",   preview_gradient: "from-orange-500 via-red-500 to-red-700",       preview_url: u("1621416894569-0f39ed31d247"), style: "dramatic",    tags: ["crypto", "breaking", "alert"],          uses_count: 8420,  is_premium: false, created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_2",  title: "100x Gem Found",        description: "Altcoin discovery hype thumbnail",            category: "crypto",   preview_gradient: "from-amber-400 via-yellow-500 to-orange-600",  preview_url: u("1634704784915-aacf363b021f"), style: "bold_text",   tags: ["crypto", "altcoin", "gem"],             uses_count: 6102,  is_premium: false, created_at: "2025-01-15T00:00:00Z" },
  { id: "tpl_3",  title: "Dark Revelation",       description: "Mysterious reveal and expose style",          category: "crypto",   preview_gradient: "from-slate-950 via-gray-900 to-slate-800",     preview_url: u("1640340434855-6084b1f4901c"), style: "dark_cinema", tags: ["reveal", "mystery", "dark"],            uses_count: 5831,  is_premium: false, created_at: "2025-01-20T00:00:00Z" },
  { id: "tpl_4",  title: "Bitcoin Breakout",      description: "BTC price action and chart analysis",         category: "crypto",   preview_gradient: "from-orange-600 via-amber-500 to-yellow-400",  preview_url: u("1611974789855-9c2a0a7236a3"), style: "dramatic",    tags: ["bitcoin", "btc", "chart"],              uses_count: 9340,  is_premium: false, created_at: "2025-02-01T00:00:00Z" },
  { id: "tpl_5",  title: "DeFi Deep Dive",        description: "DeFi protocol analysis and tutorials",        category: "crypto",   preview_gradient: "from-cyan-700 via-blue-700 to-indigo-800",     preview_url: u("1605792657660-596af9009e82"), style: "gradient",    tags: ["defi", "protocol", "yield"],            uses_count: 3210,  is_premium: true,  created_at: "2025-02-10T00:00:00Z" },
  { id: "tpl_6",  title: "Rug Pull Exposed",      description: "Scam warning and expose content",             category: "crypto",   preview_gradient: "from-red-900 via-red-700 to-rose-600",         preview_url: u("1579621970563-ebec7560ff3e"), style: "bold_text",   tags: ["scam", "warning", "expose"],            uses_count: 7854,  is_premium: false, created_at: "2025-02-15T00:00:00Z" },
  // ── Finance ──────────────────────────────────────────────────────────────────
  { id: "tpl_7",  title: "Finance Growth",        description: "Professional investing and wealth building",  category: "finance",  preview_gradient: "from-blue-700 via-blue-600 to-sky-500",        preview_url: u("1579621970563-ebec7560ff3e"), style: "minimal",     tags: ["finance", "growth", "investing"],       uses_count: 4923,  is_premium: false, created_at: "2025-01-05T00:00:00Z" },
  { id: "tpl_8",  title: "Passive Income",        description: "Streams of income and financial freedom",     category: "finance",  preview_gradient: "from-emerald-700 via-green-600 to-teal-500",   preview_url: u("1621416894569-0f39ed31d247"), style: "gradient",    tags: ["income", "passive", "freedom"],         uses_count: 6711,  is_premium: false, created_at: "2025-01-25T00:00:00Z" },
  { id: "tpl_9",  title: "Stock Market Crash",    description: "Market downturn and crash analysis",          category: "finance",  preview_gradient: "from-red-700 via-rose-700 to-pink-700",        preview_url: u("1611974789855-9c2a0a7236a3"), style: "dramatic",    tags: ["stocks", "crash", "bear"],              uses_count: 8204,  is_premium: false, created_at: "2025-03-01T00:00:00Z" },
  { id: "tpl_10", title: "Day Trader Setup",      description: "Trading desk, charts and strategy reveal",    category: "finance",  preview_gradient: "from-slate-800 via-gray-800 to-zinc-700",      preview_url: u("1640340434855-6084b1f4901c"), style: "dark_cinema", tags: ["trading", "setup", "strategy"],         uses_count: 3567,  is_premium: true,  created_at: "2025-03-10T00:00:00Z" },
  { id: "tpl_11", title: "$1M Blueprint",         description: "Wealth building roadmap content",             category: "finance",  preview_gradient: "from-amber-500 via-yellow-400 to-lime-400",    preview_url: u("1634704784915-aacf363b021f"), style: "bold_text",   tags: ["wealth", "million", "blueprint"],       uses_count: 5920,  is_premium: true,  created_at: "2025-03-15T00:00:00Z" },
  // ── Gaming ────────────────────────────────────────────────────────────────────
  { id: "tpl_12", title: "Gaming Neon",           description: "Vibrant esports and competitive gaming",      category: "gaming",   preview_gradient: "from-purple-700 via-fuchsia-600 to-pink-500",  preview_url: u("1550745165-9bc0b252726f"),    style: "bright_pop",  tags: ["gaming", "neon", "esports"],            uses_count: 9102,  is_premium: false, created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_13", title: "World Record",          description: "Achievement and speed run thumbnails",        category: "gaming",   preview_gradient: "from-yellow-400 via-amber-500 to-orange-500",  preview_url: u("1542751371-adc38448a05e"),    style: "bold_text",   tags: ["record", "achievement", "speedrun"],    uses_count: 7340,  is_premium: false, created_at: "2025-01-10T00:00:00Z" },
  { id: "tpl_14", title: "Easter Egg Hunt",       description: "Hidden secret and easter egg discoveries",    category: "gaming",   preview_gradient: "from-violet-700 via-purple-600 to-indigo-700", preview_url: u("1493711662062-fa541adb3fc8"), style: "dark_cinema", tags: ["secret", "hidden", "discovery"],        uses_count: 5890,  is_premium: false, created_at: "2025-02-05T00:00:00Z" },
  { id: "tpl_15", title: "Rage Quit Energy",      description: "High-emotion gaming reaction content",        category: "gaming",   preview_gradient: "from-red-600 via-orange-500 to-yellow-400",    preview_url: u("1560419015-7c427e8ae5ba"),    style: "dramatic",    tags: ["rage", "reaction", "emotion"],          uses_count: 4201,  is_premium: false, created_at: "2025-02-20T00:00:00Z" },
  { id: "tpl_16", title: "Pro Gamer Tips",        description: "Strategy guides and pro-level tutorials",     category: "gaming",   preview_gradient: "from-cyan-600 via-sky-600 to-blue-700",        preview_url: u("1542751371-adc38448a05e"),    style: "gradient",    tags: ["tips", "pro", "strategy"],              uses_count: 3850,  is_premium: true,  created_at: "2025-03-05T00:00:00Z" },
  { id: "tpl_17", title: "Unboxing Legendary",    description: "Loot unboxing and legendary item reveals",    category: "gaming",   preview_gradient: "from-amber-400 via-orange-500 to-red-500",     preview_url: u("1550745165-9bc0b252726f"),    style: "bright_pop",  tags: ["unboxing", "loot", "legendary"],        uses_count: 6677,  is_premium: false, created_at: "2025-03-20T00:00:00Z" },
  // ── AI & Tech ─────────────────────────────────────────────────────────────────
  { id: "tpl_18", title: "AI Tech Wave",          description: "Modern AI tools and future tech",             category: "ai_tech",  preview_gradient: "from-cyan-600 via-blue-600 to-indigo-700",     preview_url: u("1677442135703-1787eea5ce01"), style: "gradient",    tags: ["ai", "tech", "future"],                 uses_count: 5156,  is_premium: true,  created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_19", title: "AI Will Replace You",   description: "Job automation and AI disruption content",    category: "ai_tech",  preview_gradient: "from-slate-900 via-red-900 to-slate-800",      preview_url: u("1555066931-4365d14bab8c"),    style: "dark_cinema", tags: ["ai", "automation", "jobs"],             uses_count: 9831,  is_premium: false, created_at: "2025-01-18T00:00:00Z" },
  { id: "tpl_20", title: "Build With AI",         description: "AI-powered project and product building",     category: "ai_tech",  preview_gradient: "from-violet-600 via-purple-600 to-fuchsia-700",preview_url: u("1498050108023-c5249f4df085"), style: "gradient",    tags: ["build", "ai", "product"],               uses_count: 4320,  is_premium: false, created_at: "2025-02-08T00:00:00Z" },
  { id: "tpl_21", title: "Coding in 60 Seconds",  description: "Ultra-short coding tutorial bites",           category: "ai_tech",  preview_gradient: "from-emerald-600 via-teal-600 to-cyan-600",    preview_url: u("1555066931-4365d14bab8c"),    style: "bold_text",   tags: ["code", "quick", "tutorial"],            uses_count: 7204,  is_premium: false, created_at: "2025-02-25T00:00:00Z" },
  { id: "tpl_22", title: "Tech Gear Review",      description: "Gadget and hardware review thumbnails",       category: "ai_tech",  preview_gradient: "from-slate-700 via-gray-600 to-zinc-600",      preview_url: u("1518770660439-4636190af475"), style: "minimal",     tags: ["review", "gear", "gadget"],             uses_count: 3940,  is_premium: false, created_at: "2025-03-12T00:00:00Z" },
  { id: "tpl_23", title: "ChatGPT Prompt Hack",   description: "AI prompt engineering and tips",              category: "ai_tech",  preview_gradient: "from-green-600 via-emerald-600 to-teal-700",   preview_url: u("1677442135703-1787eea5ce01"), style: "bold_text",   tags: ["chatgpt", "prompt", "hack"],            uses_count: 8112,  is_premium: true,  created_at: "2025-03-25T00:00:00Z" },
  // ── Lifestyle ─────────────────────────────────────────────────────────────────
  { id: "tpl_24", title: "Lifestyle Pop",         description: "Bright, energetic lifestyle and vlog",        category: "lifestyle",preview_gradient: "from-pink-500 via-rose-400 to-red-400",        preview_url: u("1494790108377-be9c29b29330"), style: "bright_pop",  tags: ["lifestyle", "vlog", "happy"],           uses_count: 3654,  is_premium: false, created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_25", title: "Morning Routine",       description: "Morning habits and daily routine content",    category: "lifestyle",preview_gradient: "from-amber-300 via-yellow-400 to-orange-400",  preview_url: u("1499750310107-5fef28a66643"), style: "minimal",     tags: ["morning", "routine", "habits"],         uses_count: 5230,  is_premium: false, created_at: "2025-01-22T00:00:00Z" },
  { id: "tpl_26", title: "Minimalist Life",       description: "Clean minimalism and intentional living",     category: "lifestyle",preview_gradient: "from-stone-200 via-stone-300 to-stone-400",    preview_url: u("1529333166437-7750a6dd5a70"), style: "minimal",     tags: ["minimal", "clean", "intentional"],      uses_count: 2890,  is_premium: false, created_at: "2025-02-12T00:00:00Z" },
  { id: "tpl_27", title: "Travel Day Vlog",       description: "Airport and travel day thumbnails",           category: "lifestyle",preview_gradient: "from-sky-500 via-blue-500 to-indigo-600",      preview_url: u("1506905925346-21bda4d32df4"), style: "bright_pop",  tags: ["travel", "vlog", "adventure"],          uses_count: 4107,  is_premium: false, created_at: "2025-02-28T00:00:00Z" },
  { id: "tpl_28", title: "What I Eat in a Day",   description: "Food diary and meal content",                 category: "lifestyle",preview_gradient: "from-lime-500 via-green-500 to-emerald-600",   preview_url: u("1546069901-ba9599a7e63c"),    style: "bright_pop",  tags: ["food", "meal", "diet"],                 uses_count: 6023,  is_premium: false, created_at: "2025-03-08T00:00:00Z" },
  // ── Fitness ────────────────────────────────────────────────────────────────────
  { id: "tpl_29", title: "Fitness Pump",          description: "High-energy gym and workout content",         category: "fitness",  preview_gradient: "from-yellow-500 via-orange-500 to-red-600",    preview_url: u("1534438327276-14e5300c3a48"), style: "dramatic",    tags: ["fitness", "workout", "gym"],            uses_count: 5089,  is_premium: true,  created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_30", title: "Body Transformation",   description: "Before and after transformation reveals",     category: "fitness",  preview_gradient: "from-orange-600 via-red-500 to-pink-600",      preview_url: u("1517836357463-d25dfeac3438"), style: "dramatic",    tags: ["transformation", "before", "after"],    uses_count: 9120,  is_premium: false, created_at: "2025-01-28T00:00:00Z" },
  { id: "tpl_31", title: "PR Attempt",            description: "Personal record attempt and lift content",    category: "fitness",  preview_gradient: "from-red-800 via-red-600 to-orange-500",       preview_url: u("1534438327276-14e5300c3a48"), style: "bold_text",   tags: ["pr", "lift", "record"],                 uses_count: 4350,  is_premium: false, created_at: "2025-02-18T00:00:00Z" },
  { id: "tpl_32", title: "Meal Prep Sunday",      description: "Clean eating and meal prep content",          category: "fitness",  preview_gradient: "from-green-500 via-emerald-500 to-teal-500",   preview_url: u("1490645935967-10de6ba17061"), style: "minimal",     tags: ["meal", "prep", "nutrition"],            uses_count: 3712,  is_premium: false, created_at: "2025-03-02T00:00:00Z" },
  // ── Podcast ────────────────────────────────────────────────────────────────────
  { id: "tpl_33", title: "Podcast Cover",         description: "Clean podcast episode thumbnails",            category: "podcast",  preview_gradient: "from-amber-600 via-orange-500 to-red-500",     preview_url: u("1478737270239-2f02b77fc618"), style: "minimal",     tags: ["podcast", "clean", "episode"],          uses_count: 2987,  is_premium: false, created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_34", title: "Deep Dive Episode",     description: "Long-form investigative podcast style",       category: "podcast",  preview_gradient: "from-indigo-800 via-violet-800 to-purple-900", preview_url: u("1590602847861-f357a9332bbc"), style: "dark_cinema", tags: ["deep", "investigative", "longform"],    uses_count: 2140,  is_premium: false, created_at: "2025-02-02T00:00:00Z" },
  { id: "tpl_35", title: "Guest Spotlight",       description: "Podcast guest and interview thumbnails",      category: "podcast",  preview_gradient: "from-slate-800 via-gray-700 to-zinc-600",      preview_url: u("1478737270239-2f02b77fc618"), style: "minimal",     tags: ["guest", "interview", "spotlight"],      uses_count: 1870,  is_premium: false, created_at: "2025-03-14T00:00:00Z" },
  { id: "tpl_36", title: "Hot Take",              description: "Controversial opinion and debate content",    category: "podcast",  preview_gradient: "from-red-600 via-orange-600 to-amber-500",     preview_url: u("1589903308904-1010c2294adc"), style: "bold_text",   tags: ["opinion", "debate", "controversial"],   uses_count: 4530,  is_premium: true,  created_at: "2025-03-22T00:00:00Z" },
  // ── News ──────────────────────────────────────────────────────────────────────
  { id: "tpl_37", title: "Bold Statement",        description: "High-impact text-driven breaking news",       category: "news",     preview_gradient: "from-red-700 via-red-600 to-rose-600",         preview_url: u("1504711434969-e33886168f5c"), style: "bold_text",   tags: ["text", "bold", "statement"],            uses_count: 7430,  is_premium: true,  created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_38", title: "News Ticker",           description: "Breaking news broadcast-style layout",        category: "news",     preview_gradient: "from-gray-900 via-slate-800 to-gray-800",      preview_url: u("1504711434969-e33886168f5c"), style: "bold_text",   tags: ["news", "breaking", "broadcast"],        uses_count: 4743,  is_premium: false, created_at: "2025-01-12T00:00:00Z" },
  { id: "tpl_39", title: "Exposed",               description: "Scandal reveal and expose format",            category: "news",     preview_gradient: "from-red-900 via-rose-800 to-red-700",         preview_url: u("1489599849927-9b3e9e74d5e5"), style: "dramatic",    tags: ["expose", "scandal", "reveal"],          uses_count: 10230, is_premium: false, created_at: "2025-02-14T00:00:00Z" },
  { id: "tpl_40", title: "Ranked",                description: "Tier list and ranking content",               category: "news",     preview_gradient: "from-yellow-500 via-amber-500 to-orange-600",  preview_url: u("1611974789855-9c2a0a7236a3"), style: "bold_text",   tags: ["ranked", "tier", "list"],               uses_count: 5680,  is_premium: false, created_at: "2025-03-18T00:00:00Z" },
  // ── Tutorial ──────────────────────────────────────────────────────────────────
  { id: "tpl_41", title: "Tutorial Guide",        description: "Step-by-step beginner tutorial style",        category: "tutorial", preview_gradient: "from-emerald-600 via-teal-600 to-cyan-600",    preview_url: u("1484807352052-23338990c6c6"), style: "minimal",     tags: ["tutorial", "guide", "beginner"],        uses_count: 6312,  is_premium: false, created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_42", title: "Zero to Expert",        description: "Learning journey and skill progression",      category: "tutorial", preview_gradient: "from-violet-600 via-purple-600 to-blue-700",   preview_url: u("1499750310107-5fef28a66643"), style: "gradient",    tags: ["beginner", "expert", "learn"],          uses_count: 4890,  is_premium: false, created_at: "2025-01-30T00:00:00Z" },
  { id: "tpl_43", title: "Advanced Secrets",      description: "Pro tips and advanced technique reveals",     category: "tutorial", preview_gradient: "from-slate-900 via-indigo-900 to-purple-900",  preview_url: u("1555066931-4365d14bab8c"),    style: "dark_cinema", tags: ["advanced", "secrets", "pro"],           uses_count: 3670,  is_premium: true,  created_at: "2025-02-22T00:00:00Z" },
  { id: "tpl_44", title: "In 5 Minutes",          description: "Ultra-concise quick tutorial format",         category: "tutorial", preview_gradient: "from-orange-500 via-amber-500 to-yellow-400",  preview_url: u("1498050108023-c5249f4df085"), style: "bold_text",   tags: ["quick", "fast", "short"],               uses_count: 8940,  is_premium: false, created_at: "2025-03-06T00:00:00Z" },
  // ── Vlog ──────────────────────────────────────────────────────────────────────
  { id: "tpl_45", title: "Vlog Diary",            description: "Personal daily vlog and diary style",         category: "vlog",     preview_gradient: "from-indigo-600 via-purple-600 to-violet-600", preview_url: u("1494790108377-be9c29b29330"), style: "gradient",    tags: ["vlog", "diary", "personal"],            uses_count: 2891,  is_premium: false, created_at: "2025-01-01T00:00:00Z" },
  { id: "tpl_46", title: "Day in My Life",        description: "DITL format with warm authentic feel",        category: "vlog",     preview_gradient: "from-rose-400 via-pink-400 to-fuchsia-500",    preview_url: u("1544367567-0f2fcb009e0b"),    style: "bright_pop",  tags: ["ditl", "day", "life"],                  uses_count: 5540,  is_premium: false, created_at: "2025-02-06T00:00:00Z" },
  { id: "tpl_47", title: "NYC Life",              description: "City vlog and urban lifestyle aesthetic",      category: "vlog",     preview_gradient: "from-sky-600 via-blue-600 to-indigo-700",      preview_url: u("1485871640914-8fc11b0bf04f"), style: "gradient",    tags: ["city", "nyc", "urban"],                 uses_count: 3210,  is_premium: false, created_at: "2025-02-26T00:00:00Z" },
  { id: "tpl_48", title: "Story Time",            description: "Narrative storytelling and confession style", category: "vlog",     preview_gradient: "from-amber-500 via-orange-500 to-red-500",     preview_url: u("1494790108377-be9c29b29330"), style: "dramatic",    tags: ["story", "confession", "narrative"],     uses_count: 6780,  is_premium: false, created_at: "2025-03-16T00:00:00Z" },
  // ── Entertainment ─────────────────────────────────────────────────────────────
  { id: "tpl_49", title: "Reaction Blast",        description: "Reaction video high-energy thumbnails",       category: "entertainment", preview_gradient: "from-yellow-400 via-orange-500 to-pink-600",  preview_url: u("1489599849927-9b3e9e74d5e5"), style: "bright_pop",  tags: ["reaction", "funny", "emotion"],    uses_count: 7890,  is_premium: false, created_at: "2025-01-08T00:00:00Z" },
  { id: "tpl_50", title: "Celebrity Drama",       description: "Pop culture and celebrity news content",      category: "entertainment", preview_gradient: "from-pink-600 via-rose-500 to-red-500",      preview_url: u("1489599849927-9b3e9e74d5e5"), style: "bold_text",   tags: ["celebrity", "drama", "gossip"],    uses_count: 9120,  is_premium: false, created_at: "2025-01-26T00:00:00Z" },
  { id: "tpl_51", title: "Movie Breakdown",       description: "Film analysis and Easter egg content",        category: "entertainment", preview_gradient: "from-slate-800 via-gray-900 to-black",       preview_url: u("1536440136828-82fab4629e68"), style: "dark_cinema", tags: ["movie", "breakdown", "analysis"],  uses_count: 4560,  is_premium: true,  created_at: "2025-02-16T00:00:00Z" },
  { id: "tpl_52", title: "Viral Clip Reaction",   description: "Trending clip and meme reaction content",     category: "entertainment", preview_gradient: "from-violet-600 via-fuchsia-600 to-pink-600",preview_url: u("1489599849927-9b3e9e74d5e5"), style: "bright_pop",  tags: ["viral", "meme", "clip"],           uses_count: 6340,  is_premium: false, created_at: "2025-03-26T00:00:00Z" },
]

// ─── Mock Transactions ────────────────────────────────────────────────────────

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: "tx_1", user_id: "usr_1", type: "earn", amount: 500, description: "Weekly staking reward", tx_hash: "0xabc...123", created_at: "2025-06-28T00:00:00Z" },
  { id: "tx_2", user_id: "usr_1", type: "spend", amount: -50, description: "50 AI generations (Pro rate)", tx_hash: null, created_at: "2025-06-27T14:00:00Z" },
  { id: "tx_3", user_id: "usr_1", type: "earn", amount: 200, description: "Referral bonus — 2 new users", tx_hash: "0xdef...456", created_at: "2025-06-26T10:00:00Z" },
  { id: "tx_4", user_id: "usr_1", type: "spend", amount: -200, description: "Creator plan upgrade (THUMB)", tx_hash: null, created_at: "2025-06-25T09:00:00Z" },
  { id: "tx_5", user_id: "usr_1", type: "reward", amount: 100, description: "Early adopter badge reward", tx_hash: "0xghi...789", created_at: "2025-06-20T08:00:00Z" },
  { id: "tx_6", user_id: "usr_1", type: "earn", amount: 500, description: "Weekly staking reward", tx_hash: "0xjkl...012", created_at: "2025-06-21T00:00:00Z" },
]

// ─── Mock Dashboard Stats ─────────────────────────────────────────────────────

export const MOCK_STATS: DashboardStats = {
  total_thumbnails: 134,
  thumbnails_this_month: 47,
  avg_ctr_score: 91.2,
  credits_used: 134,
  credits_limit: 200,
  thumb_balance: 12450,
  active_projects: 5,
}

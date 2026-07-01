// ─── Core Domain Types ────────────────────────────────────────────────────────

export type PlanTier = "free" | "creator" | "pro" | "enterprise"
export type AspectRatio = "16:9" | "1:1" | "4:3" | "9:16"
export type ThumbnailStatus = "pending" | "generating" | "done" | "failed"
export type ProjectStatus = "active" | "archived"

export interface User {
  id: string
  name: string
  email: string
  avatar_url: string | null
  plan: PlanTier
  thumb_balance: number
  credits_used: number
  credits_limit: number
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description: string | null
  thumbnail_count: number
  is_favorite: boolean
  status: ProjectStatus
  cover_thumbnail_id: string | null
  created_at: string
  updated_at: string
  thumbnails?: Thumbnail[]
}

export interface Thumbnail {
  id: string
  project_id: string | null
  user_id: string
  prompt: string
  title: string
  preview_gradient: string
  preview_url: string | null
  aspect_ratio: AspectRatio
  style: ThumbnailStyle
  category: ThumbnailCategory
  tone: ThumbnailTone
  ctr_score: number
  status: ThumbnailStatus
  is_favorite: boolean
  variation_index: number
  generation_id: string
  created_at: string
  updated_at: string
  editor_state?: EditorState | null
}

export interface Generation {
  id: string
  user_id: string
  project_id: string
  prompt: string
  aspect_ratio: AspectRatio
  style: ThumbnailStyle
  category: ThumbnailCategory
  tone: ThumbnailTone
  credits_used: number
  variation_count: number
  thumbnails: Thumbnail[]
  created_at: string
}

export interface Template {
  id: string
  title: string
  description: string
  category: ThumbnailCategory
  preview_gradient: string
  preview_url?: string | null
  style: ThumbnailStyle
  tags: string[]
  uses_count: number
  is_premium: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: PlanTier
  status: "active" | "canceled" | "past_due" | "trialing"
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
}

export interface WalletTransaction {
  id: string
  user_id: string
  type: "earn" | "spend" | "stake" | "unstake" | "reward"
  amount: number
  description: string
  tx_hash: string | null
  created_at: string
}

export interface Credits {
  id: string
  user_id: string
  balance: number
  used_this_period: number
  limit_this_period: number
  resets_at: string
}

// ─── Generator Types ──────────────────────────────────────────────────────────

export type ThumbnailStyle =
  | "dramatic"
  | "minimal"
  | "bold_text"
  | "dark_cinema"
  | "bright_pop"
  | "gradient"

export type ThumbnailCategory =
  | "crypto"
  | "finance"
  | "gaming"
  | "ai_tech"
  | "lifestyle"
  | "fitness"
  | "podcast"
  | "news"
  | "tutorial"
  | "vlog"
  | "entertainment"

export type ThumbnailTone =
  | "shocking"
  | "inspiring"
  | "educational"
  | "controversial"
  | "funny"
  | "curious"
  | "urgent"

export type ColorPalette =
  | "auto"
  | "fire"
  | "ocean"
  | "neon"
  | "gold"
  | "dark"
  | "vibrant"
  | "monochrome"
  | "warm"
  | "cool"

export interface GenerationRequest {
  prompt: string
  project_id?: string
  aspect_ratio: AspectRatio | string
  style: ThumbnailStyle
  category: ThumbnailCategory
  tone: ThumbnailTone
  color_palette: ColorPalette
  count?: number
  variation_count?: number
}

export interface GenerationResult {
  generation_id: string
  thumbnails: Thumbnail[]
  credits_used: number
}

// ─── Editor Types ─────────────────────────────────────────────────────────────

export type EditorTool = "select" | "text" | "image" | "shape" | "rectangle" | "circle" | "line" | "crop" | "hand"

export interface EditorElement {
  id: string
  type: "text" | "image" | "shape" | "background" | "rectangle" | "circle" | "line"
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked: boolean
  visible: boolean
  zIndex: number
  // text-specific
  content?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  color?: string
  textAlign?: "left" | "center" | "right"
  // image-specific
  src?: string
  // shape-specific
  shapeType?: "rect" | "circle" | "star"
  fill?: string
  stroke?: string
  strokeWidth?: number
  // background-specific
  gradient?: string
}

export interface EditorState {
  elements: EditorElement[]
  background: string
  width: number
  height: number
  zoom: number
}

export interface HistoryEntry {
  state: EditorElement[]
  label: string
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  has_more: boolean
}

// ─── Dashboard Types ──────────────────────────────────────────────────────────

export interface DashboardStats {
  total_thumbnails: number
  thumbnails_this_month: number
  avg_ctr_score: number
  credits_used: number
  credits_limit: number
  thumb_balance: number
  active_projects: number
}

// ─── Plan Config ──────────────────────────────────────────────────────────────

export interface PlanConfig {
  key: PlanTier
  id: PlanTier
  name: string
  price_usd: number
  price_thumb: number
  credits_per_month: number
  features: string[]
  highlight?: boolean
}

export const PLANS: PlanConfig[] = [
  {
    key: "free",
    id: "free",
    name: "Free",
    price_usd: 0,
    price_thumb: 0,
    credits_per_month: 20,
    features: ["20 generations/month", "Standard quality", "PNG export", "3 projects", "Basic templates"],
  },
  {
    key: "creator",
    id: "creator",
    name: "Creator",
    price_usd: 19,
    price_thumb: 4000,
    credits_per_month: 200,
    features: ["200 generations/month", "HD quality (2K)", "All export formats", "Unlimited projects", "All templates", "CTR analytics"],
    highlight: true,
  },
  {
    key: "pro",
    id: "pro",
    name: "Pro",
    price_usd: 49,
    price_thumb: 9000,
    credits_per_month: 1000,
    features: ["1000 generations/month", "4K export quality", "Batch export", "API access (1K req/mo)", "Priority queue", "Advanced analytics", "White-label export"],
  },
  {
    key: "enterprise",
    id: "enterprise",
    name: "Enterprise",
    price_usd: 199,
    price_thumb: 35000,
    credits_per_month: -1,
    features: ["Unlimited generations", "4K + batch export", "Full API access", "Dedicated processing", "Custom branding", "SLA + support", "Team workspace"],
  },
]

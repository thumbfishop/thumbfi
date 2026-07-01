import type { EditorElement } from "@/types"

/**
 * Hex values for the Tailwind tokens used by the editor's background swatches.
 * We render the export manually (rather than a DOM-to-image lib) so Tailwind
 * v4's oklch colors can't break the output, and we get crisp full-resolution
 * PNGs/JPGs regardless of the on-screen zoom.
 */
const TW_COLORS: Record<string, string> = {
  "orange-500": "#f97316", "orange-700": "#c2410c",
  "amber-500": "#f59e0b", "amber-600": "#d97706",
  "yellow-400": "#facc15",
  "slate-700": "#334155", "slate-900": "#0f172a",
  "blue-700": "#1d4ed8", "blue-900": "#1e3a8a",
  "cyan-600": "#0891b2",
  "red-600": "#dc2626",
  "rose-600": "#e11d48", "rose-900": "#881337",
  "purple-700": "#7e22ce",
  "violet-900": "#4c1d95",
  "emerald-600": "#059669",
  "teal-700": "#0f766e",
  "pink-600": "#db2777",
  "indigo-700": "#4338ca",
  "gray-800": "#1f2937", "gray-950": "#030712",
}

function tokenToHex(token: string): string {
  return TW_COLORS[token] ?? "#888888"
}

/** Parse a Tailwind gradient string like "from-orange-500 via-amber-500 to-yellow-400". */
function parseGradientStops(bg: string): string[] {
  const stops: string[] = []
  for (const cls of bg.trim().split(/\s+/)) {
    if (cls.startsWith("from-")) stops[0] = tokenToHex(cls.slice(5))
    else if (cls.startsWith("via-")) stops[1] = tokenToHex(cls.slice(4))
    else if (cls.startsWith("to-")) stops[2] = tokenToHex(cls.slice(3))
  }
  return stops.filter(Boolean)
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

export interface RenderOptions {
  elements: EditorElement[]
  background: string
  width: number
  height: number
  format: "png" | "jpeg"
}

/** Render the editor scene to a data URL (image/png or image/jpeg). */
export function renderCanvasToDataUrl(opts: RenderOptions): string {
  const { elements, background, width, height, format } = opts
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas 2D context unavailable")

  // Background
  if (background.startsWith("#")) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
  } else {
    const stops = parseGradientStops(background)
    if (stops.length === 0) {
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(0, 0, width, height)
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height) // to-br diagonal
      stops.forEach((c, i) => grad.addColorStop(stops.length === 1 ? 0 : i / (stops.length - 1), c))
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)
    }
  }

  // Elements, back-to-front
  const ordered = [...elements].filter(e => e.visible).sort((a, b) => a.zIndex - b.zIndex)
  for (const el of ordered) {
    ctx.save()
    ctx.globalAlpha = el.opacity ?? 1
    const cx = el.x + el.width / 2
    const cy = el.y + el.height / 2
    if (el.rotation) {
      ctx.translate(cx, cy)
      ctx.rotate((el.rotation * Math.PI) / 180)
      ctx.translate(-cx, -cy)
    }

    if (el.type === "text") {
      const size = el.fontSize ?? 32
      const weight = el.fontWeight ?? "bold"
      ctx.fillStyle = el.color ?? "#FFFFFF"
      ctx.font = `${weight} ${size}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(String(el.content ?? ""), cx, cy)
    } else if (el.type === "rectangle") {
      ctx.fillStyle = el.color ?? "#FF7A00"
      roundRectPath(ctx, el.x, el.y, el.width, el.height, 4)
      ctx.fill()
    } else if (el.type === "circle") {
      ctx.fillStyle = el.color ?? "#FF7A00"
      ctx.beginPath()
      ctx.ellipse(cx, cy, el.width / 2, el.height / 2, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  return canvas.toDataURL(format === "jpeg" ? "image/jpeg" : "image/png", 0.95)
}

/** Trigger a browser download of a data URL. */
export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

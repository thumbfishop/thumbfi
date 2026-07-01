"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MousePointer2, Type, Image, Square, Circle, Minus,
  ZoomIn, ZoomOut, Undo2, Redo2, Download, Save, ChevronDown,
  Eye, EyeOff, Trash2, Lock, Unlock, Plus, AlignCenter,
  Bold, Italic, Layers, Wand2, ArrowLeft
} from "lucide-react"
import { useEditorStore } from "@/store/editor.store"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { EditorTool, EditorElement } from "@/types"
import { renderCanvasToDataUrl, downloadDataUrl } from "@/lib/editor/export"
import { getThumbnailAction, saveThumbnailCanvasAction } from "@/lib/actions/thumbnails"

const TOOLS: { key: EditorTool; icon: React.ElementType; label: string }[] = [
  { key: "select",    icon: MousePointer2, label: "Select (V)" },
  { key: "text",      icon: Type,          label: "Text (T)" },
  { key: "image",     icon: Image,         label: "Image (I)" },
  { key: "rectangle", icon: Square,        label: "Rectangle (R)" },
  { key: "circle",    icon: Circle,        label: "Circle (C)" },
  { key: "line",      icon: Minus,         label: "Line (L)" },
]

const CANVAS_W = 1280
const CANVAS_H = 720

const BACKGROUNDS = [
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
  "#FFFFFF",
  "#000000",
]

function ToolButton({ tool, active, onClick }: {
  tool: typeof TOOLS[0]
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={tool.label}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
        active
          ? "bg-[#FF7A00] text-white shadow-md"
          : "text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3]"
      }`}
    >
      <tool.icon className="w-4 h-4" strokeWidth={2} />
    </button>
  )
}

function LayerRow({ el, selected, onSelect, onRemove, onToggleVisible, onToggleLock }: {
  el: EditorElement
  selected: boolean
  onSelect: () => void
  onRemove: () => void
  onToggleVisible: () => void
  onToggleLock: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
        selected ? "bg-[#FF7A00]/10 border border-[#FF7A00]/20" : "hover:bg-[#F5EDE3]"
      }`}
    >
      <div className="w-6 h-6 rounded-md bg-[#F5EDE3] flex items-center justify-center flex-shrink-0">
        {el.type === "text"      && <Type      className="w-3 h-3 text-[#9A7560]" />}
        {el.type === "image"     && <Image     className="w-3 h-3 text-[#9A7560]" />}
        {el.type === "rectangle" && <Square    className="w-3 h-3 text-[#9A7560]" />}
        {el.type === "circle"    && <Circle    className="w-3 h-3 text-[#9A7560]" />}
      </div>
      <span className="flex-1 text-xs font-semibold text-[#2D1C12] truncate capitalize">
        {el.type}{el.type === "text" ? ` — ${(el.content as string)?.slice(0, 12) ?? ""}` : ""}
      </span>
      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
        <button onClick={e => { e.stopPropagation(); onToggleVisible() }} className="text-[#9A7560] hover:text-[#2D1C12]">
          <Eye className="w-3 h-3" />
        </button>
        <button onClick={e => { e.stopPropagation(); onToggleLock() }} className="text-[#9A7560] hover:text-[#2D1C12]">
          <Unlock className="w-3 h-3" />
        </button>
        <button onClick={e => { e.stopPropagation(); onRemove() }} className="text-red-400 hover:text-red-600">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

export default function EditorPage() {
  const params = useParams()
  const {
    elements, selectedId, tool, zoom, background,
    setTool, setZoom, setBackground, addElement, updateElement,
    removeElement, selectElement, bringForward, sendBackward, isDirty, markSaved,
    setElements,
  } = useEditorStore()
  const thumbnailId = (params?.id as string) ?? ""

  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null)
  const [saved, setSaved] = useState(false)
  const [activePanel, setActivePanel] = useState<"layers" | "properties">("layers")
  const [exportMenu, setExportMenu] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const selectedEl = elements.find(e => e.id === selectedId)

  // Drag-to-move selected element (accounts for canvas zoom).
  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragging.startX) / zoom
      const dy = (e.clientY - dragging.startY) / zoom
      updateElement(dragging.id, { x: Math.round(dragging.elX + dx), y: Math.round(dragging.elY + dy) })
    }
    const onUp = () => setDragging(null)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [dragging, zoom, updateElement])

  const handleExport = async (format: "png" | "jpeg") => {
    setExportMenu(false)
    try {
      const dataUrl = await renderCanvasToDataUrl({
        elements, background, width: CANVAS_W, height: CANVAS_H, format,
      })
      downloadDataUrl(dataUrl, `thumbnail.${format === "jpeg" ? "jpg" : "png"}`)
    } catch (err) {
      console.error("Export failed", err)
    }
  }

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement) === canvasRef.current) {
      selectElement(null)
      if (tool === "text") {
        const rect = canvasRef.current!.getBoundingClientRect()
        const id = `el_${Date.now()}`
        addElement({
          id,
          type: "text",
          x: (e.clientX - rect.left) / zoom,
          y: (e.clientY - rect.top) / zoom,
          width: 300,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: elements.length,
          visible: true,
          locked: false,
          content: "Double-click to edit",
          fontSize: 32,
          fontWeight: "bold",
          color: "#FFFFFF",
          textAlign: "center",
        })
        selectElement(id)
        setTool("select")
      } else if (tool === "rectangle") {
        const rect = canvasRef.current!.getBoundingClientRect()
        const id = `el_${Date.now()}`
        addElement({
          id, type: "rectangle",
          x: (e.clientX - rect.left) / zoom - 60,
          y: (e.clientY - rect.top) / zoom - 40,
          width: 120, height: 80, rotation: 0, opacity: 1, zIndex: elements.length,
          visible: true, locked: false, color: "#FF7A00",
        })
        selectElement(id)
        setTool("select")
      } else if (tool === "circle") {
        const rect = canvasRef.current!.getBoundingClientRect()
        const id = `el_${Date.now()}`
        addElement({
          id, type: "circle",
          x: (e.clientX - rect.left) / zoom - 50,
          y: (e.clientY - rect.top) / zoom - 50,
          width: 100, height: 100, rotation: 0, opacity: 1, zIndex: elements.length,
          visible: true, locked: false, color: "#FF7A00",
        })
        selectElement(id)
        setTool("select")
      }
    }
  }, [tool, zoom, elements.length, addElement, selectElement, setTool])

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!thumbnailId || saving) return
    setSaving(true)
    try {
      await saveThumbnailCanvasAction(thumbnailId, {
        elements, background, width: CANVAS_W, height: CANVAS_H, zoom,
      })
      markSaved()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error("Save failed", e)
    } finally {
      setSaving(false)
    }
  }

  // Load this thumbnail: restore a saved canvas, else seed the generated
  // image as an editable base layer so users can add text/shapes on top.
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!thumbnailId) return
      try {
        const thumb = await getThumbnailAction(thumbnailId)
        if (!active || !thumb) { setElements([]); return }
        if (thumb.editor_state?.elements?.length) {
          setElements(thumb.editor_state.elements)
          if (thumb.editor_state.background) setBackground(thumb.editor_state.background)
        } else if (thumb.preview_url) {
          setElements([{
            id: "base_image",
            type: "image",
            src: thumb.preview_url,
            x: 0, y: 0, width: CANVAS_W, height: CANVAS_H,
            rotation: 0, opacity: 1, zIndex: 0, visible: true, locked: false,
          }])
        } else {
          setElements([])
        }
        markSaved()
      } catch {
        setElements([])
      }
    })()
    return () => { active = false }
  }, [thumbnailId, setElements, setBackground, markSaved])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const target = e.target as HTMLElement
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          removeElement(selectedId)
        }
      }
      if (e.key === "v") setTool("select")
      if (e.key === "t") setTool("text")
      if (e.key === "r") setTool("rectangle")
      if (e.key === "c") setTool("circle")
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [selectedId, removeElement, setTool])

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col bg-[#F5EDE3]">
      {/* Editor toolbar */}
      <div className="h-12 bg-white border-b border-[#EAD9CC]/70 flex items-center px-3 gap-2 flex-shrink-0">
        <Link href="/projects" className="flex items-center gap-1.5 text-xs font-semibold text-[#9A7560] hover:text-[#2D1C12] mr-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          Projects
        </Link>

        <div className="w-px h-5 bg-[#EAD9CC]" />

        {/* Tools */}
        <div className="flex gap-0.5">
          {TOOLS.map(t => (
            <ToolButton key={t.key} tool={t} active={tool === t.key} onClick={() => setTool(t.key)} />
          ))}
        </div>

        <div className="w-px h-5 bg-[#EAD9CC] mx-1" />

        {/* Undo/Redo */}
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3]">
          <Undo2 className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3]">
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(zoom - 0.1)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3]">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold text-[#2D1C12] w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(zoom + 0.1)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9A7560] hover:text-[#2D1C12] hover:bg-[#F5EDE3]">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-5 bg-[#EAD9CC] mx-1" />

        {/* Save + Export */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-60 ${
            saved ? "bg-emerald-500 text-white" : isDirty ? "bg-[#FF7A00] text-white" : "border border-[#EAD9CC] text-[#9A7560]"
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving…" : saved ? "Saved!" : isDirty ? "Save" : "Saved"}
        </button>
        <div className="relative">
          <button
            onClick={() => setExportMenu(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2D1C12] text-white text-xs font-bold hover:bg-[#1a0f08] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export
            <ChevronDown className={`w-3 h-3 transition-transform ${exportMenu ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {exportMenu && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setExportMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl border border-[#EAD9CC]/70 shadow-xl z-40 overflow-hidden p-1"
                >
                  <button
                    onClick={() => handleExport("png")}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-[#2D1C12] hover:bg-[#FFF7EF] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF7A00]" />
                    PNG <span className="ml-auto text-[10px] text-[#9A7560]">1280×720</span>
                  </button>
                  <button
                    onClick={() => handleExport("jpeg")}
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold text-[#2D1C12] hover:bg-[#FFF7EF] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF7A00]" />
                    JPG <span className="ml-auto text-[10px] text-[#9A7560]">1280×720</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Layers panel */}
        <div className="w-52 bg-white border-r border-[#EAD9CC]/70 flex flex-col overflow-hidden flex-shrink-0">
          <div className="flex items-center border-b border-[#EAD9CC]/50">
            <button
              onClick={() => setActivePanel("layers")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${
                activePanel === "layers" ? "text-[#FF7A00] border-b-2 border-[#FF7A00]" : "text-[#9A7560]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Layers
            </button>
            <button
              onClick={() => setActivePanel("properties")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-colors ${
                activePanel === "properties" ? "text-[#FF7A00] border-b-2 border-[#FF7A00]" : "text-[#9A7560]"
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
              Properties
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {activePanel === "layers" ? (
              <>
                {elements.length === 0 ? (
                  <p className="text-xs text-[#C4A898] text-center py-6 px-2 leading-relaxed">
                    Add elements with the tools above or click the canvas
                  </p>
                ) : (
                  <div className="space-y-0.5">
                    {[...elements].reverse().map(el => (
                      <LayerRow
                        key={el.id}
                        el={el}
                        selected={selectedId === el.id}
                        onSelect={() => selectElement(el.id)}
                        onRemove={() => removeElement(el.id)}
                        onToggleVisible={() => updateElement(el.id, { visible: !el.visible })}
                        onToggleLock={() => updateElement(el.id, { locked: !el.locked })}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3 py-1">
                {selectedEl ? (
                  <>
                    <div>
                      <p className="text-[10px] font-black text-[#9A7560] uppercase tracking-wider mb-2">Position</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["X", "Y"].map(axis => (
                          <div key={axis}>
                            <label className="text-[10px] text-[#9A7560]">{axis}</label>
                            <input
                              type="number"
                              value={Math.round(axis === "X" ? selectedEl.x : selectedEl.y)}
                              onChange={e => updateElement(selectedEl.id, { [axis.toLowerCase()]: Number(e.target.value) })}
                              className="w-full px-2 py-1.5 rounded-lg border border-[#EAD9CC] text-xs text-[#2D1C12] focus:outline-none focus:border-[#FF7A00]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#9A7560] uppercase tracking-wider mb-2">Size</p>
                      <div className="grid grid-cols-2 gap-2">
                        {["Width", "Height"].map(dim => (
                          <div key={dim}>
                            <label className="text-[10px] text-[#9A7560]">{dim[0]}</label>
                            <input
                              type="number"
                              value={Math.round(dim === "Width" ? selectedEl.width : selectedEl.height)}
                              onChange={e => updateElement(selectedEl.id, { [dim.toLowerCase()]: Number(e.target.value) })}
                              className="w-full px-2 py-1.5 rounded-lg border border-[#EAD9CC] text-xs text-[#2D1C12] focus:outline-none focus:border-[#FF7A00]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#9A7560] uppercase tracking-wider mb-2">Opacity</p>
                      <input
                        type="range" min={0} max={1} step={0.05}
                        value={selectedEl.opacity}
                        onChange={e => updateElement(selectedEl.id, { opacity: Number(e.target.value) })}
                        className="w-full accent-[#FF7A00]"
                      />
                    </div>
                    {selectedEl.type === "text" && (
                      <div>
                        <p className="text-[10px] font-black text-[#9A7560] uppercase tracking-wider mb-2">Text</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={selectedEl.fontSize ?? 32}
                            onChange={e => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })}
                            className="flex-1 px-2 py-1.5 rounded-lg border border-[#EAD9CC] text-xs text-[#2D1C12] focus:outline-none focus:border-[#FF7A00]"
                            placeholder="Font size"
                          />
                          <input
                            type="color"
                            value={selectedEl.color ?? "#FFFFFF"}
                            onChange={e => updateElement(selectedEl.id, { color: e.target.value })}
                            title="Text color"
                            className="w-8 h-8 rounded-lg border border-[#EAD9CC] cursor-pointer bg-white p-0.5"
                          />
                        </div>
                      </div>
                    )}
                    {(selectedEl.type === "rectangle" || selectedEl.type === "circle") && (
                      <div>
                        <p className="text-[10px] font-black text-[#9A7560] uppercase tracking-wider mb-2">Fill</p>
                        <input
                          type="color"
                          value={selectedEl.color ?? "#FF7A00"}
                          onChange={e => updateElement(selectedEl.id, { color: e.target.value })}
                          className="w-full h-8 rounded-lg border border-[#EAD9CC] cursor-pointer bg-white p-0.5"
                        />
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => bringForward(selectedEl.id)}
                        className="flex-1 py-1.5 rounded-lg border border-[#EAD9CC] text-[10px] font-bold text-[#6B3F2A] hover:border-[#FF7A00]/40"
                      >
                        Bring Forward
                      </button>
                      <button
                        onClick={() => sendBackward(selectedEl.id)}
                        className="flex-1 py-1.5 rounded-lg border border-[#EAD9CC] text-[10px] font-bold text-[#6B3F2A] hover:border-[#FF7A00]/40"
                      >
                        Send Back
                      </button>
                    </div>
                    <button
                      onClick={() => removeElement(selectedEl.id)}
                      className="w-full py-1.5 rounded-lg border border-red-200 text-[10px] font-bold text-red-500 hover:bg-red-50"
                    >
                      Delete Element
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-[#C4A898] text-center py-6">Select an element to edit its properties</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[#E8DED5]">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center center",
              width: CANVAS_W,
              height: CANVAS_H,
            }}
            className="flex-shrink-0"
          >
            <div
              ref={canvasRef}
              onClick={handleCanvasClick}
              style={{
                width: CANVAS_W,
                height: CANVAS_H,
                cursor: tool === "select" ? "default" : "crosshair",
                ...(background.startsWith("#") ? { backgroundColor: background } : {}),
              }}
              className={`relative rounded-lg shadow-2xl overflow-hidden ${background.startsWith("#") ? "" : `bg-gradient-to-br ${background}`}`}
            >
              {elements.filter(e => e.visible).map(el => (
                <div
                  key={el.id}
                  onClick={e => { e.stopPropagation(); selectElement(el.id) }}
                  onMouseDown={e => {
                    if (tool !== "select" || el.locked || editingId === el.id) return
                    e.stopPropagation()
                    selectElement(el.id)
                    setDragging({ id: el.id, startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y })
                  }}
                  onDoubleClick={e => { if (el.type === "text") { e.stopPropagation(); setEditingId(el.id) } }}
                  style={{
                    position: "absolute",
                    left: el.x,
                    top: el.y,
                    width: el.width,
                    height: el.height,
                    transform: `rotate(${el.rotation}deg)`,
                    opacity: el.opacity,
                    zIndex: el.zIndex,
                    cursor: el.locked ? "not-allowed" : dragging?.id === el.id ? "grabbing" : "grab",
                    outline: selectedId === el.id ? "2px solid #FF7A00" : "none",
                    outlineOffset: 2,
                  }}
                >
                  {el.type === "image" && el.src && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={el.src} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                  )}
                  {el.type === "text" && (
                    editingId === el.id ? (
                      <textarea
                        autoFocus
                        value={el.content as string}
                        onChange={e => updateElement(el.id, { content: e.target.value })}
                        onBlur={() => setEditingId(null)}
                        onMouseDown={e => e.stopPropagation()}
                        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setEditingId(null) } }}
                        style={{
                          color: el.color ?? "#FFFFFF",
                          fontSize: el.fontSize ?? 32,
                          fontWeight: el.fontWeight ?? ("bold" as React.CSSProperties["fontWeight"]),
                          textAlign: (el.textAlign as React.CSSProperties["textAlign"]) ?? "center",
                          width: "100%", height: "100%",
                          background: "transparent",
                          border: "1px dashed #FF7A00",
                          outline: "none", resize: "none", padding: 0,
                          fontFamily: "inherit",
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          color: el.color ?? "#FFFFFF",
                          fontSize: el.fontSize ?? 32,
                          fontWeight: el.fontWeight ?? "bold",
                          textAlign: (el.textAlign as React.CSSProperties["textAlign"]) ?? "center",
                          width: "100%", height: "100%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          userSelect: "none",
                        }}
                      >
                        {el.content as string}
                      </p>
                    )
                  )}
                  {el.type === "rectangle" && (
                    <div style={{ width: "100%", height: "100%", backgroundColor: el.color ?? "#FF7A00", borderRadius: 4, pointerEvents: "none" }} />
                  )}
                  {el.type === "circle" && (
                    <div style={{ width: "100%", height: "100%", backgroundColor: el.color ?? "#FF7A00", borderRadius: "50%", pointerEvents: "none" }} />
                  )}
                </div>
              ))}

              {/* Empty state hint */}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white/40 pointer-events-none">
                    <Wand2 className="w-10 h-10 mx-auto mb-2" />
                    <p className="font-bold text-lg">Click to add elements</p>
                    <p className="text-sm mt-1">Select a tool and click anywhere</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Background panel */}
        <div className="w-48 bg-white border-l border-[#EAD9CC]/70 p-3 flex flex-col gap-4 overflow-y-auto flex-shrink-0">
          <div>
            <p className="text-[10px] font-black text-[#9A7560] uppercase tracking-wider mb-2">Background</p>
            <div className="grid grid-cols-4 gap-1.5">
              {BACKGROUNDS.map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setBackground(bg)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    background === bg ? "ring-2 ring-[#FF7A00] ring-offset-1" : "hover:scale-110"
                  } ${bg.startsWith("#") ? "" : `bg-gradient-to-br ${bg}`}`}
                  style={bg.startsWith("#") ? { backgroundColor: bg } : {}}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-[#9A7560] uppercase tracking-wider mb-2">Add Element</p>
            <div className="space-y-1">
              {[
                { tool: "text" as EditorTool,      icon: Type,    label: "Add Text" },
                { tool: "rectangle" as EditorTool, icon: Square,  label: "Rectangle" },
                { tool: "circle" as EditorTool,    icon: Circle,  label: "Circle" },
              ].map(item => (
                <button
                  key={item.tool}
                  onClick={() => setTool(item.tool)}
                  className={`flex items-center gap-2 w-full px-2.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    tool === item.tool ? "bg-[#FF7A00] text-white" : "text-[#6B3F2A] hover:bg-[#FFF7EF]"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

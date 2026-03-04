"use client"

import React, { useState, useCallback, useMemo, useRef } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type OnConnect,
  MarkerType,
  Panel,
  type NodeTypes,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import {
  Settings, Plus, Copy, Star, MoreHorizontal, User, FileText,
  DollarSign, Lock, XCircle, Trash2,
  CheckCircle, CreditCard, Shield, Stethoscope, GraduationCap,
  Search, ChevronUp, Layers, ClipboardList, PauseCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ─── TYPES ───────────────────────────────────────────────────── */

type NodeCategory = "data" | "evaluation" | "finance" | "status"

interface PipelineNodeData {
  label: string
  category: NodeCategory
  iconName: string
  [key: string]: unknown
}

interface DocRequirement {
  id: string
  label: string
  iconName: string
  enabled: boolean
  rule: "Mandatory" | "Optional"
}

interface Route {
  id: string
  name: string
  description: string
  isSystem: boolean
  isActive: boolean
  version?: string
  initialNodes: Node<PipelineNodeData>[]
  initialEdges: Edge[]
}

/* ─── ICON MAP ────────────────────────────────────────────────── */

const ICON_MAP: Record<string, React.ElementType> = {
  ClipboardList, FileText, User, DollarSign, CreditCard, Lock,
  XCircle, PauseCircle, Stethoscope, Shield, GraduationCap,
  CheckCircle,
}

function getIcon(name: string) {
  return ICON_MAP[name] ?? FileText
}

/* ─── CATEGORY COLORS ─────────────────────────────────────────── */

const CAT_STYLES: Record<NodeCategory, { border: string; bg: string; text: string }> = {
  data: { border: "border-l-sky-400", bg: "bg-sky-500/10", text: "text-sky-400" },
  evaluation: { border: "border-l-amber-400", bg: "bg-amber-500/10", text: "text-amber-400" },
  finance: { border: "border-l-emerald-400", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  status: { border: "border-l-rose-400", bg: "bg-rose-500/10", text: "text-rose-400" },
}

/* ─── NODE LIBRARY ────────────────────────────────────────────── */

const NODE_LIBRARY: { category: string; color: string; items: { iconName: string; label: string; cat: NodeCategory }[] }[] = [
  {
    category: "DATA",
    color: "text-sky-400",
    items: [
      { iconName: "ClipboardList", label: "Enquiry Form", cat: "data" },
      { iconName: "FileText", label: "Detailed Application", cat: "data" },
    ],
  },
  {
    category: "EVALUATION",
    color: "text-amber-400",
    items: [
      { iconName: "FileText", label: "Entrance Exam", cat: "evaluation" },
      { iconName: "User", label: "Interview Panel", cat: "evaluation" },
    ],
  },
  {
    category: "FINANCE",
    color: "text-emerald-400",
    items: [
      { iconName: "DollarSign", label: "Registration Fee", cat: "finance" },
      { iconName: "CreditCard", label: "Admission Fee", cat: "finance" },
    ],
  },
  {
    category: "STATUS",
    color: "text-rose-400",
    items: [
      { iconName: "Lock", label: "Final Seat Lock", cat: "status" },
      { iconName: "XCircle", label: "Reject Lead", cat: "status" },
    ],
  },
]

/* ─── CUSTOM REACT FLOW NODE ──────────────────────────────────── */

function PipelineNode({ data, id }: NodeProps<Node<PipelineNodeData>>) {
  const cat = CAT_STYLES[data.category] ?? CAT_STYLES.data
  const Icon = getIcon(data.iconName)

  return (
    <div className="relative group">
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!size-3 !rounded-full !border-2 !border-primary/60 !bg-background"
      />

      {/* Delete button -- visible on hover */}
      <button
        className="absolute -right-2 -top-2 z-10 flex size-5 items-center justify-center rounded-full border border-destructive/40 bg-destructive/90 text-white opacity-0 shadow-md transition-all group-hover:opacity-100 hover:scale-110"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          /* dispatch a custom event the parent FlowCanvas listens for */
          window.dispatchEvent(new CustomEvent("delete-pipeline-node", { detail: { nodeId: id } }))
        }}
        title="Delete node"
      >
        <Trash2 className="size-3" />
      </button>

      {/* Card */}
      <div className={cn(
        "flex items-center gap-3 rounded-xl border-l-4 border border-border/40 bg-card/80 px-4 py-3 shadow-lg backdrop-blur-xl transition-all hover:shadow-xl min-w-[180px] max-w-[220px]",
        cat.border,
      )}>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/30", cat.bg)}>
          <Icon className={cn("size-4", cat.text)} />
        </div>
        <span className="text-sm font-medium text-foreground leading-tight">{data.label}</span>
      </div>

      {/* Three-color output handles: Green (success), Yellow (hold), Red (fail) */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-5">
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-success`}
          className="!size-4 !rounded-full !border-2 !border-emerald-500/80 !bg-emerald-500/30 hover:!bg-emerald-500/60 !cursor-crosshair"
          style={{ position: "relative", left: "-20px", transform: "none" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-hold`}
          className="!size-4 !rounded-full !border-2 !border-amber-500/80 !bg-amber-500/30 hover:!bg-amber-500/60 !cursor-crosshair"
          style={{ position: "relative", left: "0px", transform: "none" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${id}-fail`}
          className="!size-4 !rounded-full !border-2 !border-rose-500/80 !bg-rose-500/30 hover:!bg-rose-500/60 !cursor-crosshair"
          style={{ position: "relative", left: "20px", transform: "none" }}
        />
      </div>
    </div>
  )
}

/* ─── EDGE COLOR HELPER ───────────────────────────────────────── */

function getEdgeColor(sourceHandle: string | null | undefined) {
  if (sourceHandle?.endsWith("-success")) return "#22c55e"
  if (sourceHandle?.endsWith("-hold")) return "#eab308"
  if (sourceHandle?.endsWith("-fail")) return "#ef4444"
  return "#3b82f6"
}

function getEdgeLabel(sourceHandle: string | null | undefined) {
  if (sourceHandle?.endsWith("-success")) return "Pass"
  if (sourceHandle?.endsWith("-hold")) return "Hold"
  if (sourceHandle?.endsWith("-fail")) return "Fail"
  return ""
}

/* ─── SEED DATA ───────────────────────────────────────────────── */

const SEED_ROUTES: Route[] = [
  {
    id: "r1",
    name: "Basic Enquiry Flow",
    description: "Basic Enquiry -> Admission Fee -> Seat Lock",
    isSystem: true,
    isActive: true,
    version: "1.0",
    initialNodes: [
      { id: "n1", type: "pipeline", position: { x: 250, y: 50 }, data: { label: "Basic Enquiry", category: "data", iconName: "User" } },
      { id: "n2", type: "pipeline", position: { x: 250, y: 220 }, data: { label: "Admission Fee", category: "finance", iconName: "DollarSign" } },
      { id: "n3", type: "pipeline", position: { x: 250, y: 390 }, data: { label: "Final Seat Lock", category: "status", iconName: "Lock" } },
    ],
    initialEdges: [
      { id: "e1-2", source: "n1", target: "n2", sourceHandle: "n1-success", style: { stroke: "#22c55e", strokeWidth: 2 }, label: "Pass", labelStyle: { fill: "#22c55e", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" }, type: "smoothstep" },
      { id: "e2-3", source: "n2", target: "n3", sourceHandle: "n2-success", style: { stroke: "#22c55e", strokeWidth: 2 }, label: "Pass", labelStyle: { fill: "#22c55e", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" }, type: "smoothstep" },
    ],
  },
  {
    id: "r2",
    name: "Senior Secondary Strict",
    description: "Full pipeline with entrance exam branching",
    isSystem: false,
    isActive: false,
    version: "2.0",
    initialNodes: [
      { id: "s1", type: "pipeline", position: { x: 300, y: 40 }, data: { label: "Basic Enquiry", category: "data", iconName: "User" } },
      { id: "s2", type: "pipeline", position: { x: 300, y: 200 }, data: { label: "Entrance Exam", category: "evaluation", iconName: "FileText" } },
      { id: "s3", type: "pipeline", position: { x: 100, y: 380 }, data: { label: "Interview Panel", category: "evaluation", iconName: "User" } },
      { id: "s4", type: "pipeline", position: { x: 100, y: 540 }, data: { label: "Admission Fee", category: "finance", iconName: "DollarSign" } },
      { id: "s5", type: "pipeline", position: { x: 100, y: 700 }, data: { label: "Final Seat Lock", category: "status", iconName: "Lock" } },
      { id: "s6", type: "pipeline", position: { x: 350, y: 380 }, data: { label: "Waitlist Hold", category: "status", iconName: "PauseCircle" } },
      { id: "s7", type: "pipeline", position: { x: 550, y: 380 }, data: { label: "Reject Lead", category: "status", iconName: "XCircle" } },
    ],
    initialEdges: [
      { id: "se1-2", source: "s1", target: "s2", sourceHandle: "s1-success", style: { stroke: "#22c55e", strokeWidth: 2 }, label: "Pass", labelStyle: { fill: "#22c55e", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" }, type: "smoothstep" },
      { id: "se2-3", source: "s2", target: "s3", sourceHandle: "s2-success", style: { stroke: "#22c55e", strokeWidth: 2 }, label: "Pass", labelStyle: { fill: "#22c55e", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" }, type: "smoothstep" },
      { id: "se2-6", source: "s2", target: "s6", sourceHandle: "s2-hold", style: { stroke: "#eab308", strokeWidth: 2 }, label: "Hold", labelStyle: { fill: "#eab308", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#eab308" }, type: "smoothstep" },
      { id: "se2-7", source: "s2", target: "s7", sourceHandle: "s2-fail", style: { stroke: "#ef4444", strokeWidth: 2 }, label: "Fail", labelStyle: { fill: "#ef4444", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#ef4444" }, type: "smoothstep" },
      { id: "se3-4", source: "s3", target: "s4", sourceHandle: "s3-success", style: { stroke: "#22c55e", strokeWidth: 2 }, label: "Pass", labelStyle: { fill: "#22c55e", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" }, type: "smoothstep" },
      { id: "se4-5", source: "s4", target: "s5", sourceHandle: "s4-success", style: { stroke: "#22c55e", strokeWidth: 2 }, label: "Pass", labelStyle: { fill: "#22c55e", fontSize: 10, fontWeight: 600 }, markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" }, type: "smoothstep" },
    ],
  },
]

const SEED_DOCS: DocRequirement[] = [
  { id: "d1", label: "Aadhaar Card", iconName: "CreditCard", enabled: true, rule: "Mandatory" },
  { id: "d2", label: "Previous School SLC / TC", iconName: "GraduationCap", enabled: true, rule: "Optional" },
  { id: "d3", label: "Medical Fitness Certificate", iconName: "Stethoscope", enabled: false, rule: "Optional" },
  { id: "d4", label: "Caste Certificate", iconName: "Shield", enabled: false, rule: "Optional" },
  { id: "d5", label: "Birth Certificate", iconName: "FileText", enabled: true, rule: "Mandatory" },
]

/* ─── DOCUMENT ROW ────────────────────────────────────────────── */

function DocRow({
  doc, onToggle, onRuleChange,
}: {
  doc: DocRequirement
  onToggle: () => void
  onRuleChange: (rule: "Mandatory" | "Optional") => void
}) {
  const Icon = getIcon(doc.iconName)
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card/60 px-4 py-3 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-3">
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/40 bg-background/50">
          <Icon className="size-4 text-foreground" />
        </div>
        <span className="text-sm font-medium text-foreground truncate">{doc.label}</span>
      </div>
      <div className="flex items-center gap-2 pl-12 sm:pl-0">
        {doc.enabled && (
          <select
            value={doc.rule}
            onChange={(e) => onRuleChange(e.target.value as "Mandatory" | "Optional")}
            className="h-7 rounded-lg border border-border/50 bg-background/60 px-2 text-xs text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            <option value="Mandatory">Mandatory</option>
            <option value="Optional">Optional</option>
          </select>
        )}
        <Switch checked={doc.enabled} onCheckedChange={onToggle} />
      </div>
    </div>
  )
}

/* ─── ROUTE CARD ──────────────────────────────────────────────── */

function RouteCard({
  route, onEdit, onDuplicate,
}: {
  route: Route
  onEdit: () => void
  onDuplicate: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        {route.isActive && (
          <Badge className="bg-primary/15 text-primary border-primary/30">Active</Badge>
        )}
        {route.isSystem ? (
          <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
            <Star className="size-3" /> System Default
          </Badge>
        ) : (
          <Badge variant="outline" className="border-border/50 text-muted-foreground">Custom</Badge>
        )}
        {route.version && (
          <span className="text-[10px] text-muted-foreground">v{route.version}</span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground sm:text-base">{route.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{route.description}</p>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Button size="sm" onClick={onEdit} className="shadow-md shadow-primary/20">
          Edit Workspace
        </Button>
        <button onClick={onDuplicate} className="flex size-8 items-center justify-center rounded-lg border border-border/40 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Duplicate route">
          <Copy className="size-4" />
        </button>
        {!route.isSystem && (
          <div className="relative ml-auto">
            <button onClick={() => setMenuOpen(v => !v)} className="flex size-8 items-center justify-center rounded-lg border border-border/40 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="More options">
              <MoreHorizontal className="size-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-10 z-50 w-48 rounded-xl border border-border/40 bg-card/90 p-1.5 shadow-xl backdrop-blur-2xl">
                  <button onClick={() => { onDuplicate(); setMenuOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"><Copy className="size-3.5" /> Duplicate</button>
                  <button onClick={() => setMenuOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"><Star className="size-3.5" /> Set as Default</button>
                  <button onClick={() => setMenuOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"><Trash2 className="size-3.5" /> Delete</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── NODE SIDEBAR ────────────────────────────────────────────── */

function NodeSidebar({ canvasNodeLabels, onSpawn, className }: {
  canvasNodeLabels: string[]
  onSpawn: (item: { iconName: string; label: string; cat: NodeCategory }) => void
  className?: string
}) {
  const [search, setSearch] = useState("")
  const filtered = NODE_LIBRARY.map(cat => ({
    ...cat,
    items: cat.items
      .filter(i => !canvasNodeLabels.includes(i.label))
      .filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
  })).filter(c => c.items.length > 0)

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search Nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border/40 bg-background/50 py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">All nodes on canvas</p>
        )}
        {filtered.map(cat => (
          <div key={cat.category}>
            <p className={cn("mb-1.5 text-[10px] font-bold uppercase tracking-widest", cat.color)}>{cat.category}</p>
            <div className="flex flex-col gap-1.5">
              {cat.items.map(item => {
                const Icon = getIcon(item.iconName)
                return (
                  <button
                    key={item.label}
                    onClick={() => onSpawn(item)}
                    className="flex items-center gap-2.5 rounded-lg border border-border/30 bg-background/30 px-3 py-2.5 text-left text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-95"
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{item.label}</span>
                    <Plus className="ml-auto size-3 text-muted-foreground" />
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── FLOW CANVAS COMPONENT ───────────────────────────────────── */

function FlowCanvas({ route, onSpawnNode }: {
  route: Route
  onSpawnNode: (label: string) => void
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(route.initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(route.initialEdges)
  const [nodeTrayOpen, setNodeTrayOpen] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  /* Listen for delete events from PipelineNode */
  React.useEffect(() => {
    function handleDelete(e: Event) {
      const nodeId = (e as CustomEvent).detail?.nodeId
      if (!nodeId) return
      setNodes(nds => nds.filter(n => n.id !== nodeId))
      setEdges(eds => eds.filter(ed => ed.source !== nodeId && ed.target !== nodeId))
    }
    window.addEventListener("delete-pipeline-node", handleDelete)
    return () => window.removeEventListener("delete-pipeline-node", handleDelete)
  }, [setNodes, setEdges])

  const nodeTypes: NodeTypes = useMemo(() => ({
    pipeline: PipelineNode,
  }), [])

  const onConnect: OnConnect = useCallback((params: Connection) => {
    const color = getEdgeColor(params.sourceHandle)
    const label = getEdgeLabel(params.sourceHandle)
    const newEdge: Edge = {
      ...params,
      id: `e-${params.source}-${params.target}-${Date.now()}`,
      type: "smoothstep",
      style: { stroke: color, strokeWidth: 2 },
      label,
      labelStyle: { fill: color, fontSize: 10, fontWeight: 600 },
      markerEnd: { type: MarkerType.ArrowClosed, color },
    }
    setEdges((eds) => addEdge(newEdge, eds))
  }, [setEdges])

  const canvasNodeLabels = nodes.map(n => (n.data as PipelineNodeData).label)

  function handleSpawn(item: { iconName: string; label: string; cat: NodeCategory }) {
    const id = `n-${Date.now()}`
    const newNode: Node<PipelineNodeData> = {
      id,
      type: "pipeline",
      position: { x: 200 + Math.random() * 200, y: 100 + nodes.length * 160 },
      data: { label: item.label, category: item.cat, iconName: item.iconName },
    }
    setNodes(nds => [...nds, newNode])
  }

  return (
    <div className="relative flex h-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/30 bg-card/40 p-4 backdrop-blur-md">
        <div className="mb-3 flex items-center gap-2">
          <Layers className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Node Library</span>
        </div>
        <NodeSidebar canvasNodeLabels={canvasNodeLabels} onSpawn={handleSpawn} className="flex-1 min-h-0" />
      </div>

      {/* Canvas */}
      <div ref={reactFlowWrapper} className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-background/50"
          deleteKeyCode={["Backspace", "Delete"]}
          snapToGrid
          snapGrid={[20, 20]}
        >
          <Background gap={20} size={1} className="!bg-background" />
          <Controls className="!rounded-xl !border !border-border/40 !bg-card/80 !shadow-lg !backdrop-blur-xl [&>button]:!border-border/30 [&>button]:!bg-transparent [&>button]:!text-foreground [&>button:hover]:!bg-accent" />
          <MiniMap
            className="!rounded-xl !border !border-border/40 !bg-card/60 !backdrop-blur-xl"
            maskColor="rgba(0,0,0,0.2)"
            nodeColor={(n) => {
              const cat = (n.data as PipelineNodeData)?.category
              if (cat === "data") return "#38bdf8"
              if (cat === "evaluation") return "#fbbf24"
              if (cat === "finance") return "#34d399"
              if (cat === "status") return "#fb7185"
              return "#60a5fa"
            }}
          />


        </ReactFlow>

        {/* Mobile Node Tray Toggle */}
        <button
          onClick={() => setNodeTrayOpen(v => !v)}
          className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-2.5 text-sm font-medium text-primary shadow-lg shadow-primary/10 backdrop-blur-xl transition-all hover:bg-primary/25 md:hidden"
        >
          <Layers className="size-4" />
          Node Library
          <ChevronUp className={cn("size-4 transition-transform", nodeTrayOpen && "rotate-180")} />
        </button>

        {/* Mobile Node Tray Sheet */}
        <Sheet open={nodeTrayOpen} onOpenChange={setNodeTrayOpen}>
          <SheetContent side="bottom" className="max-h-[70dvh] rounded-t-2xl border-t border-border/40 bg-card/90 px-4 pb-8 backdrop-blur-2xl">
            <div className="mx-auto mb-3 mt-2 h-1 w-10 rounded-full bg-border/50" />
            <SheetHeader className="pb-3">
              <SheetTitle className="flex items-center gap-2 text-base">
                <Layers className="size-4 text-primary" /> Node Library
              </SheetTitle>
            </SheetHeader>
            <NodeSidebar canvasNodeLabels={canvasNodeLabels} onSpawn={(item) => { handleSpawn(item); setNodeTrayOpen(false) }} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

/* ─── ANCHOR LEGEND ───────────────────────────────────────────── */

function AnchorLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-3 py-2 backdrop-blur-xl text-[11px]">
      <span className="font-semibold text-muted-foreground uppercase tracking-wider mr-1">Anchors:</span>
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-emerald-500" /> <span className="text-emerald-600 dark:text-emerald-400 font-medium">Pass</span></span>
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-amber-500" /> <span className="text-amber-600 dark:text-amber-400 font-medium">Hold</span></span>
      <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-rose-500" /> <span className="text-rose-600 dark:text-rose-400 font-medium">Fail</span></span>
    </div>
  )
}

/* ─── MAIN PAGE ───────────────────────────────────────────────── */

export default function AdmissionSetupPage() {
  const [globalLive, setGlobalLive] = useState(true)
  const [routes, setRoutes] = useState<Route[]>(SEED_ROUTES)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [isNewRoute, setIsNewRoute] = useState(false)
  const [docs, setDocs] = useState<DocRequirement[]>(SEED_DOCS)
  const [drawerOpen, setDrawerOpen] = useState(false)

  function openWorkspace(route: Route, isNew = false) {
    setEditingRoute(route)
    setIsNewRoute(isNew)
    setDrawerOpen(true)
  }

  function duplicateRoute(route: Route) {
    const id = `r${Date.now()}`
    const clone: Route = {
      ...route,
      id,
      name: `${route.name} (Copy)`,
      isSystem: false,
      isActive: false,
      initialNodes: route.initialNodes.map(n => ({ ...n, id: `${id}-${n.id}` })),
      initialEdges: route.initialEdges.map(e => ({
        ...e,
        id: `${id}-${e.id}`,
        source: `${id}-${e.source}`,
        target: `${id}-${e.target}`,
        sourceHandle: e.sourceHandle ? `${id}-${e.sourceHandle}` : undefined,
      })),
    }
    setRoutes(prev => [...prev, clone])
  }

  function createBlank() {
    const id = `r${Date.now()}`
    const blank: Route = {
      id,
      name: "New Route",
      description: "Empty admission pipeline",
      isSystem: false,
      isActive: false,
      version: "1.0",
      initialNodes: [
        { id: `${id}-n1`, type: "pipeline", position: { x: 250, y: 80 }, data: { label: "Basic Enquiry", category: "data" as NodeCategory, iconName: "User" } },
      ],
      initialEdges: [],
    }
    setRoutes(prev => [...prev, blank])
    openWorkspace(blank, true)
  }

  function toggleDoc(id: string) {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, enabled: !d.enabled } : d))
  }

  function changeDocRule(id: string, rule: "Mandatory" | "Optional") {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, rule } : d))
  }

  return (
    <DashboardShell>
      {/* ── Title Bar ───────────────────────────────────── */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <Settings className="size-4 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            Admission Setup
          </h1>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/60 px-3 py-2 backdrop-blur-xl sm:px-4 sm:py-2.5">
          <span className="text-xs font-medium text-foreground sm:text-sm">
            {"Admissions: "}
            <span className={cn("font-semibold", globalLive ? "text-primary" : "text-muted-foreground")}>
              {globalLive ? "LIVE" : "OFF"}
            </span>
          </span>
          <Switch checked={globalLive} onCheckedChange={setGlobalLive} />
        </div>
      </div>

      {/* ── Route Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map(route => (
          <RouteCard
            key={route.id}
            route={route}
            onEdit={() => openWorkspace(route)}
            onDuplicate={() => duplicateRoute(route)}
          />
        ))}

        {/* Create New */}
        <button
          onClick={createBlank}
          className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/50 bg-card/30 p-8 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="size-6" />
          <span className="text-sm font-medium">Create New Route</span>
        </button>
      </div>

      {/* ── Workspace Drawer ────────────────────────────── */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-[100vw] border-border/40 bg-card/80 p-0 backdrop-blur-2xl md:w-[90vw] md:max-w-[90vw]"
        >
          <div className="flex h-full flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                  <Layers className="size-4 text-primary" />
                </div>
                <div>
                  <SheetHeader className="p-0">
                    <SheetTitle className="text-sm font-semibold sm:text-base">{editingRoute?.name ?? "Pipeline"}</SheetTitle>
                  </SheetHeader>
                  <p className="text-[11px] text-muted-foreground">{editingRoute?.description}</p>
                </div>
              </div>
              <AnchorLegend />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="flow" className="flex flex-1 flex-col min-h-0">
              <div className="border-b border-border/30 bg-card/40 px-4 sm:px-6">
                <TabsList className="h-10 bg-transparent">
                  <TabsTrigger value="flow" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <Layers className="size-3.5" /> Flow Canvas
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    <FileText className="size-3.5" /> Required Docs
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* FLOW CANVAS TAB */}
              <TabsContent value="flow" className="flex-1 m-0 min-h-0">
                {editingRoute && (
                  <FlowCanvas
                    key={editingRoute.id}
                    route={editingRoute}
                    onSpawnNode={() => {}}
                  />
                )}
              </TabsContent>

              {/* REQUIRED DOCS TAB */}
              <TabsContent value="docs" className="flex-1 m-0 overflow-y-auto p-4 sm:p-6">
                <div className="mx-auto max-w-2xl">
                  <div className="mb-4 flex items-center gap-2">
                    <FileText className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Required Documents</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {docs.map(doc => (
                      <DocRow
                        key={doc.id}
                        doc={doc}
                        onToggle={() => toggleDoc(doc.id)}
                        onRuleChange={(rule) => changeDocRule(doc.id, rule)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* ── Footer: Save / Cancel ─────────────────── */}
            <div className="flex items-center justify-between border-t border-border/30 bg-card/60 px-4 py-3 backdrop-blur-xl sm:px-6">
              <div className="flex items-center gap-2">
                {editingRoute?.version && (
                  <span className="text-[11px] text-muted-foreground">v{editingRoute.version}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (isNewRoute && editingRoute) {
                      /* Remove the blank route that was added */
                      setRoutes(prev => prev.filter(r => r.id !== editingRoute.id))
                    }
                    setDrawerOpen(false)
                  }}
                  className="border-border/50"
                >
                  Cancel
                </Button>
                {isNewRoute || !editingRoute?.isSystem ? (
                  <Button
                    size="sm"
                    onClick={() => setDrawerOpen(false)}
                    className="shadow-md shadow-primary/20"
                  >
                    {isNewRoute ? "Save Route" : "Save Changes"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (editingRoute) {
                        const nextVer = editingRoute.version
                          ? `${parseFloat(editingRoute.version) + 0.1}`
                          : "1.1"
                        setRoutes(prev =>
                          prev.map(r =>
                            r.id === editingRoute.id ? { ...r, version: nextVer } : r
                          )
                        )
                      }
                      setDrawerOpen(false)
                    }}
                    className="shadow-md shadow-primary/20"
                  >
                    Save as New Version
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}

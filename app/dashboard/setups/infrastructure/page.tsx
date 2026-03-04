"use client"

import { useState, useMemo } from "react"
import {
  Plus, Warehouse, DoorOpen, LayoutGrid, Trash2,
  Unlink, Link2, Search, Building2, Users,
  BookOpen, Dumbbell, Music2, FlaskConical,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { DashboardShell } from "@/components/dashboard/shell"
import { cn } from "@/lib/utils"

/* ═══════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════ */

type RoomType = "classroom" | "curriculum" | "library" | "activity"

interface Room {
  id: string
  name: string
  type: RoomType
  capacity: number
  blockId: string | null // null = unassigned (in pool)
}

interface Block {
  id: string
  name: string
  floors: number
  primaryFunction: string
}

/* ═══════════════════════════════════════════════════════
   Semantic Color Map
   ═══════════════════════════════════════════════════════ */

const ROOM_STYLES: Record<RoomType, {
  label: string
  icon: LucideIcon
  bg: string
  border: string
  text: string
  dot: string
}> = {
  classroom: {
    label: "Classroom",
    icon: DoorOpen,
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    text: "text-sky-600 dark:text-sky-400",
    dot: "bg-sky-500",
  },
  curriculum: {
    label: "Curriculum Room",
    icon: FlaskConical,
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  library: {
    label: "Library",
    icon: BookOpen,
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  activity: {
    label: "Activity / Hall",
    icon: Dumbbell,
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
  },
}

const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = [
  { value: "classroom", label: "Classroom" },
  { value: "curriculum", label: "Curriculum Room" },
  { value: "library", label: "Library" },
  { value: "activity", label: "Activity / Hall" },
]

/* ═══════════════════════════════════════════════════════
   Seed Data
   ═══════════════════════════════════════════════════════ */

const INITIAL_ROOMS: Room[] = [
  { id: "r1", name: "Room 101", type: "classroom", capacity: 40, blockId: null },
  { id: "r2", name: "Room 102", type: "classroom", capacity: 40, blockId: null },
  { id: "r3", name: "Room 103", type: "classroom", capacity: 35, blockId: null },
  { id: "r4", name: "Physics Lab", type: "curriculum", capacity: 30, blockId: "b1" },
  { id: "r5", name: "Chemistry Lab", type: "curriculum", capacity: 30, blockId: "b1" },
  { id: "r6", name: "Computer Lab", type: "curriculum", capacity: 25, blockId: "b1" },
  { id: "r7", name: "Main Library", type: "library", capacity: 80, blockId: "b2" },
  { id: "r8", name: "Reading Room", type: "library", capacity: 30, blockId: "b2" },
  { id: "r9", name: "Assembly Hall", type: "activity", capacity: 200, blockId: null },
  { id: "r10", name: "Sports Room", type: "activity", capacity: 50, blockId: null },
  { id: "r11", name: "Music Room", type: "activity", capacity: 25, blockId: null },
  { id: "r12", name: "Room 201", type: "classroom", capacity: 40, blockId: "b3" },
  { id: "r13", name: "Room 202", type: "classroom", capacity: 40, blockId: "b3" },
  { id: "r14", name: "Art Studio", type: "curriculum", capacity: 20, blockId: null },
]

const INITIAL_BLOCKS: Block[] = [
  { id: "b1", name: "Science Wing", floors: 2, primaryFunction: "Laboratories" },
  { id: "b2", name: "Knowledge Centre", floors: 1, primaryFunction: "Library & Media" },
  { id: "b3", name: "Senior Block", floors: 3, primaryFunction: "Senior Classrooms" },
]

/* ═══════════════════════════════════════════════════════
   Room Box Component
   ═══════════════════════════════════════════════════════ */

function RoomBox({
  room,
  showDetach,
  onDetach,
}: {
  room: Room
  showDetach?: boolean
  onDetach?: () => void
}) {
  const style = ROOM_STYLES[room.type]
  const Icon = style.icon
  return (
    <div
      className={cn(
        "group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 backdrop-blur-sm transition-all",
        style.bg, style.border,
        "hover:shadow-md"
      )}
    >
      <Icon className={cn("size-4 shrink-0", style.text)} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{room.name}</p>
        <p className={cn("text-[10px] font-medium", style.text)}>
          Cap: {room.capacity}
        </p>
      </div>
      {showDetach && onDetach && (
        <button
          onClick={onDetach}
          className="rounded-md p-1 opacity-0 transition-opacity hover:bg-background/60 group-hover:opacity-100"
          title="Detach room"
        >
          <Unlink className="size-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   Main Page
   ═══════════════════════════════════════════════════════ */

export default function InfrastructurePage() {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS)
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS)

  // Dialogs
  const [roomDialogOpen, setRoomDialogOpen] = useState(false)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [attachDialogOpen, setAttachDialogOpen] = useState(false)
  const [attachBlockId, setAttachBlockId] = useState<string | null>(null)

  // New room form
  const [newRoom, setNewRoom] = useState({ name: "", type: "classroom" as RoomType, capacity: "40" })

  // New block form
  const [newBlock, setNewBlock] = useState({ name: "", floors: "1", primaryFunction: "" })

  // Pool search
  const [poolSearch, setPoolSearch] = useState("")

  // Sidebar open on mobile
  const [poolOpen, setPoolOpen] = useState(false)

  /* ── Derived ────────────────────────────────────── */

  const unassignedRooms = useMemo(
    () => rooms.filter(r => r.blockId === null),
    [rooms]
  )

  const filteredPool = useMemo(
    () => unassignedRooms.filter(r =>
      r.name.toLowerCase().includes(poolSearch.toLowerCase()) ||
      ROOM_STYLES[r.type].label.toLowerCase().includes(poolSearch.toLowerCase())
    ),
    [unassignedRooms, poolSearch]
  )

  const mappedRooms = useMemo(() => rooms.filter(r => r.blockId !== null), [rooms])
  const totalCapacity = useMemo(() => rooms.reduce((s, r) => s + r.capacity, 0), [rooms])

  /* ── Actions ────────────────────────────────────── */

  function handleCreateRoom() {
    if (!newRoom.name.trim()) return
    const room: Room = {
      id: `r${Date.now()}`,
      name: newRoom.name.trim(),
      type: newRoom.type,
      capacity: parseInt(newRoom.capacity) || 30,
      blockId: null,
    }
    setRooms(prev => [...prev, room])
    setNewRoom({ name: "", type: "classroom", capacity: "40" })
    setRoomDialogOpen(false)
  }

  function handleCreateBlock() {
    if (!newBlock.name.trim()) return
    const block: Block = {
      id: `b${Date.now()}`,
      name: newBlock.name.trim(),
      floors: parseInt(newBlock.floors) || 1,
      primaryFunction: newBlock.primaryFunction || "General",
    }
    setBlocks(prev => [...prev, block])
    setNewBlock({ name: "", floors: "1", primaryFunction: "" })
    setBlockDialogOpen(false)
  }

  function handleDetach(roomId: string) {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, blockId: null } : r))
  }

  function handleAttach(roomId: string) {
    if (!attachBlockId) return
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, blockId: attachBlockId } : r))
  }

  function handleDeleteBlock(blockId: string) {
    // Detach all rooms first
    setRooms(prev => prev.map(r => r.blockId === blockId ? { ...r, blockId: null } : r))
    setBlocks(prev => prev.filter(b => b.id !== blockId))
  }

  /* ── Type legend ────────────────────────────────── */

  const typeCounts = useMemo(() => {
    const counts: Record<RoomType, number> = { classroom: 0, curriculum: 0, library: 0, activity: 0 }
    unassignedRooms.forEach(r => counts[r.type]++)
    return counts
  }, [unassignedRooms])

  return (
    <DashboardShell>
      {/* ── Title Bar ─────────────────────────────── */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-lg font-semibold text-foreground md:text-xl">
            Infrastructure Asset & Mapping
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Create rooms, then anchor them to building blocks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setRoomDialogOpen(true)}
            className="gap-1.5 shadow-md shadow-primary/20"
          >
            <Plus className="size-4" /> New Room Asset
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setBlockDialogOpen(true)}
            className="gap-1.5 border-border/60"
          >
            <Plus className="size-4" /> New Building Block
          </Button>
        </div>
      </div>

      {/* ── Mobile Pool Toggle ────────────────────── */}
      <button
        onClick={() => setPoolOpen(v => !v)}
        className="mb-3 flex w-full items-center justify-between rounded-xl border border-border/40 bg-card/60 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-xl lg:hidden"
      >
        <span className="flex items-center gap-2">
          <LayoutGrid className="size-4 text-primary" />
          Room Assets Inventory
          <Badge variant="secondary" className="ml-1 text-xs">{unassignedRooms.length}</Badge>
        </span>
        <span className="text-xs text-muted-foreground">{poolOpen ? "Hide" : "Show"}</span>
      </button>

      {/* ── Split Layout ──────────────────────────── */}
      <div className="relative flex gap-6">

        {/* ── LEFT: Global Asset Pool ─────────────── */}
        <aside className={cn(
          "shrink-0 transition-all lg:block lg:w-72 xl:w-80",
          poolOpen ? "block w-full lg:w-72 xl:w-80" : "hidden"
        )}>
          <div className="sticky top-20 relative rounded-2xl border border-border/40 bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Room Assets Inventory</h2>
                <p className="text-[11px] text-muted-foreground">Unassigned spaces</p>
              </div>
              <Badge variant="outline" className="border-primary/40 text-primary">
                {unassignedRooms.length}
              </Badge>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={poolSearch}
                onChange={e => setPoolSearch(e.target.value)}
                className="h-8 bg-background/60 pl-9 text-sm"
              />
            </div>

            {/* Type legend */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {(Object.keys(ROOM_STYLES) as RoomType[]).map(type => {
                const s = ROOM_STYLES[type]
                return (
                  <span
                    key={type}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium",
                      s.bg, s.border, s.text
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", s.dot)} />
                    {s.label} ({typeCounts[type]})
                  </span>
                )
              })}
            </div>

            {/* Room list */}
            <div className="relative flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {filteredPool.length === 0 && (
                <p className="py-8 text-center text-xs text-muted-foreground">
                  {poolSearch ? "No matches found." : "All rooms have been assigned."}
                </p>
              )}
              {filteredPool.map(room => (
                <RoomBox key={room.id} room={room} />
              ))}
            </div>
          </div>
        </aside>

        {/* ── RIGHT: Virtual Campus Blueprint ─────── */}
        <div className="min-w-0 flex-1">
          {blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-card/30 py-20 text-center backdrop-blur-sm">
              <Warehouse className="mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No building blocks yet</p>
              <p className="mb-4 text-xs text-muted-foreground/70">Create your first block to start mapping rooms.</p>
              <Button size="sm" variant="outline" onClick={() => setBlockDialogOpen(true)} className="gap-1.5">
                <Plus className="size-4" /> Create Block
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {blocks.map(block => {
                const blockRooms = rooms.filter(r => r.blockId === block.id)
                const blockCapacity = blockRooms.reduce((s, r) => s + r.capacity, 0)
                return (
                  <div
                    key={block.id}
                    className="group/block rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl transition-shadow hover:shadow-lg hover:shadow-primary/5"
                  >
                    {/* Block Header */}
                    <div className="flex flex-col gap-2 border-b border-border/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                          <Building2 className="size-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{block.name}</h3>
                          <p className="text-[11px] text-muted-foreground">
                            {block.floors} Floor{block.floors > 1 ? "s" : ""} &middot; {block.primaryFunction}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1 border-border/50 text-xs">
                          <Users className="size-3" /> {blockCapacity} Seats
                        </Badge>
                        <Badge variant="outline" className="gap-1 border-border/50 text-xs">
                          <DoorOpen className="size-3" /> {blockRooms.length} Rooms
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 gap-1 text-xs text-primary hover:text-primary"
                          onClick={() => {
                            setAttachBlockId(block.id)
                            setAttachDialogOpen(true)
                          }}
                        >
                          <Link2 className="size-3.5" /> Attach Room
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBlock(block.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* The Nest (Drop Zone) */}
                    <div className="px-5 py-4">
                      {blockRooms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/40 bg-background/20 py-8 text-center">
                          <LayoutGrid className="mb-2 size-6 text-muted-foreground/30" />
                          <p className="text-xs text-muted-foreground">
                            No rooms attached yet.
                          </p>
                          <button
                            onClick={() => {
                              setAttachBlockId(block.id)
                              setAttachDialogOpen(true)
                            }}
                            className="mt-2 text-xs font-medium text-primary hover:underline"
                          >
                            Attach from pool
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2.5">
                          {blockRooms.map(room => (
                            <RoomBox
                              key={room.id}
                              room={room}
                              showDetach
                              onDetach={() => handleDetach(room.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Fixed Footer Summary ──────────────────── */}
      <div className="mt-6 rounded-2xl border border-border/40 bg-card/60 px-5 py-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Building2 className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{blocks.length}</span> Blocks Active
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <DoorOpen className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{mappedRooms.length}</span> Rooms Mapped
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3.5 text-primary" />
            <span className="font-semibold text-foreground">{totalCapacity.toLocaleString()}</span> Total Desk Capacity
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
         Room Create Dialog
         ═══════════════════════════════════════════════ */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Room Asset</DialogTitle>
            <DialogDescription>Add a new room to the global asset pool.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Room Name / Number</Label>
              <Input
                placeholder="e.g. Room 301"
                value={newRoom.name}
                onChange={e => setNewRoom(p => ({ ...p, name: e.target.value }))}
                className="bg-background/60"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Room Type</Label>
              <Select value={newRoom.type} onValueChange={v => setNewRoom(p => ({ ...p, type: v as RoomType }))}>
                <SelectTrigger className="bg-background/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPE_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Preview color */}
              <div className={cn(
                "mt-1 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium",
                ROOM_STYLES[newRoom.type].bg,
                ROOM_STYLES[newRoom.type].border,
                ROOM_STYLES[newRoom.type].text
              )}>
                <span className={cn("size-2 rounded-full", ROOM_STYLES[newRoom.type].dot)} />
                {ROOM_STYLES[newRoom.type].label}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Physical Seat Capacity</Label>
              <Input
                type="number"
                min={1}
                value={newRoom.capacity}
                onChange={e => setNewRoom(p => ({ ...p, capacity: e.target.value }))}
                className="bg-background/60"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateRoom} className="gap-1.5 shadow-md shadow-primary/20">
              <Plus className="size-4" /> Create Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════
         Block Create Dialog
         ═══════════════════════════════════════════════ */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Building Block</DialogTitle>
            <DialogDescription>Define a new physical block for the campus blueprint.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Block Name</Label>
              <Input
                placeholder="e.g. Block A / Senior Wing"
                value={newBlock.name}
                onChange={e => setNewBlock(p => ({ ...p, name: e.target.value }))}
                className="bg-background/60"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Number of Floors</Label>
              <Input
                type="number"
                min={1}
                value={newBlock.floors}
                onChange={e => setNewBlock(p => ({ ...p, floors: e.target.value }))}
                className="bg-background/60"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Function</Label>
              <Select value={newBlock.primaryFunction} onValueChange={v => setNewBlock(p => ({ ...p, primaryFunction: v }))}>
                <SelectTrigger className="bg-background/60">
                  <SelectValue placeholder="Select function" />
                </SelectTrigger>
                <SelectContent>
                  {["General Classrooms", "Laboratories", "Library & Media", "Administration", "Sports & Activities"].map(fn => (
                    <SelectItem key={fn} value={fn}>{fn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateBlock} className="gap-1.5 shadow-md shadow-primary/20">
              <Plus className="size-4" /> Create Block
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════
         Attach Room Dialog
         ═══════════════════════════════════════════════ */}
      <Dialog open={attachDialogOpen} onOpenChange={setAttachDialogOpen}>
        <DialogContent className="border-border/50 bg-card/90 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Attach Room to Block</DialogTitle>
            <DialogDescription>
              Select unassigned rooms to attach to{" "}
              <span className="font-semibold text-foreground">
                {blocks.find(b => b.id === attachBlockId)?.name || "this block"}
              </span>.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-72 overflow-y-auto py-2">
            {unassignedRooms.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No unassigned rooms available. Create new rooms first.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {unassignedRooms.map(room => {
                  const style = ROOM_STYLES[room.type]
                  const Icon = style.icon
                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        handleAttach(room.id)
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all hover:shadow-md",
                        style.bg, style.border
                      )}
                    >
                      <Icon className={cn("size-4 shrink-0", style.text)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{room.name}</p>
                        <p className="text-[10px] text-muted-foreground">{style.label} &middot; Cap: {room.capacity}</p>
                      </div>
                      <Link2 className="size-4 shrink-0 text-primary" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttachDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

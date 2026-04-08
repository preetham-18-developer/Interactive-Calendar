"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Grid3x3, List, Search, X, Camera, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import ImgStack from "./image-stack";

// IMPORT SOUNDS AND EFFECTS
import { playSound } from "@/utils/audioUtils";
import { SpecialEffects } from "@/components/SpecialEffects";

export interface Event {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  color: string
  category?: string
  attendees?: string[]
  tags?: string[]
  type?: 'Birthday' | 'Anniversary' | 'Festival' | 'Holiday' | 'Meeting'
  images?: string[] // Added for memories
}

export interface EventManagerProps {
  events?: Event[]
  onEventCreate?: (event: Omit<Event, "id">) => void
  onEventUpdate?: (id: string, event: Partial<Event>) => void
  onEventDelete?: (id: string) => void
  categories?: string[]
  colors?: { name: string; value: string; bg: string; text: string }[]
  defaultView?: "month" | "week" | "day" | "list"
  className?: string
  availableTags?: string[]
}

const defaultColors = [
  { name: "Blue", value: "blue", bg: "bg-blue-500", text: "text-blue-700" },
  { name: "Green", value: "green", bg: "bg-green-500", text: "text-green-700" },
  { name: "Purple", value: "purple", bg: "bg-purple-500", text: "text-purple-700" },
  { name: "Orange", value: "orange", bg: "bg-orange-500", text: "text-orange-700" },
  { name: "Pink", value: "pink", bg: "bg-pink-500", text: "text-pink-700" },
  { name: "Red", value: "red", bg: "bg-red-500", text: "text-red-700" },
]

export function EventManager({
  events: initialEvents = [],
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  categories = ["Meeting", "Task", "Reminder", "Personal", "Birthday", "Anniversary", "Festival", "Holiday"],
  colors = defaultColors,
  defaultView = "month",
  className,
}: EventManagerProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "day" | "list" | "cards">(defaultView)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<Event | null>(null)
  
  const [activeEventAnim, setActiveEventAnim] = useState<string | null>(null);

  const [flipState, setFlipState] = useState<{
    direction: "next" | "prev";
    baseDate: Date;
    flipDates: Date[];
    targetDate: Date;
  } | null>(null);

  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    description: "",
    color: colors[0].value,
    category: categories[0],
    tags: [],
    images: []
  })

  const [searchQuery, setSearchQuery] = useState("")

  const handleDateClick = useCallback((date: Date, hour?: number) => {
    const start = new Date(date)
    if (hour !== undefined) {
       start.setHours(hour, 0, 0, 0)
    } else {
       start.setHours(10, 0, 0, 0)
    }
    const end = new Date(start)
    end.setHours(start.getHours() + 1)
    
    setNewEvent({
       title: "",
       description: "",
       color: colors[0].value,
       category: categories[0],
       tags: [],
       startTime: start,
       endTime: end,
       images: []
    })
    setIsCreating(true)
    setIsDialogOpen(true)
  }, [colors, categories])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.slice(0, 5).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (isCreating) {
          setNewEvent(prev => ({ ...prev, images: [...(prev.images || []), dataUrl].slice(0, 5) }));
        } else if (selectedEvent) {
          setSelectedEvent(prev => prev ? ({ ...prev, images: [...(prev.images || []), dataUrl].slice(0, 5) }) : null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const filteredEvents = useMemo(() => {
    const targetYear = currentDate.getFullYear();
    const defaultAnnualEvents: Event[] = [
      {
        id: "annual-new-year",
        title: "New Year's Day",
        description: "Welcome to the New Year! 🎆",
        startTime: new Date(targetYear, 0, 1, 0, 0),
        endTime: new Date(targetYear, 0, 1, 23, 59),
        color: "blue",
        category: "Holiday",
        tags: []
      },
      {
        id: "annual-christmas",
        title: "Christmas",
        description: "Merry Christmas! 🎄",
        startTime: new Date(targetYear, 11, 23, 0, 0),
        endTime: new Date(targetYear, 11, 23, 23, 59),
        color: "green",
        category: "Holiday",
        tags: []
      },
      {
        id: "annual-vinayaka",
        title: "Vinayaka Chaturthi",
        description: "Devotional glowing aura for Ganesh Chaturthi! 🕉️",
        startTime: new Date(targetYear, 8, 5, 0, 0),
        endTime: new Date(targetYear, 8, 5, 23, 59),
        color: "orange",
        category: "Festival",
        tags: []
      }
    ];

    const allEvents = [...events, ...defaultAnnualEvents];

    return allEvents.filter((event) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.category?.toLowerCase().includes(query) ||
          event.tags?.some((tag) => tag.toLowerCase().includes(query))

        if (!matchesSearch) return false
      }
      return true
    })
  }, [events, searchQuery, currentDate])

  const handleCreateEvent = useCallback(() => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) return

    const event: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEvent.title,
      description: newEvent.description,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      color: newEvent.color || colors[0].value,
      category: newEvent.category,
      attendees: newEvent.attendees,
      tags: newEvent.tags || [],
      images: newEvent.images || [],
    }

    setEvents((prev) => [...prev, event])
    onEventCreate?.(event)
    setIsDialogOpen(false)
    setIsCreating(false)
    
    if (['Birthday', 'Anniversary', 'Festival', 'Holiday', 'Meeting'].includes(event.category || '')) {
       playSound(event.category as any);
       setActiveEventAnim(event.category as string);
       
       // If images exist, reveal them in "Cards" view after animation
       if (event.images && event.images.length > 0) {
         setTimeout(() => {
           setActiveEventAnim(null);
           setIsDialogOpen(false);
           setIsCreating(false);
           setSelectedEvent(event);
           setView('cards');
         }, 3500);
       } else {
         setTimeout(() => setActiveEventAnim(null), 3000);
         setIsDialogOpen(false);
         setIsCreating(false);
       }
    } else {
      setIsDialogOpen(false);
      setIsCreating(false);
    }
  }, [newEvent, colors, categories, onEventCreate])

  const handleUpdateEvent = useCallback(() => {
    if (!selectedEvent) return

    setEvents((prev) => prev.map((e) => (e.id === selectedEvent.id ? selectedEvent : e)))
    onEventUpdate?.(selectedEvent.id, selectedEvent)
    setIsDialogOpen(false)
    
    if (['Birthday', 'Anniversary', 'Festival', 'Holiday', 'Meeting'].includes(selectedEvent.category || '')) {
       playSound(selectedEvent.category as any);
       setActiveEventAnim(selectedEvent.category as string);
       
       if (selectedEvent.images && selectedEvent.images.length > 0) {
         setTimeout(() => {
           setActiveEventAnim(null);
           setIsDialogOpen(false);
           setView('cards');
         }, 3500);
       } else {
         setTimeout(() => setActiveEventAnim(null), 3000);
         setIsDialogOpen(false);
       }
    } else {
      setIsDialogOpen(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent, onEventUpdate])

  const handleDeleteEvent = useCallback((id: string) => {
      setEvents((prev) => prev.filter((e) => e.id !== id))
      onEventDelete?.(id)
      setIsDialogOpen(false)
      setSelectedEvent(null)
    }, [onEventDelete])

  const handleDragStart = useCallback((event: Event) => setDraggedEvent(event), [])
  const handleDragEnd = useCallback(() => setDraggedEvent(null), [])

  const handleDrop = useCallback((date: Date, hour?: number) => {
      if (!draggedEvent) return
      const duration = draggedEvent.endTime.getTime() - draggedEvent.startTime.getTime()
      const newStartTime = new Date(date)
      if (hour !== undefined) newStartTime.setHours(hour, 0, 0, 0)
      const newEndTime = new Date(newStartTime.getTime() + duration)
      const updatedEvent = { ...draggedEvent, startTime: newStartTime, endTime: newEndTime }
      setEvents((prev) => prev.map((e) => (e.id === draggedEvent.id ? updatedEvent : e)))
      onEventUpdate?.(draggedEvent.id, updatedEvent)
      setDraggedEvent(null)
    }, [draggedEvent, onEventUpdate])

  const doFlipNavigation = useCallback((newDate: Date) => {
    if (flipState || view === "list") {
      setCurrentDate(newDate);
      return;
    }
    let diff = 0;
    if (view === "month") diff = (newDate.getFullYear() - currentDate.getFullYear()) * 12 + (newDate.getMonth() - currentDate.getMonth());
    else if (view === "week") diff = Math.round((newDate.getTime() - currentDate.getTime()) / (7 * 24 * 3600 * 1000));
    else if (view === "day") diff = Math.round((newDate.getTime() - currentDate.getTime()) / (24 * 3600 * 1000));
    if (diff === 0) return;
    const direction = diff > 0 ? "next" : "prev";
    const count = Math.min(Math.abs(diff), 5);
    const flipDates: Date[] = [];
    if (direction === "next") {
      for (let i = 0; i < count; i++) {
        const d = new Date(currentDate);
        if (view === "month") d.setMonth(d.getMonth() + Math.round(i * (diff / count)));
        else if (view === "week") d.setDate(d.getDate() + Math.round(i * (diff / count) * 7));
        else d.setDate(d.getDate() + Math.round(i * (diff / count)));
        flipDates.push(d);
      }
      setFlipState({ direction, baseDate: newDate, flipDates, targetDate: newDate });
    } else {
      for (let i = 0; i < count; i++) {
        const d = new Date(newDate);
        if (view === "month") d.setMonth(d.getMonth() + Math.round(i * (Math.abs(diff) / count)));
        else if (view === "week") d.setDate(d.getDate() + Math.round(i * (Math.abs(diff) / count) * 7));
        else d.setDate(d.getDate() + Math.round(i * (Math.abs(diff) / count)));
        flipDates.push(d);
      }
      setFlipState({ direction, baseDate: currentDate, flipDates, targetDate: newDate });
    }
  }, [currentDate, view, flipState]);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1));
    else if (view === "week") newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    else if (view === "day") newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    doFlipNavigation(newDate);
  }

  const getColorClasses = (colorValue: string) => colors.find((c) => c.value === colorValue) || colors[0]

  const onEventClickWithAnim = (event: Event) => {
     setSelectedEvent(event);
     
     if (['Birthday', 'Anniversary', 'Festival', 'Holiday', 'Meeting'].includes(event.category || '')) {
       playSound(event.category as any);
       setActiveEventAnim(event.category as string);
       
       if (event.images && event.images.length > 0) {
         setTimeout(() => {
           setActiveEventAnim(null);
           setIsDialogOpen(false);
           setView('cards');
         }, 3500);
       } else {
         setTimeout(() => setActiveEventAnim(null), 3000);
         setIsDialogOpen(true);
       }
     } else {
       setIsDialogOpen(true);
     }
  }

  return (
    <div className={cn("flex flex-col gap-4 relative h-full min-h-0", className)}>
      {activeEventAnim && (
         <div className="fixed inset-0 pointer-events-none z-50"><SpecialEffects type={activeEventAnim as any} /></div>
      )}

      <div className="flex flex-col gap-6 p-4 pt-8 md:pt-4 sm:pr-4 md:pr-40 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <h2 className="text-xl font-extrabold sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              {view === "month" && (
                <>
                  <span className="inline-block min-w-[140px]">{currentDate.toLocaleDateString("en-US", { month: "long" })}</span>
                  <input type="number" className="bg-transparent outline-none w-20 cursor-pointer dark:text-white opacity-50 hover:opacity-100 transition-opacity" value={currentDate.getFullYear()} onChange={(e) => { const y = parseInt(e.target.value); if (!isNaN(y)) { const newDate = new Date(currentDate); newDate.setFullYear(y); doFlipNavigation(newDate); } }} />
                </>
              )}
              {view === "week" && `Week of ${currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
              {view === "day" && currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              {view === "list" && "All Events"}
            </h2>
            <div className="flex items-center gap-1.5 bg-slate-100/50 dark:bg-white/5 p-1 rounded-xl border border-black/5 dark:border-white/5">
              <Button variant="ghost" size="icon" onClick={() => navigateDate("prev")} className="h-7 w-7 rounded-lg"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => doFlipNavigation(new Date())} className="h-7 px-3 text-[10px] font-bold uppercase tracking-wider">Today</Button>
              <Button variant="ghost" size="icon" onClick={() => navigateDate("next")} className="h-7 w-7 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 rounded-xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-black/20 p-1 backdrop-blur-sm">
              <Button variant={view === "month" ? "secondary" : "ghost"} size="sm" onClick={() => setView("month")} className="h-8 text-[11px] font-bold"><Calendar className="h-3.5 w-3.5 mr-1.5" />Month</Button>
              <Button variant={view === "week" ? "secondary" : "ghost"} size="sm" onClick={() => setView("week")} className="h-8 text-[11px] font-bold"><Grid3x3 className="h-3.5 w-3.5 mr-1.5" />Week</Button>
              <Button variant={view === "day" ? "secondary" : "ghost"} size="sm" onClick={() => setView("day")} className="h-8 text-[11px] font-bold"><Clock className="h-3.5 w-3.5 mr-1.5" />Day</Button>
              <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setView("list")} className="h-8 text-[11px] font-bold"><List className="h-3.5 w-3.5 mr-1.5" />List</Button>
            </div>
            
            <div className="md:hidden flex-1">
              <Select value={view} onValueChange={(value: any) => setView(value)}>
                <SelectTrigger className="w-full h-9 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => { setIsCreating(true); setIsDialogOpen(true); }} className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline font-bold">New Event</span>
            </Button>
          </div>
        </div>
      </div>


      <div className="relative flex-1 min-h-0 px-4 pb-4" style={{ perspective: "2000px" }}>
        {flipState !== null && view !== "list" ? (
           <>
             <div className="absolute top-0 left-4 right-4 bottom-4 z-0">
               <div className="h-full w-full bg-card rounded-lg overflow-hidden flex flex-col">
                  {view === "month" && <MonthView currentDate={flipState.baseDate} events={filteredEvents} getColorClasses={getColorClasses} onEventClick={() => {}} onDateClick={() => {}} onDragStart={() => {}} onDragEnd={() => {}} onDrop={() => {}} />}
                  {view === "week" && <WeekView currentDate={flipState.baseDate} events={filteredEvents} getColorClasses={getColorClasses} onEventClick={() => {}} onDateClick={() => {}} />}
                  {view === "day" && <DayView currentDate={flipState.baseDate} events={filteredEvents} getColorClasses={getColorClasses} onEventClick={() => {}} onDateClick={() => {}} />}
               </div>
             </div>
             <div className="absolute top-[2px] left-4 right-4 h-4 flex justify-around pointer-events-none z-[100] px-10">
                {Array.from({length: 8}).map((_, i) => (<div key={i} className="w-3 h-6 rounded-full border border-slate-400 dark:border-slate-600 bg-gradient-to-b from-slate-300 to-slate-500 shadow-md transform -translate-y-2" />))}
             </div>
             {flipState.flipDates.map((fd, i) => {
                const count = flipState.flipDates.length;
                const isNext = flipState.direction === "next";
                const flipDelay = isNext ? i * 0.12 : (count - 1 - i) * 0.12;
                return (
                   <motion.div key={i} className="absolute top-0 left-4 right-4 bottom-4 origin-top bg-card rounded-lg shadow-xl overflow-hidden"
                     style={{ zIndex: 10 + count - i, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
                     initial={{ rotateX: isNext ? 0 : -180 }} animate={{ rotateX: isNext ? -180 : 0 }}
                     transition={{ delay: flipDelay, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                     onAnimationComplete={() => { if (isNext ? i === count - 1 : i === 0) { setCurrentDate(flipState.targetDate); setFlipState(null); } }}
                   >
                     <div className="h-full w-full bg-card rounded-lg flex flex-col overflow-hidden">
                        {view === "month" && <MonthView currentDate={fd} events={[]} getColorClasses={getColorClasses} onEventClick={() => {}} onDateClick={() => {}} onDragStart={() => {}} onDragEnd={() => {}} onDrop={() => {}} />}
                        {view === "week" && <WeekView currentDate={fd} events={[]} getColorClasses={getColorClasses} onEventClick={() => {}} onDateClick={() => {}} />}
                        {view === "day" && <DayView currentDate={fd} events={[]} getColorClasses={getColorClasses} onEventClick={() => {}} onDateClick={() => {}} />}
                     </div>
                   </motion.div>
                )
             })}
           </>
        ) : (
           <div className="h-full w-full bg-transparent flex flex-col overflow-hidden backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
             {view === "month" && <MonthView currentDate={currentDate} events={filteredEvents} onEventClick={onEventClickWithAnim} onDateClick={handleDateClick} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDrop={handleDrop} getColorClasses={getColorClasses}/>}
             {view === "week" && <WeekView currentDate={currentDate} events={filteredEvents} onEventClick={onEventClickWithAnim} onDateClick={handleDateClick} getColorClasses={getColorClasses}/>}
             {view === "day" && <DayView currentDate={currentDate} events={filteredEvents} onEventClick={onEventClickWithAnim} onDateClick={handleDateClick} getColorClasses={getColorClasses}/>}
             {view === "list" && <ListView events={filteredEvents} onEventClick={onEventClickWithAnim} getColorClasses={getColorClasses} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}
             {view === "cards" && selectedEvent && (
              <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-black/20 rounded-2xl m-4">
                <Button variant="ghost" className="absolute top-4 left-4 z-50 text-white hover:bg-white/10" onClick={() => setView('month')}>
                  <ChevronLeft className="mr-2" /> Back to Calendar
                </Button>
                <div className="text-center mb-8 z-10">
                  <h3 className="text-4xl font-black text-white drop-shadow-xl mb-2">{selectedEvent.title}</h3>
                  <p className="text-white/60 font-bold uppercase tracking-[0.2em]">{selectedEvent.category} Memories</p>
                </div>
                <ImgStack images={selectedEvent.images || []} />
                <div className="mt-20 px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-white/40 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                  Shuffle through your special moments
                </div>
              </div>
             )}
           </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isCreating ? "Create Event" : "Event Details"}</DialogTitle>
            <DialogDescription>{isCreating ? "Add a new event" : "View memories and details"}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5"><Label>Title</Label><Input value={isCreating ? newEvent.title : selectedEvent?.title} onChange={(e) => isCreating ? setNewEvent(p=>({...p,title:e.target.value})) : setSelectedEvent(p=>p?({...p,title:e.target.value}):null)} /></div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea value={isCreating ? newEvent.description : selectedEvent?.description} onChange={(e) => isCreating ? setNewEvent(p=>({...p,description:e.target.value})) : setSelectedEvent(p=>p?({...p,description:e.target.value}):null)} rows={3}/></div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Start</Label>
                  <Input type="datetime-local" value={isCreating ? (newEvent.startTime ? new Date(newEvent.startTime.getTime() - newEvent.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "") : (selectedEvent ? new Date(selectedEvent.startTime.getTime() - selectedEvent.startTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "")} onChange={(e) => { const d = new Date(e.target.value); isCreating ? setNewEvent(p=>({...p,startTime:d})) : setSelectedEvent(p=>p?({...p,startTime:d}):null) }}/>
                </div>
                <div className="space-y-1.5"><Label>End</Label>
                  <Input type="datetime-local" value={isCreating ? (newEvent.endTime ? new Date(newEvent.endTime.getTime() - newEvent.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "") : (selectedEvent ? new Date(selectedEvent.endTime.getTime() - selectedEvent.endTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "")} onChange={(e) => { const d = new Date(e.target.value); isCreating ? setNewEvent(p=>({...p,endTime:d})) : setSelectedEvent(p=>p?({...p,endTime:d}):null) }}/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Category</Label>
                  <Select value={isCreating ? newEvent.category : selectedEvent?.category} onValueChange={v => isCreating ? setNewEvent(p=>({...p,category:v})) : setSelectedEvent(p=>p?({...p,category:v}):null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map(c=>(<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select>
                </div>
                <div className="space-y-1.5"><Label>Color</Label>
                  <Select value={isCreating ? newEvent.color : selectedEvent?.color} onValueChange={v => isCreating ? setNewEvent(p=>({...p,color:v})) : setSelectedEvent(p=>p?({...p,color:v}):null)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{colors.map(c=>(<SelectItem key={c.value} value={c.value}><div className="flex items-center gap-2"><div className={cn("h-3 w-3 rounded", c.bg)}/>{c.name}</div></SelectItem>))}</SelectContent></Select>
                </div>
              </div>

              <div className="pt-2">
                <Label className="flex items-center gap-2 mb-2"><Camera size={16}/> Memories (Images)</Label>
                <div className="flex gap-2 flex-wrap">
                  <label className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary cursor-pointer transition-colors">
                    <ImagePlus size={20} className="text-muted-foreground" />
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                  {(isCreating ? newEvent.images : selectedEvent?.images)?.map((img, idx) => (
                    <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden group">
                      <img src={img} className="w-full h-full object-cover" />
                      <button className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity" onClick={() => {
                         if (isCreating) setNewEvent(p=>({...p, images: p.images?.filter((_, i) => i !== idx)}))
                         else setSelectedEvent(p=>p?({...p, images: p.images?.filter((_, i) => i !== idx)}):null)
                      }}><X size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] border border-slate-200 dark:border-slate-800">
               {(isCreating ? newEvent.images : selectedEvent?.images)?.length ? (
                 <>
                   <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Memory Stash</h4>
                   <ImgStack images={(isCreating ? newEvent.images : selectedEvent?.images) || []} />
                   {!isCreating && selectedEvent?.images && selectedEvent.images.length > 0 && (
                     <Button 
                       variant="secondary" 
                       size="sm" 
                       className="mt-6 font-bold"
                       onClick={() => { setIsDialogOpen(false); setView('cards'); }}
                     >
                       Enlarge Memories
                     </Button>
                   )}
                 </>
               ) : (
                 <div className="text-center space-y-3">
                   <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto"><Camera className="text-slate-400" size={32}/></div>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">No Memories Captured</p>
                   <p className="text-[10px] text-slate-400 font-medium">Capture the magic of this day.<br/>Add 5 images taken today!</p>
                 </div>
               )}
            </div>
          </div>

          <DialogFooter className="mt-8 border-t pt-4">
            {!isCreating && <Button variant="destructive" onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}>Delete</Button>}
            <Button variant="ghost" onClick={() => { setIsDialogOpen(false); setSelectedEvent(null); }}>Cancel</Button>
            <Button onClick={isCreating ? handleCreateEvent : handleUpdateEvent}>{isCreating ? "Create Magic" : "Update Memory"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EventCard({ event, onEventClick, onDragStart, onDragEnd, getColorClasses }: any) {
  const colorClasses = getColorClasses(event.color)
  return (
    <motion.div draggable onDragStart={() => onDragStart(event)} onDragEnd={onDragEnd} onClick={() => onEventClick(event)}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      className={cn("relative rounded px-1.5 py-0.5 text-[10px] font-bold cursor-pointer shadow-sm truncate text-white", colorClasses.bg)}
    >
      {event.title}
      {event.images?.length > 0 && <span className="absolute right-0.5 top-0.5 w-1 h-1 rounded-full bg-white animate-pulse" />}
    </motion.div>
  )
}

import { CellAnimation, type AnimationType } from "./cell-animation";

function getPriorityAnimation(events: Event[]): AnimationType | null {
  if (events.some(e => e.category === 'Festival')) return 'Festival';
  if (events.some(e => e.category === 'Birthday')) return 'Birthday';
  if (events.some(e => e.category === 'Anniversary')) return 'Anniversary';
  if (events.some(e => e.category === 'Meeting')) return 'Meeting';
  if (events.some(e => e.category === 'Holiday')) return 'Holiday';
  if (events.length > 0) return 'Reminder';
  return null;
}

function CalendarCell({ day, isCurrentMonth, isToday, dayEvents, onDateClick, onDrop, onEventClick, onDragStart, onDragEnd, getColorClasses }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const priorityAnim = useMemo(() => getPriorityAnimation(dayEvents), [dayEvents]);

  return (
    <div 
      className={cn(
        "relative border-[0.5px] border-slate-200 dark:border-slate-800 p-1 flex flex-col gap-1 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer overflow-hidden", 
        !isCurrentMonth && "opacity-20"
      )} 
      onClick={() => onDateClick(day)} 
      onDragOver={e => e.preventDefault()} 
      onDrop={() => onDrop(day)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {priorityAnim && (
        <CellAnimation type={priorityAnim} isActive={true} isHovered={isHovered} />
      )}
      
      <div className={cn(
        "relative z-10 text-[10px] sm:text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transition-transform duration-300", 
        isToday && "bg-primary text-white",
        priorityAnim === 'Birthday' && isHovered && "scale-125"
      )}>
        {day.getDate()}
      </div>
      
      <div className="relative z-10 flex flex-col gap-0.5">
        {dayEvents.slice(0, 3).map((e: any) => (
          <EventCard 
            key={e.id} 
            event={e} 
            onEventClick={onEventClick} 
            onDragStart={onDragStart} 
            onDragEnd={onDragEnd} 
            getColorClasses={getColorClasses}
          />
        ))}
        {dayEvents.length > 3 && (
            <div className="text-[8px] text-muted-foreground font-bold px-1">+{dayEvents.length - 3} more</div>
        )}
      </div>
    </div>
  );
}

function MonthView({ currentDate, events, onEventClick, onDateClick, onDragStart, onDragEnd, onDrop, getColorClasses }: any) {
  const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  start.setDate(start.getDate() - start.getDay())
  const days = Array.from({length: 42}, (_,i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d })
  
  return (
    <Card className="flex-1 grid grid-cols-7 grid-rows-6 min-h-0 bg-transparent border-none shadow-none rounded-none">
      {days.map((day, i) => (
        <CalendarCell
          key={i}
          day={day}
          isCurrentMonth={day.getMonth() === currentDate.getMonth()}
          isToday={day.toDateString() === new Date().toDateString()}
          dayEvents={events.filter((e: any) => new Date(e.startTime).toDateString() === day.toDateString())}
          onDateClick={onDateClick}
          onDrop={onDrop}
          onEventClick={onEventClick}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          getColorClasses={getColorClasses}
        />
      ))}
    </Card>
  )
}

function WeekView({ currentDate, events, onEventClick, onDateClick, getColorClasses }: any) {
  const start = new Date(currentDate); start.setDate(start.getDate() - start.getDay())
  const days = Array.from({length:7}, (_,i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d })
  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
      <div className="grid grid-cols-7 gap-3 min-h-[400px]">
        {days.map(d => {
          const dayEvents = events.filter((e: any) => new Date(e.startTime).toDateString() === d.toDateString());
          return (
            <div 
              key={d.toString()} 
              className="border border-white/10 p-3 rounded-2xl text-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex flex-col glass-morphism" 
              onClick={() => onDateClick(d)}
            >
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-xl font-bold mb-3">{d.getDate()}</div>
              <div className="flex flex-col gap-1.5">
                {dayEvents.map((e: any) => (
                  <div 
                    key={e.id} 
                    className={cn("p-2 text-[10px] font-bold rounded-xl text-white shadow-lg transition-transform hover:scale-105", getColorClasses(e.color).bg)} 
                    onClick={(ev) => { ev.stopPropagation(); onEventClick(e) }}
                  >
                    {e.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({ currentDate, events, onEventClick, onDateClick, getColorClasses }: any) {
  return <div className="p-8 text-center"><h3 className="text-2xl font-bold">{currentDate.toDateString()}</h3><div className="mt-4 flex flex-col gap-2">{events.filter((e:any)=>new Date(e.startTime).toDateString()===currentDate.toDateString()).map((e:any)=>(<Button key={e.id} variant="outline" className={cn("w-full justify-start gap-2 border-l-4", getColorClasses(e.color).bg)} onClick={()=>onEventClick(e)}>{e.title}</Button>))}</div><Button className="mt-4 w-full" onClick={()=>onDateClick(currentDate)}><Plus size={16}/> Add Event</Button></div>
}

function ListView({ events, onEventClick, getColorClasses, searchQuery, setSearchQuery }: any) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-black/5 dark:border-white/10 m-4 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-black/5 dark:border-white/10 bg-white/20 dark:bg-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Event Stream</h3>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">Chronological Archive</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input 
            placeholder="Search stream..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="pl-9 h-10 bg-white/40 dark:bg-black/40 border-black/5 dark:border-white/10 text-slate-900 dark:text-white text-xs rounded-xl focus:ring-primary/10 shadow-inner" 
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-slate-400" 
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex flex-col gap-3">
          {events.length > 0 ? (
            events.map((e: any) => (
              <div 
                key={e.id} 
                className="group p-5 bg-white/30 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 rounded-2xl flex justify-between items-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5" 
                onClick={() => onEventClick(e)}
              >
                <div className="flex flex-col gap-1.5 cursor-pointer">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{e.title}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
                    <Clock size={10} className="text-slate-400" />
                    <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full border border-black/5 dark:border-white/5">
                      {new Date(e.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="text-slate-400">
                      {new Date(e.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className={cn("w-1.5 h-10 rounded-full shadow-lg transition-transform group-hover:scale-y-110", getColorClasses(e.color).bg)} />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 dark:text-slate-500 gap-6">
              <div className="relative">
                <Search size={64} className="opacity-10" />
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-slate-900 dark:text-white mb-1">No matching events</p>
                <p className="text-xs opacity-60">Try adjusting your search query</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

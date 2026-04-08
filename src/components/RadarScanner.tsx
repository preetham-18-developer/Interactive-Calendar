"use client";
import React from "react";
import { Radar, IconContainer } from "./ui/radar-effect";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Gift, Users, Star, PartyPopper, Camera } from "lucide-react";
import type { CalendarEvent } from "../types";
import { cn } from "@/lib/utils";
import ImgStack from "./ui/image-stack";

interface RadarScannerProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  currentDate: Date;
}

const categoryIcons: Record<string, React.ReactNode> = {
  Birthday: <Gift className="h-6 w-6 text-pink-500" />,
  Meeting: <Users className="h-6 w-6 text-blue-500" />,
  Festival: <PartyPopper className="h-6 w-6 text-orange-500" />,
  Holiday: <Star className="h-6 w-6 text-yellow-500" />,
  Anniversary: <PartyPopper className="h-6 w-6 text-purple-500" />,
  default: <Calendar className="h-6 w-6 text-slate-400" />,
};

export function RadarScanner({ isOpen, onClose, events, currentDate }: RadarScannerProps) {
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Filter events for the current month
  const monthEvents = events.filter(e => {
    const eventDate = new Date(e.dateStr + "T12:00:00");
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  }).slice(0, 10); 

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-6"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
          >
            <X size={32} />
          </button>

          <div className="relative w-full h-full flex flex-row items-center justify-center gap-12 max-w-[1400px]">
            {/* Radar View */}
            <div className="relative flex-1 h-[600px] flex flex-col items-center justify-center overflow-hidden">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-center mb-6"
                >
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent mb-2">Radar Analysis</h2>
                  <p className="text-neutral-500">Scanning {monthName} frequencies</p>
                </motion.div>

                <div className="relative w-full h-full flex items-center justify-center">
                   <Radar className="absolute" />
                   
                   {monthEvents.map((event, i) => {
                     const angle = (i / monthEvents.length) * 2 * Math.PI;
                     const radius = 160 + Math.random() * 60;
                     const x = Math.cos(angle) * radius;
                     const y = Math.sin(angle) * radius;
                     const isSelected = selectedEventId === event.id;

                     return (
                       <motion.div 
                         key={event.id}
                         className="absolute cursor-pointer"
                         style={{ transform: `translate(${x}px, ${y}px)` }}
                         whileHover={{ scale: 1.2 }}
                         onClick={() => setSelectedEventId(event.id)}
                       >
                         <div className={cn("transition-all duration-300", isSelected ? "scale-125 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" : "")}>
                           <IconContainer 
                              text={event.title}
                              delay={0.2 + (i * 0.1)}
                              icon={categoryIcons[event.type] || categoryIcons.default}
                           />
                         </div>
                       </motion.div>
                     );
                   })}

                   {monthEvents.length === 0 && (
                     <div className="text-slate-500 font-medium italic">Clear Frequency. No events detected.</div>
                   )}
                </div>

                <div className="mt-8 px-6 py-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs tracking-widest font-semibold animate-pulse">
                   SYSTEM ACTIVE: DETECTING QUANTUM MEMORIES
                </div>
            </div>

            {/* Side Card View */}
            <AnimatePresence mode="wait">
              {selectedEvent && (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  className="w-[450px] h-[700px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-8 backdrop-blur-md flex flex-col items-center relative overflow-y-auto shadow-2xl"
                >
                  <button 
                    onClick={() => setSelectedEventId(null)}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white"
                  >
                    <X size={20} />
                  </button>

                  <div className="mb-8 text-center mt-4">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--color-accent)]/30">
                       {categoryIcons[selectedEvent.type] || categoryIcons.default}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h3>
                    <p className="text-slate-400 text-sm">{new Date(selectedEvent.dateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  {selectedEvent.note && (
                    <div className="bg-slate-800/40 rounded-2xl p-4 mb-8 w-full border border-slate-700/50">
                      <p className="text-slate-300 text-sm italic leading-relaxed text-center">"{selectedEvent.note}"</p>
                    </div>
                  )}

                  <div className="flex-1 w-full flex flex-col items-center">
                    <h4 className="text-xs font-bold text-[var(--color-accent)] uppercase tracking-widest mb-6">Captured Memories</h4>
                    {selectedEvent.images && selectedEvent.images.length > 0 ? (
                       <ImgStack images={selectedEvent.images} />
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
                        <Camera size={48} className="opacity-20" />
                        <p className="text-xs text-center font-medium">No memories detected in this frequency.<br/>Add 5 images taken today to lock them in!</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

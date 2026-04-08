import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Images, Calendar as CalendarIcon, ChevronLeft } from 'lucide-react';
import type { Event } from './ui/event-manager';
import ImgStack from './ui/image-stack';

interface MemoryGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

export function MemoryGallery({ isOpen, onClose, events }: MemoryGalleryProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Filter events that actually have images
  const memoryEvents = events.filter(e => e.images && e.images.length > 0).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div 
        className="relative w-full max-w-5xl h-[85vh] bg-slate-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Images className="text-white" size={20} />
             </div>
             <div>
               <h2 className="text-2xl font-black text-white tracking-tight">Memory Archive</h2>
               <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Relive your daily moments</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors border border-white/5"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
           {selectedEvent ? (
              <div className="flex-1 flex flex-col relative w-full h-full p-8 items-center justify-center">
                 <button 
                   onClick={() => setSelectedEvent(null)}
                   className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 text-sm font-bold z-50"
                 >
                   <ChevronLeft size={16} /> Back to Gallery
                 </button>
                 
                 <div className="text-center mb-10 z-10">
                    <h3 className="text-4xl font-black text-white drop-shadow-lg mb-2">{selectedEvent.title}</h3>
                    <p className="text-white/60 font-bold uppercase tracking-[0.2em]">
                      {new Date(selectedEvent.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                 </div>
                 
                 <div className="flex-1 w-full max-w-2xl relative">
                    <ImgStack images={selectedEvent.images || []} />
                 </div>
              </div>
           ) : (
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                 {memoryEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {memoryEvents.map(event => (
                          <motion.div 
                            key={event.id}
                            whileHover={{ scale: 1.02, y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.2)] transition-all"
                            onClick={() => setSelectedEvent(event)}
                          >
                             <div className="h-48 relative overflow-hidden bg-black/50">
                                <img 
                                  src={event.images![0]} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-white flex items-center gap-2 text-xs font-bold shadow-lg">
                                   <Images size={14} /> {event.images!.length}
                                </div>
                             </div>
                             <div className="p-5 relative">
                                <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">{event.title}</h4>
                                <div className="flex items-center gap-2 text-white/50 text-xs font-medium">
                                   <CalendarIcon size={12} />
                                   {new Date(event.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                             </div>
                          </motion.div>
                       ))}
                    </div>
                 ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                       <Images size={64} className="mb-4 text-white/20" />
                       <h3 className="text-2xl font-bold text-white mb-2">No Memories Found</h3>
                       <p className="text-white/60">Upload 5 images when creating events to see them here.</p>
                    </div>
                 )}
              </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}

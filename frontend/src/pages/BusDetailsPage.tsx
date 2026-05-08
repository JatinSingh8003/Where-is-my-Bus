import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Navigation } from 'lucide-react'
import { busService } from '../services/busService'

export function BusDetailsPage() {
  const { busId = '' } = useParams()
  const bus = busService.getBus(busId)

  if (!bus) return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-auto p-6 glass-panel rounded-2xl max-w-md w-full text-center">
      Bus not found.
    </motion.main>
  )

  const route = busService.getRoute(bus.routeId)
  if (!route) return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-auto p-6 glass-panel rounded-2xl max-w-md w-full text-center">
      Route not found.
    </motion.main>
  )

  let isRunning = false;
  let displayStatus = bus.isAvailable ? 'Active' : 'Offline';
  
  if (bus.isAvailable && bus.departureTime && bus.arrivalTime) {
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
    
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    }
    
    const depMinutes = parseTime(bus.departureTime);
    const arrMinutes = parseTime(bus.arrivalTime) + bus.delayMinutes;
    
    if (currentTotalMinutes < depMinutes) {
      displayStatus = 'Scheduled';
    } else if (currentTotalMinutes > arrMinutes) {
      displayStatus = 'Completed';
    } else {
      isRunning = true;
      displayStatus = 'Active';
    }
  }

  const active = bus.isAvailable && isRunning;

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="pointer-events-auto w-full max-w-2xl glass-panel rounded-3xl p-6 shadow-2xl h-[85vh] flex flex-col md:absolute md:right-8 md:top-1/2 md:-translate-y-1/2 overflow-hidden border border-white/10"
    >
      <header className="flex items-center gap-4 mb-6 relative z-10">
        <Link to="/dashboard" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{bus.busNumber}</h1>
          <p className="text-sm text-blue-400 font-medium">{route.name}</p>
        </div>
        <div className="ml-auto">
           <Link to={`/track/${bus.id}`} className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)] px-5 py-2 font-semibold text-sm transition-all">
             <Navigation size={16} /> Track
           </Link>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 relative z-10 flex-shrink-0">
        <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Departure</p>
          <p className="font-semibold text-sm">{bus.departureTime}</p>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Arrival</p>
          <p className="font-semibold text-sm">{bus.arrivalTime}</p>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</p>
          <p className={`font-semibold text-sm ${isRunning ? 'text-emerald-400' : (displayStatus === 'Completed' ? 'text-blue-400' : 'text-slate-400')}`}>
            {displayStatus}
          </p>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-xl border border-white/5">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Delay</p>
          <p className={`font-semibold text-sm ${!isRunning ? 'text-slate-400' : (bus.delayMinutes > 0 ? 'text-red-400' : 'text-emerald-400')}`}>
            {!isRunning ? '--:--' : (bus.delayMinutes > 0 ? `+${bus.delayMinutes}m` : 'On time')}
          </p>
        </div>
      </section>

      <section className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-900/80 backdrop-blur-md p-2 -mx-2 rounded-md z-10 mb-4">
          Route Timeline
        </h2>
        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-white/10 ml-2">
          {route.stops.map((stop, i) => (
            <motion.article 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={stop.id} 
              className="relative pl-8"
            >
              <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-[#0f172a] bg-slate-500 -translate-x-1/2"></div>
              <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 hover:border-white/20 transition-colors">
                <h3 className="font-semibold text-sm mb-3">{stop.name}</h3>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  {/* Left Side: Arrival */}
                  <div className="flex flex-col gap-1 text-left">
                    <span className="uppercase text-[10px] tracking-wider opacity-70">Arrival</span>
                    {stop.plannedArrival && stop.plannedArrival !== '-' ? (
                      <div className="flex items-center gap-2">
                        <span><Clock size={12} className="inline mr-1"/>{stop.plannedArrival}</span>
                        {(active && bus.delayMinutes > 0) && (
                          <span className="text-red-400 font-medium">{stop.delayedArrival}</span>
                        )}
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </div>

                  {/* Right Side: Departure */}
                  <div className="flex flex-col gap-1 text-right">
                    <span className="uppercase text-[10px] tracking-wider opacity-70">Departure</span>
                    {stop.plannedDeparture && stop.plannedDeparture !== '-' ? (
                      <div className="flex items-center justify-end gap-2">
                        {(active && bus.delayMinutes > 0) && (
                          <span className="text-red-400 font-medium">{stop.delayedDeparture}</span>
                        )}
                        <span>{stop.plannedDeparture} <Clock size={12} className="inline ml-1"/></span>
                      </div>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </motion.main>
  )
}

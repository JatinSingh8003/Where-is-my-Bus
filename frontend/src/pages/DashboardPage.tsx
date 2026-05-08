import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Calendar, Compass, ArrowRight, Activity } from 'lucide-react'
import { busService } from '../services/busService'
import { routes } from '../data/demoData'

export function DashboardPage() {
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [term, setTerm] = useState('')

  const results = useMemo(() => busService.search({ source, destination, date, term }), [source, destination, date, term])
  const availableCities = useMemo(
    () => Array.from(new Set(routes.flatMap((route) => [route.source, route.destination]))).sort(),
    []
  )

  const activeResults = results.filter(r => r.isAvailable)

  return (
    <motion.aside 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="pointer-events-auto w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl h-[85vh] flex flex-col md:absolute md:left-8 md:top-1/2 md:-translate-y-1/2 overflow-hidden border border-white/10"
    >
      <header className="mb-6 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <Compass size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Transit</h1>
        </div>
        <p className="text-sm text-slate-400">Enter your route or select a live pulse.</p>
      </header>

      {/* Intelligent Search Form */}
      <section className="relative z-10 flex flex-col gap-3 mb-6 flex-shrink-0">
        <div className="relative">
          <MapPin size={16} className="absolute top-3.5 left-3.5 text-slate-400" />
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Where from?"
            className="w-full bg-slate-900/50 border border-slate-700/50 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm"
            list="tracer-city-options"
          />
        </div>
        <div className="relative">
          <ArrowRight size={16} className="absolute top-3.5 left-3.5 text-slate-400" />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to?"
            className="w-full bg-slate-900/50 border border-slate-700/50 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm"
            list="tracer-city-options"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Calendar size={16} className="absolute top-3.5 left-3.5 text-slate-400" />
            <input 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              type="date" 
              className="w-full bg-slate-900/50 border border-slate-700/50 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm appearance-none" 
            />
          </div>
          <div className="relative flex-1">
            <Search size={16} className="absolute top-3.5 left-3.5 text-slate-400" />
            <input 
              value={term} 
              onChange={(e) => setTerm(e.target.value)} 
              placeholder="Bus ID" 
              className="w-full bg-slate-900/50 border border-slate-700/50 focus:border-blue-500 rounded-xl py-3 pl-10 pr-4 outline-none transition-all text-sm" 
            />
          </div>
        </div>
        <datalist id="tracer-city-options">
          {availableCities.map((city) => <option key={city} value={city} />)}
        </datalist>
      </section>

      {/* Results List */}
      <section className="relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3 pb-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider sticky top-0 bg-slate-900/80 backdrop-blur-md p-2 -mx-2 rounded-md z-10">
          Live Fleet ({activeResults.length})
        </h2>
        <AnimatePresence>
          {activeResults.length === 0 ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-6 bg-white/5 rounded-xl border border-white/5">
               <Activity className="mx-auto text-slate-500 mb-2" size={24} />
               <p className="text-sm text-slate-400">No active vehicles match your criteria.</p>
             </motion.div>
          ) : (
            activeResults.map((bus) => {
              const route = routes.find((r) => r.id === bus.routeId)
              return (
                <motion.article 
                  key={bus.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900/40 border border-white/10 hover:border-blue-500/50 transition-all rounded-xl p-4 group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-white flex items-center gap-2">
                        {bus.busNumber}
                        {bus.delayMinutes > 0 ? (
                          <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">+{bus.delayMinutes}m delay</span>
                        ) : (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">On time</span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400">{bus.operator}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 my-3 bg-black/20 p-2 rounded-lg">
                    <span className="truncate">{route?.source}</span>
                    <ArrowRight size={12} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate">{route?.destination}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to={`/bus/${bus.id}`} className="flex-1 text-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 py-2 text-xs font-medium transition-colors">
                      Details
                    </Link>
                    <Link to={`/track/${bus.id}`} className="flex-1 text-center rounded-lg bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] py-2 text-xs font-medium text-white transition-all">
                      Track Live
                    </Link>
                  </div>
                </motion.article>
              )
            })
          )}
        </AnimatePresence>
      </section>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </motion.aside>
  )
}

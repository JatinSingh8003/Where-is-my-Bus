import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Activity } from 'lucide-react'
import { busService } from '../services/busService'
import { LiveMap } from '../components/map/LiveMap'
import { LiveTimeline } from '../components/LiveTimeline'
import { useBusProgress } from '../hooks/useBusProgress'

export function LiveTrackingPage() {
  const { busId = '' } = useParams()
  const bus = busService.getBus(busId)
  const route = useMemo(() => (bus ? busService.getRoute(bus.routeId) : null), [bus])
  const live = useMemo(() => (bus ? busService.getLive(bus.id) : null), [bus])
  const progressData = useBusProgress(bus, route)

  if (!bus || !route || !live) return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-auto p-6 glass-panel rounded-2xl max-w-md w-full text-center">
      Tracking unavailable for this bus.
    </motion.main>
  )

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col md:flex-row bg-[#020617] overflow-hidden pointer-events-auto"
    >
      {/* 70% Map Container */}
      <section className="relative w-full md:w-[70%] h-[50vh] md:h-full">
        <LiveMap route={route} live={live} bus={bus} progressData={progressData} />
        
        {/* Floating Header over Map */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 glass-panel p-3 md:p-4 rounded-2xl border border-white/10 flex items-center gap-3 md:gap-4 max-w-[calc(100%-2rem)] md:max-w-md pointer-events-auto">
          <Link to={`/bus/${bus.id}`} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 text-white flex-shrink-0">
            <ArrowLeft size={16} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white truncate">{bus.busNumber}</h1>
            <p className="text-xs text-blue-400 font-medium truncate">{route.name}</p>
          </div>
          <div className="ml-auto w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse flex-shrink-0">
            <Activity size={16} />
          </div>
        </div>
      </section>

      {/* 30% Timeline Sidebar (Scrollable internally) */}
      <section className="w-full md:w-[30%] h-[50vh] md:h-full bg-slate-900 border-t md:border-t-0 md:border-l border-white/10 flex flex-col relative z-20">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 flex-shrink-0">
          <div className="flex justify-between items-center text-white">
            <h2 className="font-semibold">{bus.busNumber} Timeline</h2>
            <div className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">
              Live
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-400 grid grid-cols-2 gap-2">
            <p>From: <span className="text-white">{route.source}</span></p>
            <p className="text-right">To: <span className="text-white">{route.destination}</span></p>
          </div>
        </div>

        {/* Scrollable Timeline Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative bg-slate-900">
           <LiveTimeline route={route} bus={bus} progressData={progressData} />
        </div>
      </section>
    </motion.main>
  )
}

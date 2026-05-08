import type { Bus, BusRoute } from '../types'
import { motion } from 'framer-motion'
import { BusFront, Navigation } from 'lucide-react'

import type { BusProgress } from '../hooks/useBusProgress'

interface Props {
  route: BusRoute
  bus: Bus
  progressData: BusProgress
}

export function LiveTimeline({ route, bus, progressData }: Props) {
  const { currentStopIndex, nextStopIndex, segmentProgress, isActive } = progressData;
  
  let busTopPercentage = 0
  if (!isActive) {
    if (currentStopIndex === 0) busTopPercentage = 0;
    else if (currentStopIndex === route.stops.length - 1) busTopPercentage = 100;
  } else {
    if (currentStopIndex !== -1 && nextStopIndex !== -1 && currentStopIndex !== nextStopIndex) {
      const segmentHeight = 100 / (route.stops.length - 1 || 1)
      busTopPercentage = (currentStopIndex * segmentHeight) + (segmentProgress * segmentHeight)
    } else if (currentStopIndex !== -1) {
      busTopPercentage = (currentStopIndex / (route.stops.length - 1)) * 100
    }
  }

  // To prevent the bus icon from going off the very top or bottom:
  const boundedTop = Math.max(0, Math.min(100, busTopPercentage))

  return (
    <div className="relative pt-6 pb-8 px-2 font-sans">
      
      {/* Header columns */}
      <div className="flex w-full text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6 px-2">
        <div className="w-[72px] text-right pr-4">Arrival</div>
        <div className="w-8"></div>
        <div className="flex-1 pl-4 flex justify-between">
          <span>Stop Info</span>
          <span className="w-[72px] text-right">Departure</span>
        </div>
      </div>

      <div className="relative">
        {/* The main vertical track line */}
        <div className="absolute top-4 bottom-4 left-[88px] w-1 bg-gradient-to-b from-blue-900 via-blue-500 to-blue-900 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>

        {/* The moving Bus icon on the track */}
        <motion.div 
          className="absolute left-[88px] -translate-x-[14px] z-30"
          initial={{ top: `${boundedTop}%` }}
          animate={{ top: `${boundedTop}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          style={{ marginTop: '-14px' }} 
        >
          <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.8)] border-2 border-[#0f172a]">
            <BusFront size={14} />
          </div>
        </motion.div>

        {/* The Stops */}
        <div className="relative z-10 flex flex-col justify-between space-y-12">
          {route.stops.map((stop, i) => {
            const isPassed = i < currentStopIndex || 
                             (i === currentStopIndex && currentStopIndex !== nextStopIndex) || 
                             (i === currentStopIndex && !isActive && currentStopIndex === route.stops.length - 1);
            const isNext = i === nextStopIndex && isActive && currentStopIndex !== nextStopIndex;
            const isDelay = bus.delayMinutes > 0
            
            return (
              <div key={stop.id} className="flex items-center w-full group">
                
                {/* Left Side: Arrival times */}
                <div className="w-[88px] pr-5 text-right shrink-0">
                  <p className={`text-sm font-semibold transition-colors ${isPassed ? 'text-slate-500' : 'text-slate-200'}`}>
                    {stop.plannedArrival}
                  </p>
                  <p className={`text-[11px] font-medium mt-0.5 ${isPassed ? 'text-slate-600' : isDelay ? 'text-red-400' : 'text-emerald-400'}`}>
                    {isDelay ? stop.delayedArrival : stop.plannedArrival}
                  </p>
                </div>

                {/* Center: The Node on the line */}
                <div className="w-1 flex justify-center shrink-0 relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] border-[#0f172a] shadow-sm z-20 transition-all ${isPassed ? 'bg-slate-600' : isNext ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] scale-125' : 'bg-blue-400'}`}></div>
                </div>

                {/* Right Side: Stop Info & Departure */}
                <div className="flex-1 pl-6 flex justify-between items-start">
                  <div className="flex flex-col">
                    <p className={`text-[15px] font-bold tracking-tight transition-colors ${isPassed ? 'text-slate-500' : 'text-white group-hover:text-blue-400'}`}>
                      {stop.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Navigation size={10} className="text-slate-500" />
                      {(i * 45)} km <span className="text-slate-600 px-1">•</span> {stop.boardingPoint || 'Main Bus Stand'}
                    </p>
                  </div>
                  <div className="w-[80px] text-right shrink-0">
                    <p className={`text-sm font-semibold transition-colors ${isPassed ? 'text-slate-500' : 'text-slate-200'}`}>
                      {stop.plannedArrival}
                    </p>
                    <p className={`text-[11px] font-medium mt-0.5 ${isPassed ? 'text-slate-600' : isDelay ? 'text-red-400' : 'text-emerald-400'}`}>
                      {isDelay ? stop.delayedArrival : stop.plannedArrival}
                    </p>
                  </div>
                </div>
                
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

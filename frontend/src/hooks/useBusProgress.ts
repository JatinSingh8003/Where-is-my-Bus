import { useState, useEffect } from 'react';
import type { Bus, BusRoute } from '../types';

export interface BusProgress {
  currentStopIndex: number;
  nextStopIndex: number;
  segmentProgress: number;
  isActive: boolean;
}

function parseTime(timeStr?: string): number | null {
  if (!timeStr || timeStr === '-') return null;
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  now.setHours(h, m, 0, 0);
  return now.getTime();
}

export function useBusProgress(bus: Bus | null, route: BusRoute | null): BusProgress {
  const [progressData, setProgressData] = useState<BusProgress>({
    currentStopIndex: -1,
    nextStopIndex: -1,
    segmentProgress: 0,
    isActive: false
  });

  useEffect(() => {
    if (!bus || !route || !bus.isAvailable) {
      setProgressData({ currentStopIndex: -1, nextStopIndex: -1, segmentProgress: 0, isActive: false });
      return;
    }

    // Run immediately, then interval
    const updateProgress = () => {
      const now = Date.now();
      let cIdx = -1, nIdx = -1, prog = 0;
      let isActive = false;
      
      const isDelay = bus.delayMinutes > 0;

      for (let i = 0; i < route.stops.length - 1; i++) {
        const stop1 = route.stops[i];
        const stop2 = route.stops[i + 1];
        
        const depStr = isDelay ? (stop1.delayedDeparture || stop1.delayedArrival) : (stop1.plannedDeparture || stop1.plannedArrival);
        const arrStr = isDelay ? (stop2.delayedArrival || stop2.plannedArrival) : (stop2.plannedArrival || stop2.plannedDeparture);
        
        const t1 = parseTime(depStr);
        const t2 = parseTime(arrStr);

        if (t1 && t2) {
          if (now >= t1 && now <= t2) {
            cIdx = i;
            nIdx = i + 1;
            prog = (now - t1) / (t2 - t1);
            isActive = true;
            break;
          } else if (now < t1) {
            if (i === 0) {
              cIdx = 0; nIdx = 0; prog = 0; isActive = false;
            } else {
              cIdx = i; nIdx = i; prog = 0; isActive = true;
            }
            break;
          }
        }
      }

      if (cIdx === -1) {
        const firstStop = route.stops[0];
        const lastStop = route.stops[route.stops.length - 1];
        
        const tFirst = parseTime(isDelay ? (firstStop.delayedDeparture || firstStop.delayedArrival) : (firstStop.plannedDeparture || firstStop.plannedArrival));
        const tLast = parseTime(isDelay ? (lastStop.delayedArrival || lastStop.plannedArrival) : (lastStop.plannedArrival || lastStop.plannedDeparture));

        if (tFirst && now < tFirst) {
          cIdx = 0; nIdx = 0; prog = 0; isActive = false;
        } else if (tLast && now >= tLast) {
          cIdx = route.stops.length - 1; nIdx = route.stops.length - 1; prog = 1; isActive = false;
        }
      }

      setProgressData({
        currentStopIndex: cIdx,
        nextStopIndex: nIdx,
        segmentProgress: Math.max(0, Math.min(1, prog)),
        isActive
      });
    };

    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [bus, route]);

  return progressData;
}

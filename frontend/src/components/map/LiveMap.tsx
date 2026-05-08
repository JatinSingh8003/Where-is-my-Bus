import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import type { BusRoute, LiveLocation, Bus } from '../../types'
import type { BusProgress } from '../../hooks/useBusProgress'
import 'leaflet/dist/leaflet.css'

interface Props {
  route: BusRoute
  live: LiveLocation
  bus?: Bus
  progressData: BusProgress
}

// Custom Bus Icon
const busHtml = `<div class="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.8)] border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>`
const busIcon = L.divIcon({
  html: busHtml,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
})

export function LiveMap({ route, live, bus, progressData }: Props) {
  const [roadPath, setRoadPath] = useState<[number, number][]>([])
  const [stopIndices, setStopIndices] = useState<number[]>([])
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([live.lat, live.lng])
  
  // Fetch realistic road polyline using OSRM
  useEffect(() => {
    async function fetchRoadRoute() {
      // OSRM requires format: lon,lat;lon,lat
      const coordinatesString = route.stops.map(stop => `${stop.lng},${stop.lat}`).join(';')
      try {
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`)
        const data = await response.json()
        if (data.routes && data.routes[0]) {
          // GeoJSON is [lon, lat], Leaflet needs [lat, lon]
          const mappedCoords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number])
          setRoadPath(mappedCoords)
          
          const indices = route.stops.map(stop => {
             let minD = Infinity;
             let minIdx = 0;
             for (let i = 0; i < mappedCoords.length; i++) {
                const [lat, lng] = mappedCoords[i];
                const d = (lat - stop.lat)**2 + (lng - stop.lng)**2;
                if (d < minD) {
                   minD = d;
                   minIdx = i;
                }
             }
             return minIdx;
          });
          
          for (let i = 1; i < indices.length; i++) {
            if (indices[i] < indices[i-1]) indices[i] = indices[i-1];
          }
          setStopIndices(indices)
        } else {
          setRoadPath(route.path)
          setStopIndices(route.stops.map((_, i) => i === 0 ? 0 : route.path.length - 1))
        }
      } catch (err) {
        console.error('Failed to fetch OSRM route, falling back to straight lines', err)
        setRoadPath(route.path)
        setStopIndices(route.stops.map((_, i) => i === 0 ? 0 : route.path.length - 1))
      }
    }
    fetchRoadRoute()
  }, [route.stops, route.path])

  // Simulate movement along the path
  useEffect(() => {
    if (roadPath.length === 0 || stopIndices.length === 0) return;

    const { currentStopIndex, nextStopIndex, segmentProgress, isActive } = progressData;
    
    if (currentStopIndex === -1) {
       setCurrentPosition([live.lat, live.lng]);
       return;
    }

    if (!isActive || currentStopIndex === nextStopIndex) {
       setCurrentPosition(roadPath[stopIndices[currentStopIndex]] || [live.lat, live.lng]);
       return;
    }

    const startIndex = stopIndices[currentStopIndex];
    const endIndex = stopIndices[nextStopIndex];

    if (startIndex === undefined || endIndex === undefined) return;

    const exactIndex = startIndex + (endIndex - startIndex) * segmentProgress;
    const lowerIndex = Math.floor(exactIndex);
    const upperIndex = Math.ceil(exactIndex);
    
    if (lowerIndex === upperIndex) {
      setCurrentPosition(roadPath[lowerIndex]);
    } else {
      const fraction = exactIndex - lowerIndex;
      const p1 = roadPath[lowerIndex];
      const p2 = roadPath[upperIndex];
      
      if (p1 && p2) {
        const lat = p1[0] + (p2[0] - p1[0]) * fraction;
        const lng = p1[1] + (p2[1] - p1[1]) * fraction;
        setCurrentPosition([lat, lng]);
      }
    }
  }, [roadPath, stopIndices, progressData, live.lat, live.lng]);

  return (
    <MapContainer center={currentPosition} zoom={11} className="h-full w-full z-0" zoomControl={false} attributionControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      
      {/* Real road path from OSRM */}
      {roadPath.length > 0 && (
        <Polyline positions={roadPath} color="#3b82f6" weight={5} opacity={0.8} className="drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      )}
      
      {route.stops.map((stop) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup className="glass-popup">{stop.name}</Popup>
        </Marker>
      ))}
      
      {/* Animated Bus Icon */}
      <Marker position={currentPosition} icon={busIcon}>
        <Popup className="glass-popup font-bold text-blue-500">
          {bus?.busNumber || 'Live'} • Tracking
        </Popup>
      </Marker>
    </MapContainer>
  )
}

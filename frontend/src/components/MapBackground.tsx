import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { ReactNode } from 'react'

export function MapBackground({ children }: { children?: ReactNode }) {
  // Center of India (roughly) or Rajasthan
  const center = { lat: 26.9124, lng: 75.7873 } // Jaipur

  return (
    <div className="fixed inset-0 z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={6}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {/* Render children (like glowing markers/routes) if needed later */}
        {children}
      </MapContainer>
      
      {/* Overlay to dim the map slightly and add a vignette effect */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-radial-vignette"></div>
    </div>
  )
}

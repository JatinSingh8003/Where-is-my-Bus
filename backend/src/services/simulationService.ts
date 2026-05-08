import { liveLocations, routes } from '../data/seed'

export function advanceSimulation() {
  Object.values(liveLocations).forEach((location) => {
    const route = routes.find((r) => r.id.includes(location.busId === 'bus-101' ? 'ajmer' : 'jodhpur'))
    if (!route) return

    const target = route.path[Math.min(1, route.path.length - 1)]
    location.lat = Number((location.lat + (target[0] - location.lat) * 0.05).toFixed(5))
    location.lng = Number((location.lng + (target[1] - location.lng) * 0.05).toFixed(5))
    location.speed = 48 + Math.round(Math.random() * 20)
    location.etaMinutes = Math.max(2, location.etaMinutes - 1)
    location.updatedAt = new Date().toISOString()
  })
}

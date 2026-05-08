import { buses, liveSeed, routes } from '../data/demoData'
import type { Bus, LiveLocation } from '../types'

export interface SearchQuery {
  source: string
  destination: string
  date: string
  term: string
}

export const busService = {
  search(query: SearchQuery): Bus[] {
    const normalizedSource = query.source.trim().toLowerCase()
    const normalizedDestination = query.destination.trim().toLowerCase()
    const normalizedTerm = query.term.trim().toLowerCase()
    const hasDate = query.date.trim().length > 0

    return buses.filter((bus) => {
      const route = routes.find((r) => r.id === bus.routeId)
      if (!route) return false

      const bySource = !normalizedSource || route.source.toLowerCase().includes(normalizedSource)
      const byDestination = !normalizedDestination || route.destination.toLowerCase().includes(normalizedDestination)
      const byTerm = !normalizedTerm || [bus.busNumber, route.name, route.source, route.destination].join(' ').toLowerCase().includes(normalizedTerm)

      return bySource && byDestination && byTerm && hasDate
    })
  },
  getBus(busId: string) {
    return buses.find((b) => b.id === busId) || null
  },
  getRoute(routeId: string) {
    return routes.find((r) => r.id === routeId) || null
  },
  getLive(busId: string): LiveLocation | null {
    return liveSeed[busId] || null
  }
}

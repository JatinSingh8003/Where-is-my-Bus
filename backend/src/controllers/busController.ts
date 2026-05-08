import type { Request, Response } from 'express'
import { buses, liveLocations, routes } from '../data/seed'

export function searchBuses(req: Request, res: Response) {
  const { source = '', destination = '', term = '', date = '' } = req.query as Record<string, string>
  const result = buses.filter((bus) => {
    const route = routes.find((r) => r.id === bus.routeId)
    if (!route) return false
    const routeText = `${route.source} ${route.destination} ${bus.busNumber}`.toLowerCase()
    return route.source.toLowerCase().includes(source.toLowerCase())
      && route.destination.toLowerCase().includes(destination.toLowerCase())
      && routeText.includes(term.toLowerCase())
      && Boolean(date)
  })
  res.json({ buses: result })
}

export function getBusDetails(req: Request, res: Response) {
  const busId = String(req.params.busId || '')
  const bus = buses.find((b) => b.id === busId)
  if (!bus) return res.status(404).json({ message: 'Bus not found' })
  const route = routes.find((r) => r.id === bus.routeId)
  return res.json({ bus, route, live: liveLocations[bus.id] || null })
}

export function getLiveByBus(req: Request, res: Response) {
  const busId = String(req.params.busId || '')
  const live = liveLocations[busId]
  if (!live) return res.status(404).json({ message: 'Live location unavailable' })
  return res.json(live)
}

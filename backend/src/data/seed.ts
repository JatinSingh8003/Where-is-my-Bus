import type { LiveLocation } from '../types'

export const buses = [
  { id: 'bus-101', busNumber: 'RJ14-TR-101', routeId: 'route-jaipur-ajmer', operator: 'Rajasthan Roadways', departureTime: '06:00', arrivalTime: '08:15', isAvailable: true, delayMinutes: 10 },
  { id: 'bus-102', busNumber: 'RJ14-TR-102', routeId: 'route-jaipur-jodhpur', operator: 'Shree Travels', departureTime: '09:00', arrivalTime: '14:30', isAvailable: true, delayMinutes: 15 },
  { id: 'bus-103', busNumber: 'RJ14-TR-103', routeId: 'route-jaipur-kota', operator: 'InterCity Express', departureTime: '06:45', arrivalTime: '10:20', isAvailable: false, delayMinutes: 12 }
]

export const routes = [
  { id: 'route-jaipur-ajmer', source: 'Jaipur', destination: 'Ajmer', path: [[26.9124, 75.7873], [26.6205, 75.0272], [26.4499, 74.6399]] },
  { id: 'route-jaipur-jodhpur', source: 'Jaipur', destination: 'Jodhpur', path: [[26.9124, 75.7873], [26.2973, 73.0189]] },
  { id: 'route-jaipur-kota', source: 'Jaipur', destination: 'Kota', path: [[26.9124, 75.7873], [25.2138, 75.8648]] }
]

export const liveLocations: Record<string, LiveLocation> = {
  'bus-101': { busId: 'bus-101', lat: 26.78, lng: 75.4, speed: 58, currentStop: 'On Highway', nextStop: 'Kishangarh', etaMinutes: 22, updatedAt: new Date().toISOString() },
  'bus-102': { busId: 'bus-102', lat: 26.63, lng: 74.17, speed: 62, currentStop: 'Merta City', nextStop: 'Jodhpur', etaMinutes: 130, updatedAt: new Date().toISOString() }
}

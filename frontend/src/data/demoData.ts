import type { Bus, BusRoute, LiveLocation } from '../types'

export const routes: BusRoute[] = [
  {
    id: 'route-jaipur-ajmer',
    name: 'Jaipur -> Ajmer',
    source: 'Jaipur',
    destination: 'Ajmer',
    path: [
      [26.9124, 75.7873],
      [26.6205, 75.0272],
      [26.4499, 74.6399]
    ],
    stops: [
      { id: 's1', name: 'Jaipur Sindhi Camp', lat: 26.9238, lng: 75.7986, plannedArrival: '-', delayedArrival: '-', plannedDeparture: '06:00', delayedDeparture: '06:08' },
      { id: 's2', name: 'Kishangarh', lat: 26.5904, lng: 74.8537, plannedArrival: '07:25', delayedArrival: '07:35', plannedDeparture: '07:30', delayedDeparture: '07:40' },
      { id: 's3', name: 'Ajmer Bus Stand', lat: 26.4499, lng: 74.6399, plannedArrival: '08:15', delayedArrival: '08:25', plannedDeparture: '-', delayedDeparture: '-' }
    ]
  },
  {
    id: 'route-jaipur-jodhpur',
    name: 'Jaipur -> Jodhpur',
    source: 'Jaipur',
    destination: 'Jodhpur',
    path: [[26.9124, 75.7873], [26.2973, 73.0189]],
    stops: [
      { id: 's4_1', name: 'Jaipur', lat: 26.9124, lng: 75.7873, plannedArrival: '-', delayedArrival: '-', plannedDeparture: '09:00', delayedDeparture: '09:05', boardingPoint: 'Sindhi Camp Bus Stand' },
      { id: 's4_2', name: 'Dudu', lat: 26.6713, lng: 75.2281, plannedArrival: '10:00', delayedArrival: '10:05', plannedDeparture: '10:05', delayedDeparture: '10:10', boardingPoint: 'Highway Toll Plaza' },
      { id: 's4_3', name: 'Kishangarh', lat: 26.5727, lng: 74.8606, plannedArrival: '10:45', delayedArrival: '10:55', plannedDeparture: '10:50', delayedDeparture: '11:00', boardingPoint: 'Makrana Chauraha' },
      { id: 's4_4', name: 'Ajmer', lat: 26.4499, lng: 74.6399, plannedArrival: '11:20', delayedArrival: '11:30', plannedDeparture: '11:25', delayedDeparture: '11:35', boardingPoint: 'Gagangiri Hotel / Bypass' },
      { id: 's4_5', name: 'Beawar', lat: 26.1018, lng: 74.3197, plannedArrival: '12:15', delayedArrival: '12:20', plannedDeparture: '12:20', delayedDeparture: '12:25', boardingPoint: 'City Bus Stand' },
      { id: 's4_6', name: 'Bar', lat: 26.0827, lng: 74.0725, plannedArrival: '12:45', delayedArrival: '12:45', plannedDeparture: '12:50', delayedDeparture: '12:50', boardingPoint: 'Bar Circle' },
      { id: 's4_7', name: 'Jaitaran', lat: 26.1969, lng: 73.9432, plannedArrival: '13:15', delayedArrival: '13:20', plannedDeparture: '13:20', delayedDeparture: '13:25', boardingPoint: 'Main Market' },
      { id: 's4_8', name: 'Bilara', lat: 26.1793, lng: 73.7077, plannedArrival: '13:50', delayedArrival: '13:55', plannedDeparture: '13:55', delayedDeparture: '14:00', boardingPoint: 'Bus Stop' },
      { id: 's4_9', name: 'Dangiyawas', lat: 26.2624, lng: 73.2384, plannedArrival: '14:40', delayedArrival: '14:45', plannedDeparture: '14:45', delayedDeparture: '14:50', boardingPoint: 'Highway Rest Stop' },
      { id: 's4_10', name: 'Jodhpur', lat: 26.2389, lng: 73.0243, plannedArrival: '15:20', delayedArrival: '15:30', plannedDeparture: '-', delayedDeparture: '-', boardingPoint: 'Paota Bus Stand' }
    ]
  },
  {
    id: 'route-jaipur-kota',
    name: 'Jaipur -> Kota',
    source: 'Jaipur',
    destination: 'Kota',
    path: [[26.9124, 75.7873], [25.2138, 75.8648]],
    stops: [
      { id: 's7', name: 'Jaipur', lat: 26.9238, lng: 75.7986, plannedArrival: '-', delayedArrival: '-', plannedDeparture: '06:45', delayedDeparture: '06:45' },
      { id: 's8', name: 'Tonk', lat: 26.1658, lng: 75.7885, plannedArrival: '08:10', delayedArrival: '08:20', plannedDeparture: '08:15', delayedDeparture: '08:25' },
      { id: 's9', name: 'Kota', lat: 25.2138, lng: 75.8648, plannedArrival: '10:20', delayedArrival: '10:35', plannedDeparture: '-', delayedDeparture: '-' }
    ]
  }
]

export const buses: Bus[] = [
  { id: 'bus-101', busNumber: 'RJ14-TR-101', operator: 'Rajasthan Roadways', routeId: 'route-jaipur-ajmer', departureTime: '06:00', arrivalTime: '08:15', delayMinutes: 10, isAvailable: true },
  { id: 'bus-102', busNumber: 'RJ14-TR-102', operator: 'Shree Travels', routeId: 'route-jaipur-jodhpur', departureTime: '09:00', arrivalTime: '15:20', delayMinutes: 15, isAvailable: true },
  { id: 'bus-103', busNumber: 'RJ14-TR-103', operator: 'InterCity Express', routeId: 'route-jaipur-kota', departureTime: '06:45', arrivalTime: '10:20', delayMinutes: 12, isAvailable: false }
]

export const liveSeed: Record<string, LiveLocation> = {
  'bus-101': { busId: 'bus-101', lat: 26.78, lng: 75.4, speed: 58, currentStop: 'On Highway', nextStop: 'Kishangarh', etaMinutes: 22, progress: 0.45, updatedAt: new Date().toISOString() },
  'bus-102': { busId: 'bus-102', lat: 26.09, lng: 74.2, speed: 65, currentStop: 'Beawar', nextStop: 'Bar', etaMinutes: 20, progress: 0.4, updatedAt: new Date().toISOString() }
}

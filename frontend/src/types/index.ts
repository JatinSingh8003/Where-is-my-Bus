export type Role = 'user' | 'driver' | 'admin' | 'passenger'

export interface TracerUser {
  uid: string
  name: string
  email: string
  role: Role
  password?: string
  drivingLicense?: string
  rcNumber?: string
  busRegistration?: string
}

export interface StopPoint {
  id: string
  name: string
  lat: number
  lng: number
  plannedArrival: string
  delayedArrival: string
  plannedDeparture?: string
  delayedDeparture?: string
  boardingPoint?: string
}

export interface BusRoute {
  id: string
  name: string
  source: string
  destination: string
  path: [number, number][]
  stops: StopPoint[]
}

export interface Bus {
  id: string
  busNumber: string
  operator: string
  routeId: string
  departureTime: string
  arrivalTime: string
  delayMinutes: number
  isAvailable: boolean
}

export interface LiveLocation {
  busId: string
  lat: number
  lng: number
  speed: number
  currentStop: string
  nextStop: string
  etaMinutes: number
  progress: number
  updatedAt: string
}

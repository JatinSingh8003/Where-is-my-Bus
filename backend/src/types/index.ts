export type Role = 'user' | 'driver' | 'admin' | 'passenger'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export interface LiveLocation {
  busId: string
  lat: number
  lng: number
  speed: number
  currentStop: string
  nextStop: string
  etaMinutes: number
  updatedAt: string
}

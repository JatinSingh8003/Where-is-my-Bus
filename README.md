# Tracer - Smart Bus Tracking PWA

Tracer is a startup-style, search-first live bus tracking web app prototype focused on Rajasthan demo routes with an architecture ready for India-wide scaling.

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS + Vite + Framer Motion + Leaflet
- Backend: Node.js + Express + TypeScript
- Realtime: Firebase Realtime Database (ready wiring) + simulated movement engine
- Data/Auth: Firebase Authentication + Firestore-ready collections

## Project Structure

- `frontend/` - responsive PWA-style client
- `backend/` - API server and live simulation

## Features Implemented

- Modern landing page with product-style branding
- Login/register flow with role-aware demo behavior (`user`, `driver`, `admin`, `passenger`)
- Search-first dashboard with bus discovery by source, destination, date, and term
- Bus details view with stop timeline and delayed times
- Dedicated live tracking page (single selected bus only)
- Leaflet + OpenStreetMap live map, route polyline, stop markers, moving bus state
- Driver dashboard and admin dashboard screens for operations workflows
- Express API for bus search/details/live status
- Live bus simulation updates every 4 seconds
- Strict TypeScript setup in frontend/backend

## Firebase Collection Design

Use these collections for productionized implementation:

- `users`: profile, role, auth-linked UID
- `buses`: static bus data, operator, route mapping
- `routes`: source, destination, path polyline, stop list
- `trips`: date-wise active trips linked to buses/routes
- `liveLocations`: real-time lat/lng, speed, ETA, status
- `schedules`: planned departures/arrivals and exceptions

## Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend health endpoint: `GET /api/health`

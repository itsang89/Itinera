# Itinera - Travel Itinerary App

An all-in-one trip planner where you can organize trips day-by-day, track budgets, view activities on a map, check weather, and manage packing lists.

## Tech Stack

- **React** (Vite) + TypeScript
- **Firebase** (Auth with Google sign-in, Firestore)
- **Google Maps** (@vis.gl/react-google-maps) with Places autocomplete
- **Open-Meteo API** for weather (no key required)
- **ExchangeRate-API** for currency conversion
- **React Router** for navigation

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in your keys:

   ```bash
   cp .env.example .env
   ```

   Required variables:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_GOOGLE_MAPS_API_KEY`
   - `VITE_EXCHANGERATE_API_KEY` (optional for MVP)

3. **Firebase setup**

   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable **Authentication** → Google sign-in
   - Create a **Firestore** database
   - Deploy security rules: `firebase deploy --only firestore:rules`
   - Deploy indexes: `firebase deploy --only firestore:indexes`

4. **Google Maps**

   - Enable Maps JavaScript API and Places API in [Google Cloud Console](https://console.cloud.google.com)

5. **Run**

   ```bash
   npm run dev
   ```

## Features

- **Auth** — Google sign-in with persisted session
- **My Trips** — List, create, delete trips
- **Create Trip** — Title, destination (Places autocomplete), dates, budget, currency
- **Trip Overview** — Summary, weather forecast, quick links
- **Itinerary** — Day-by-day activities with add/edit/delete/reorder
- **Map View** — All activities as pins on Google Map
- **Budget Tracker** — Total/spent/remaining, expense logging
- **Packing Checklist** — Items by category, pack/unpack toggle
- **Profile** — User info, settings, logout

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # Auth context
├── hooks/          # Data hooks (trips, activities, etc.)
├── lib/            # Firebase, env
├── pages/          # Route pages
└── types/          # TypeScript types
```

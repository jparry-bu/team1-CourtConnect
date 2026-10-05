# CourtConnect

CourtConnect is a web application prototype designed to help basketball players discover local courts, find pickup games, organise teams, and connect with other players.

The application was developed as part of a BU CS632 project and is built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Create an account and player profile
- Log in and maintain a local user session
- Discover nearby basketball courts
- View available pickup games
- Filter games by date, location, time, and skill level
- Register for games and select a playing position
- Host new pickup games
- Reschedule or cancel hosted games
- View upcoming games in a calendar
- Build and balance teams
- Participate in game-specific messaging
- Receive game and schedule notifications
- View court details
- Manage player profile information

## Technology

- React
- TypeScript
- Vite
- Tailwind CSS
- Browser `localStorage` for prototype data persistence

## Project Structure

```text
src/
├── components/
│   ├── FeedbackModal.tsx
│   ├── ReportModal.tsx
│   └── Toast.tsx
├── screens/
│   ├── CalendarScreen.tsx
│   ├── CourtDetailScreen.tsx
│   ├── CreateGameScreen.tsx
│   ├── DiscoverScreen.tsx
│   ├── GamesScreen.tsx
│   ├── MessagesScreen.tsx
│   ├── NotificationsScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── RegistrationScreen.tsx
│   └── TeamBuilderScreen.tsx
├── types/
│   ├── GameActivity.ts
│   ├── GameRegistration.ts
│   ├── HostedGame.ts
│   └── UserAccount.ts
├── App.tsx
├── index.css
└── main.tsx
```

## Running the Project

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The local development URL will be displayed in the terminal.

## Prototype Data

CourtConnect currently operates as a front-end prototype. User accounts, hosted games, registrations, messages, notifications, and related application state are stored locally in the browser using `localStorage`.

No production backend or external database is currently required.

## Authors

Boston University  
MET CS 632 – IT Project Management  
Team 1
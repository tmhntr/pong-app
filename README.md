# Pong!

Real-time multiplayer Pong in the browser. Create a game room, share the code, and play against a friend.

## Features

- Room-based multiplayer via WebSocket (Socket.IO)
- Server-authoritative game loop with client-side prediction
- Entity interpolation (200ms render delay) for smooth opponent movement
- Server reconciliation with input sequence numbers
- Mobile touch controls + keyboard (arrow keys)

## Tech Stack

- **Frontend:** React 18, TypeScript, React Router 6, Socket.IO client
- **Backend:** Node.js, Express, Socket.IO 4
- **Build:** Create React App (react-scripts 5)

## Architecture

```
Client                          Server
  |                               |
  |-- joinGame(gid, name) -----→ |  Creates/joins room
  |                               |  Starts game loop when 2 players
  |-- clientAction(action) ----→ |  Queues input with sequence number
  |                               |
  |←---- update(state) --------- |  Broadcasts at 10 Hz
  |                               |
  Client-side prediction          Server-authoritative physics
  + server reconciliation         + collision detection
  + entity interpolation
```

## Running Locally

```bash
npm install
npm run build    # builds React frontend + compiles server
npm start        # serves on http://localhost:3001
```

For frontend development with hot reload:

```bash
npm run dev      # CRA dev server on :3000 (proxy backend separately)
```

## Docker

```bash
docker build -t pong-app .
docker run -p 3001:3001 pong-app
```

## How to Play

1. Open `http://localhost:3001`
2. Enter your display name
3. Click "Start new game" or enter a game code to join an existing one
4. Use arrow keys (or touch on mobile) to move your paddle
5. First to... well, there's no win condition yet. Just have fun.

# TaskNest

TaskNest is a lightweight task management application designed to help users organize their daily tasks.

Users can create tasks, mark them as completed, and track their progress through a dashboard.

The application also includes a Productivity Score, which attempts to represent how productive the user has been while using the system.

## Tech Stack

### Frontend
React (Vite)

### Backend
Node.js + Express

### Database
PostgreSQL

### ORM
Prisma

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tasknest
```

### 2. Backend Setup
Navigate to the server directory.
```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and set `DATABASE_URL` to your PostgreSQL connection string. Do not commit `.env`.
The server uses Prisma's PostgreSQL driver adapter.

Generate the Prisma client and apply database migrations.
```bash
npx prisma generate
npx prisma migrate deploy
```

Start the backend server.
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the client directory.
```bash
cd client
npm install
npm run dev
```

The frontend will run locally and connect to the backend server.

To point the client at a different backend, create `client/.env` with:
```env
VITE_API_URL=http://localhost:5000
```

## Productivity Score

The score is derived from completed tasks: a normal task is worth 1 point, and an important task is worth 2 points. Incomplete tasks contribute zero. Task importance can be selected when creating a task or changed from its task card. The score is shared across this project because it does not implement user authentication.

Run backend scoring and validation tests from `server` with `npm test`. Run frontend checks from `client` with `npm run lint` and `npm run build`.

## The Situation

The product team recently reviewed the Productivity Score feature.

The feature was originally implemented based on the following client request:

“Add a productivity system so users can see how productive they are.
It should consider important tasks and help users stay consistent.”

However, after reviewing the system, engineers noticed several problems.

The behavior of the productivity score is difficult to interpret.

It is not clear what actions influence the score or how the score should represent productivity.

Additionally, the requirement mentions important tasks, but the system currently does not support any way to mark tasks as important.

## Your Mission

You must investigate the existing implementation of the productivity system and determine whether it behaves meaningfully.

While exploring the system, pay attention to:

• how the productivity score is calculated
• what actions affect the score
• whether the implementation matches the original requirement

If you discover inconsistencies or missing functionality, improve the system so the behavior becomes clearer and more meaningful.

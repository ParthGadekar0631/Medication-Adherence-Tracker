# Vercel deployment

This repository is a monorepo deployed as two Vercel projects:

- `backend/` contains the Express API.
- `frontend/` contains the statically exported Expo web application.

Both projects can connect to this same GitHub repository. Vercel automatically deploys them when the selected Git branch changes.

## Backend project

1. Import `ParthGadekar0631/Medication-Adherence-Tracker` into Vercel.
2. Set the project Root Directory to `backend`.
3. Add `MONGODB_URI`, `JWT_SECRET`, and `OPENAI_API_KEY` as sensitive environment variables.
4. Deploy and copy the stable backend domain.

The Express app is exported from `server.js` for Vercel. `npm start` still starts the long-running local server and local reminder scheduler.

## Frontend project

1. Import the same GitHub repository as a second Vercel project.
2. Set the project Root Directory to `frontend`.
3. Set `EXPO_PUBLIC_API_URL` to the backend domain without a trailing slash.
4. Deploy. Vercel runs `npm run build` and serves `dist/`.

`EXPO_PUBLIC_API_URL` is bundled into the frontend and is therefore public. MongoDB, JWT, and OpenAI values must never be placed in the frontend project.

## Local environment files

The real `.env` files are ignored by Git. Templates list the expected variable names:

- `backend/.env.example`
- `frontend/.env.example`

## GitHub Pages

GitHub Pages can serve only the static Expo frontend. It cannot run Express, MongoDB access, the OpenAI route, or a persistent Node scheduler. GitHub Actions validates both packages, while Vercel hosts the complete application.

## Reminder scheduler

The current `node-cron` process starts only under `npm start`. It is not started inside a Vercel Function. The current job logs reminder candidates, while the Expo frontend schedules user-visible notifications. If server-generated notifications are added later, move the work behind a protected HTTP endpoint and invoke it with a managed scheduler.

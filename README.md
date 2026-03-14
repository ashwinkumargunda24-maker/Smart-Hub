# SmartHub IoT Dashboard

A simple IoT-style dashboard with login, registration, and sensor data display.

## Run the project

```bash
npm install
npm start
```

Then open http://localhost:3000 (or the port set in `PORT` env).

## Improvements made

- **Security**: Passwords are hashed with bcrypt; session secret can be set via `SESSION_SECRET` env.
- **Data**: Users are stored in `users.json` so accounts persist across server restarts.
- **Validation**: Duplicate usernames are rejected; login/register show clear error messages.
- **UX**: Login shows "Account created" after registration; register shows "Username already taken" etc.; dashboard high-temp warning hides when temperature drops below 35 again.
- **Code**: Uses `path.join`, configurable `PORT`, and a `package.json` for dependencies.

## Optional next steps

- Add a real database (e.g. SQLite) instead of `users.json`.
- Add password strength rules and confirm-password on register.
- Use environment variables for all secrets (e.g. `.env` with `dotenv`).
- Add rate limiting on login/register to reduce brute-force risk.
- Serve the alert sound file at `public/sound/alert.mp3` for high-temperature alerts.

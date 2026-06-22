# Run HanApp Locally

## 1. Install dependencies

Run from the project root:

```bash
npm install
```

## 2. Configure API env

Create `apps/api/.env` from `apps/api/.env.example`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=replace-with-service-role-key
CORS_ORIGIN=*

OPENAI_API_KEY=replace-with-openai-api-key
OPENAI_STT_MODEL=gpt-4o-mini-transcribe
OPENAI_TTS_MODEL=gpt-4o-mini-tts
OPENAI_GRADING_MODEL=gpt-4o-mini

PORT=3000
```

`SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` must stay only in the backend — never expose them to the mobile app.

## 3. Configure mobile env

Create `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

If testing on Android emulator, use:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api
```

If testing on a physical phone, use your computer LAN IP:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:3000/api
```

Example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000/api
```

## 4. Run the Next.js API

From the project root:

```bash
npm run api
```

The API should run at:

```txt
http://localhost:3000
```

Health check:

```txt
http://localhost:3000/api/health
```

Available endpoints:

```txt
GET  http://localhost:3000/api/hsk-levels
GET  http://localhost:3000/api/topics
GET  http://localhost:3000/api/questions?level=HSK1&topic=food
POST http://localhost:3000/api/practice/sessions
POST http://localhost:3000/api/practice/grade
POST http://localhost:3000/api/practice/transcribe
POST http://localhost:3000/api/practice/tts
GET  http://localhost:3000/api/progress
```

## 5. Run the Expo mobile app

Open a second terminal from the project root:

```bash
npm run mobile
```

Then choose the target from the Expo terminal:

```txt
a = Android
i = iOS
w = Web
```

Direct commands:

```bash
npm run mobile:android
npm run mobile:ios
npm run mobile:web
```

## 6. Build and typecheck

API build:

```bash
npm run api:build
```

API typecheck:

```bash
npm run typecheck -w @hanapp/api
```

Mobile typecheck:

```bash
npx tsc -p apps/mobile/tsconfig.json --noEmit
```

## 7. Common issues

### PowerShell blocks npm

If `npm` fails with an execution policy error, use:

```bash
npm.cmd install
npm.cmd run api
npm.cmd run mobile
```

### Mobile cannot reach localhost

`localhost` inside an emulator or phone may not be your computer.

- Android emulator: use `http://10.0.2.2:3000/api`.
- Physical phone: use your computer LAN IP.
- Make sure phone and computer are on the same Wi-Fi.
- Make sure firewall allows port `3000`.

### API returns env error

Check `apps/api/.env` has all required keys:

```env
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
```

Restart `npm run api` after changing env files.

### Questions endpoint returns empty data

Run the SQL schema and seed data from `HANAPP_BACKEND_ROADMAP.md` in Supabase SQL Editor first.

### TTS sounds robotic or slow

The default voice is `alloy`. You can set a different OpenAI TTS voice via the `voice` field in the request body. Available voices: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`.

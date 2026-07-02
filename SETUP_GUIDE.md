# CPTE Exam Prep — Setup Guide

Follow these steps **in order**. Each step tells you what success looks like before moving on.

---

## Step 0 — Install required tools

1. **Node.js** — Download from https://nodejs.org (choose the "LTS" version)
   - After installing, open your terminal and type: `node --version`
   - You should see something like `v20.x.x`

2. **VS Code** — Download from https://code.visualstudio.com
   - This is your code editor. Open the `pt-exam-app` folder in VS Code.

---

## Step 1 — Set up your project folder

```
pt-exam-app/
├── .env.example         ← copy this to .env
├── .gitignore
├── package.json
├── SETUP_GUIDE.md
├── db/
│   ├── 001_init_schema.sql
│   ├── 002_users_rls.sql
│   ├── questions.js
│   └── seed.js
├── server/
│   ├── index.js
│   ├── lib/supabase.js
│   └── routes/
│       ├── attempts.js
│       └── templates.js
└── client/
    ├── .env.example     ← copy this to client/.env
    ├── package.json
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── lib/
        │   ├── supabaseClient.js
        │   └── api.js
        └── components/
            ├── AuthScreen.jsx
            ├── HomeScreen.jsx
            ├── ExamScreen.jsx
            └── ResultsScreen.jsx
```

---

## Step 2 — Create your Supabase project

1. Go to https://supabase.com and click **Start your project**
2. Sign in with GitHub (free)
3. Click **New project**, give it a name (e.g., `cpte-exam`), choose a password, and pick a region close to you
4. Wait ~2 minutes for it to be ready

Once ready, you need three values from Supabase:

| What | Where to find it |
|------|-----------------|
| **Project URL** | Settings → API → Project URL |
| **Anon key** | Settings → API → Project API keys → anon public |
| **Service role key** | Settings → API → Project API keys → service_role (click reveal) |

---

## Step 3 — Fill in your .env files

**Root .env** (copy `.env.example` to `.env`):
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**client/.env** (copy `client/.env.example` to `client/.env`):
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_API_URL=http://localhost:3001
```

> **Important**: Never commit `.env` files to GitHub — they contain secret keys.

---

## Step 4 — Install dependencies

Open a terminal in the project root folder:

```bash
npm install
cd client && npm install && cd ..
```

**Success**: No red error messages. You'll see packages downloading.

---

## Step 5 — Run the database schema in Supabase

1. In Supabase, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `db/001_init_schema.sql`, copy all the text, paste it in, and click **Run**
4. You should see "Success. No rows returned"
5. Do the same for `db/002_users_rls.sql`

**Success**: In Table Editor, you should now see tables: `users`, `exam_templates`, `questions`, `exam_attempts`, `attempt_answers`

---

## Step 6 — Load the questions into the database

Back in your terminal at the project root:

```bash
npm run seed
```

**Success**: You should see:
```
Using template ID: 1
✓ Seeded 100 questions successfully.
```

---

## Step 7 — Run the app

Open **two terminal tabs**:

**Tab 1 — Backend** (in the project root):
```bash
npm start
```
You should see: `CPTE API server running on port 3001`

Test it: open your browser and go to `http://localhost:3001/api/health`
You should see: `{"ok":true,"timestamp":"..."}`

**Tab 2 — Frontend** (in the `client/` folder):
```bash
cd client
npm run dev
```
You should see: `Local: http://localhost:5173/`

Open `http://localhost:5173` in your browser.

---

## Step 8 — Create your first account

1. On the login page, click **Sign Up**
2. Enter your email and a password (6+ characters)
3. Check your email for a confirmation link from Supabase and click it
4. Return to the app and sign in

---

## Troubleshooting

**"User profile not found" error after login**
The `002_users_rls.sql` trigger auto-creates a profile row on signup. If it fails:
- In Supabase SQL Editor, run `002_users_rls.sql` again
- Sign up with a new email

**"Template not found" or no exam appears**
- Make sure you ran Step 5 (001_init_schema.sql inserts the default template)
- Re-run `npm run seed`

**CORS error in browser**
- Make sure `FRONTEND_URL=http://localhost:5173` is set in your root `.env`
- Restart the backend (`npm start`)

**"Cannot find module" errors**
- Run `npm install` in the root folder AND in the `client/` folder

---

## Next: Make it live on the internet

Once everything works locally, see **DEPLOYMENT_GUIDE.md** to put it online for free using:
- **Render** — for the backend API
- **Vercel** — for the frontend website

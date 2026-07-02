# CPTE Exam Prep — Setup Guide

This guide walks you through setting up the CPTE PT Exam LMS app from scratch, even if you're new to web development.

---

## Step 1: Install Required Software

### Node.js (v18 or later)
1. Go to https://nodejs.org
2. Download the **LTS** version (recommended)
3. Run the installer (accept all defaults)
4. Verify: open a terminal and run `node --version` — you should see v18.x or higher

### VS Code (recommended editor)
1. Go to https://code.visualstudio.com
2. Download and install for your operating system

---

## Step 2: Open the Project

1. Open VS Code
2. Go to **File → Open Folder**
3. Select the `/home/user/CPTE` folder (or wherever you placed the project)
4. Open the integrated terminal: **View → Terminal** (or Ctrl+`)

---

## Step 3: Create a Supabase Project

1. Go to https://supabase.com and sign up for a free account
2. Click **New Project**
3. Choose a name (e.g., "cpte-lms"), set a strong database password, and select a region
4. Wait 1-2 minutes for the project to provision

### Find Your Keys
1. In the Supabase dashboard, go to **Settings → API**
2. Copy the following values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public key** — starts with `eyJ...`
   - **service_role key** — starts with `eyJ...` (keep this SECRET)

---

## Step 4: Configure Environment Variables

### Backend (.env)
In the project root (`/home/user/CPTE/`), create a file named `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### Frontend (client/.env)
In the `client/` folder, create a file named `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
VITE_API_URL=http://localhost:3001
```

> **Security note:** Never commit `.env` files to git. The `.gitignore` already excludes them.

---

## Step 5: Install Dependencies

Open the terminal in VS Code and run:

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

---

## Step 6: Run the SQL Files in Supabase

1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open `db/001_init_schema.sql` from your project in VS Code
4. Copy the entire contents and paste into the Supabase SQL editor
5. Click **Run** (green button)
6. You should see "Success. No rows returned."
7. Repeat for `db/002_users_rls.sql` — copy, paste, and run

> Run 001 FIRST, then 002. The order matters!

---

## Step 7: Seed the Database with Questions

In your terminal (from the project root):

```bash
npm run seed
```

You should see output like:
```
Seeding 100 questions into the database...
Successfully inserted 100 questions!

Question counts by domain:
  Musculoskeletal: 30
  Neuromuscular: 20
  Cardiopulmonary: 15
  Integumentary: 10
  Other Systems: 15
  Non-Systems: 10
```

---

## Step 8: Start the Application

You need two terminal windows running simultaneously.

### Terminal 1 — Backend Server
```bash
# From the project root (/home/user/CPTE)
npm start
```
You should see: `CPTE API server running on port 3001`

For development with auto-reload:
```bash
npm run dev
```

### Terminal 2 — Frontend
```bash
# Open a new terminal in VS Code (click the + icon in the terminal panel)
cd client
npm run dev
```
You should see: `Local: http://localhost:5173`

---

## Step 9: Open the App and Test

1. Open your browser and go to **http://localhost:5173**
2. You should see the CPTE Exam Prep login screen

### Test Sign-Up
1. Click "Sign Up" (or toggle to sign-up mode)
2. Enter an email and password (at least 6 characters)
3. Click "Create Account"
4. Check your email for a confirmation link (check spam folder)
5. Click the confirmation link

### Test Sign-In
1. Return to http://localhost:5173
2. Enter your email and password
3. Click "Sign In"
4. You should be redirected to the home screen

### Test an Exam
1. Click "Start Practice" to begin a practice exam
2. Answer some questions — you'll see immediate feedback
3. Click "Submit Exam" when done
4. Review your results on the Results screen

---

## Troubleshooting

### "Cannot connect to Supabase"
- Double-check your `.env` files for typos in the URL or keys
- Make sure you used the correct keys (anon key for frontend, service_role key for backend)

### "User profile not found" error
- This means the database trigger (from 002_users_rls.sql) didn't create your user profile
- In Supabase SQL Editor, run: `SELECT * FROM public.users;`
- If empty, manually insert: `INSERT INTO public.users (id, email) SELECT id, email FROM auth.users;`

### "No templates found" when starting exam
- The template is inserted by 001_init_schema.sql — run it again if you reset the database
- Check: `SELECT * FROM public.exam_templates;` should return 1 row

### "Seed failed: duplicate key"
- The questions already exist. Run `DELETE FROM public.questions;` in SQL Editor, then `npm run seed` again

### Backend not starting
- Make sure your `.env` file exists in the project root (not inside `/server`)
- Run `npm install` if you see "Cannot find module" errors

### CORS error in browser
- Make sure the backend is running on port 3001
- Make sure `FRONTEND_URL=http://localhost:5173` is in your backend `.env`

### Email confirmation not arriving
- Check your spam folder
- In Supabase: **Authentication → Settings → Email** — you can disable email confirmation for development

---

## Production Deployment Notes

For production, consider:
1. Using **Vercel** or **Netlify** for the frontend (`cd client && npm run build`)
2. Using **Railway**, **Render**, or **Fly.io** for the backend
3. Setting `FRONTEND_URL` to your production domain in backend environment variables
4. Enabling Supabase Row Level Security (already configured in the SQL files)
5. Using proper secret management (not `.env` files) for production credentials

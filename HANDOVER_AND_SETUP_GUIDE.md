# Luke Smith — Personal Diary & Work Planner
## Handover, Deployment & Administration Guide

Welcome to your private **Personal Diary & Work Planner**! This web application is built on top of your existing brand design system using React 18, TypeScript, Tailwind CSS, Vite, Supabase, and Web Audio / PWA APIs.

It is designed to be **100% turnkey, private, and modular**, allowing you to manage your daily focus, record audio thoughts with automated transcripts, parse tasks with AI, and expand features in stages without vendor lock-in.

---

## 📋 What is Included in Your Codebase

1. **Today Dashboard**: Top priorities, tasks due today, upcoming appointments, overdue alerts with carried-forward tags, and real-time completion meters.
2. **Diary & Quick Capture**: Written notes, real browser microphone audio recording, live audio playback with waveforms, automated speech-to-text transcripts, and link/photo attachments.
3. **AI Task Extractor (Claude / GPT-4o mini)**: Turns unstructured notes or voice transcripts (e.g. *"Follow up with the editor on Friday and prepare three questions for the production meeting"*) into discrete, editable tasks with due dates and projects before saving.
4. **Tasks & Projects Manager**: Project initiatives, milestone tracking, priorities (Urgent, High, Medium, Low), and deadline schedules.
5. **In-App Calendar & Agenda**: Monthly and weekly agenda views with integrated notifications.
6. **Two Dashboard Mockups**: Instant toggle between **Mockup 1 (Clean Minimalist)** and **Mockup 2 (Visual Glassmorphism)** with a wallpaper customizer and opacity/blur sliders.
7. **PWA Mobile App Support**: Progressive Web App manifest (`manifest.json`) and service worker (`sw.js`) allowing installation on iPhone and Android with closed-app notification support.
8. **Data Portability & Backup**: 1-click JSON and CSV export of all tasks, diary notes, and settings.
9. **Row-Level Security (RLS) Database**: Full PostgreSQL schema (`supabase_planner_schema.sql`) ensuring your personal diary remains 100% private even if team accounts are added in the future.

---

## 🚀 3-Minute Quick Start (Local Run)

```bash
# 1. Open the project directory
cd luke-smith-website

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser. The app defaults straight to your **Personal Planner**, and you can toggle back to your **Public Website** anytime from the top left button.

---

## 🗄️ Setting Up Your Supabase Cloud Database

The app automatically saves your data to local storage so you can use it immediately without configuration. When you are ready to connect your live Supabase cloud database:

1. **Create a Free Account**: Go to [supabase.com](https://supabase.com) and create a free project.
2. **Run the Database Schema**:
   * Open the **SQL Editor** tab in your Supabase dashboard.
   * Copy the entire contents of [`supabase_planner_schema.sql`](./supabase_planner_schema.sql) and paste it into the SQL Editor.
   * Click **Run**. All tables (`planner_tasks`, `diary_entries`, `planner_projects`, `calendar_events`, `user_preferences`) and Row-Level Security policies will be created instantly.
3. **Get Your API Keys**:
   * In Supabase, go to **Project Settings → API**.
   * Copy your **Project URL** and **`anon` public key**.
4. **Create a `.env` file** in `luke-smith-website`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Rebuild or restart the dev server (`npm run dev`). Your app will now securely sync with your cloud database in real time!

---

## 🌐 1-Click Free Cloud Deployment (Vercel or Netlify)

You can host the app for **$0 / month** on Vercel or Netlify:

### Deploying on Vercel:
1. Push your repository to your GitHub account (or invite your developer to push it).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and select the `luke-smith-website` root directory.
4. Framework preset: **Vite**.
5. Under **Environment Variables**, add:
   * `VITE_SUPABASE_URL` = *(Your Supabase URL)*
   * `VITE_SUPABASE_ANON_KEY` = *(Your Supabase Anon Key)*
6. Click **Deploy**. Your app will be live on an SSL HTTPS domain (e.g. `luke-planner.vercel.app`) in under 60 seconds!

---

## 📱 Installing on Your Phone (iPhone & Android)

The web app is a Progressive Web App (PWA). You can install it directly onto your phone's home screen without downloading from the App Store:

### On iPhone (Safari):
1. Open your live deployment URL in **Safari**.
2. Tap the **Share** button (box with an upward arrow at the bottom of the screen).
3. Scroll down and tap **"Add to Home Screen"**.
4. Name it **"Luke Planner"** and tap **Add**.
5. It will now appear as an independent native app icon on your phone!

### On Android (Chrome):
1. Open your deployment URL in **Chrome**.
2. Tap the **three dots menu (⋮)** in the top right.
3. Tap **"Install app"** or **"Add to Home screen"**.

---

## 🔔 Closed-Phone Notifications & Reminders

Luke, here is how reminders reach your phone even when the app is closed:
1. **PWA Web Push**: When you add the app to your Home Screen on iOS (iOS 16.4+) or Android, the registered Service Worker (`/sw.js`) can receive background push triggers with native lock-screen banners and sounds.
2. **Database Triggers**: Supabase Edge Functions / Cron can be scheduled to fire reminder events 15 minutes before appointments.
3. **Optional External Sync**: If you later decide to activate 2-way Google Calendar / Microsoft Outlook sync, appointments sync directly into your native iPhone/Android Calendar app.

---

## 💸 Breakdown of Ongoing Operational Costs

| Service | Provider | Monthly Cost | Notes |
| :--- | :--- | :---: | :--- |
| **Web Hosting** | Vercel / Netlify | **$0 / mo** | Free tier easily supports personal and high-traffic use. |
| **Database & Storage** | Supabase | **$0 / mo** | Free tier includes 500MB database + 1GB storage for audio/photos. |
| **Push Notifications** | Web Push API | **$0 / mo** | Standard browser push protocol has zero monthly fees. |
| **AI Task Extraction** | OpenAI / Claude API | **~$1 to $3 / mo** | Pay-as-you-go. ~$0.001 per extraction (~1,000 tasks cost ~$1). |
| **Total Ongoing Costs** | — | **~$1 to $3 / mo** | Practically free to run. |

---

## 🛠️ Adding Features & Expanding in Stages

Your application is architected modularly:
* **Rearranging Sections**: Change widget order in the user preferences state without touching database structures or writing custom backend code.
* **Adding Team Members**: All personal diary tables enforce `auth.uid() = user_id`. If you add a team workspace or assistant account in Stage 2, your personal diary entries remain cryptographically inaccessible to any other user.
* **Exporting Data**: Click the **Download (Export)** button in the top navigation bar to download your entire vault in JSON or CSV format anytime.

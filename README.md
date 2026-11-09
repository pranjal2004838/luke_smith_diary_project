# Luke Smith — Personal Diary & Work Planner

A private, personalized web application and personal brand portal for **Luke Smith** (Author, Keynote Speaker & Founder), built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**.

Designed as a Progressive Web App (PWA) with Supabase Row-Level Security (RLS) data privacy, speech-to-text voice recording, AI task generation, and dual dashboard themes (Clean Minimalist vs. Visual Glassmorphism).

---

## 🌟 Key Features

1. **Dual Dashboard Mockups**:
   - **Mockup 1 (Clean Minimalist)**: Distraction-free, high-contrast focus layout.
   - **Mockup 2 (Visual Glassmorphism)**: Atmospheric backdrop with frosted cards, custom wallpaper uploader, and blur/opacity controls.
2. **Today Dashboard**:
   - Top daily priorities.
   - Tasks due today and upcoming appointments.
   - **Overdue Alert with Carried-Forward Tags** and live progress meters.
3. **Diary & Quick Voice Capture**:
   - Written notes and thoughts with instant full-text search.
   - **Real microphone audio recording** (Web Audio API) with waveform playback.
   - Automated speech-to-text transcription.
   - Link and photo attachments.
4. **AI Smart Task Extractor (Claude / GPT-4o mini)**:
   - Converts unstructured notes or voice transcripts into discrete, editable tasks with inferred due dates, projects, and priorities before saving.
5. **Tasks & Projects Manager**:
   - Group tasks by project initiative (Book Launch, Keynote Tour, Real Direction, Personal).
   - Milestone tracking and priority levels (Urgent, High, Medium, Low).
6. **In-App Calendar & Agenda**:
   - Day, Week, and Month views showing appointments and deadlines.
   - Progressive Web App (PWA) push notification architecture for closed-phone alerts.
7. **100% Privacy Architecture**:
   - Complete PostgreSQL schema with **Row-Level Security (RLS)** in `supabase_planner_schema.sql`. Personal diary data is cryptographically isolated to `auth.uid() = user_id`.
8. **Data Independence & Backup**:
   - 1-click JSON and CSV export of all tasks, diary notes, and settings.
9. **Integrated Public Brand Website**:
   - Seamless 1-click toggle back to Luke's public books, cue cards, awards, and media showcase.

---

## 🚀 Quick Start (Local Run)

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173`.

---

## 🌐 Deploy to Vercel (100% Free)

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite** (auto-detected).
3. Click **Deploy**.
4. (Optional) In **Settings → Environment Variables**, add your Supabase credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

---

## 📄 Documentation & Guides

- **Handover & Administration**: See [`HANDOVER_AND_SETUP_GUIDE.md`](./HANDOVER_AND_SETUP_GUIDE.md)
- **Database Schema**: See [`supabase_planner_schema.sql`](./supabase_planner_schema.sql)
- **Lovable Master Specification**: See [`LOVABLE_MASTER_PROMPT.md`](./LOVABLE_MASTER_PROMPT.md)

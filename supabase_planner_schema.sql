-- ==============================================================================
-- PERSONAL DIARY & WORK PLANNER — SUPABASE DATABASE SCHEMA
-- Client: Luke Smith | Project: Private Diary & Work Planner Web App
-- Architecture: Multi-tenant safe, Strict Row-Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. USER PREFERENCES & DASHBOARD PERSONALISATION
-- Stores theme choice (Clean vs Background), custom wallpaper URL, blur, and modular widget arrangement
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    mockup_mode TEXT NOT NULL DEFAULT 'background' CHECK (mockup_mode IN ('clean', 'background')),
    background_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=80',
    background_blur TEXT DEFAULT 'md' CHECK (background_blur IN ('none', 'sm', 'md', 'lg', 'xl')),
    card_opacity INT DEFAULT 85 CHECK (card_opacity BETWEEN 30 AND 100),
    accent_color TEXT DEFAULT '#f0a500',
    widget_layout JSONB DEFAULT '["today_overview", "priorities", "diary_capture", "calendar_agenda", "projects_milestones"]'::jsonb,
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. PROJECTS & MILESTONES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.planner_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#f0a500',
    current_milestone TEXT,
    deadline DATE,
    is_archived BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TASKS TABLE (Carried forward, overdue logic, and priorities)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.planner_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.planner_projects(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
    due_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_time TIME WITHOUT TIME ZONE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    is_carried_forward BOOLEAN DEFAULT FALSE,
    notes TEXT,
    reminder_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. DIARY & QUICK CAPTURE TABLE (Audio, Transcription, Images & Links)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.diary_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Quick Note',
    content TEXT NOT NULL,
    entry_type TEXT NOT NULL DEFAULT 'note' CHECK (entry_type IN ('note', 'voice', 'idea', 'reflection')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    audio_url TEXT, -- Storage bucket URL for raw .mp3/.webm audio recording
    audio_duration TEXT, -- e.g. "0:48"
    transcript TEXT, -- Searchable speech-to-text transcript
    attachments JSONB DEFAULT '[]'::jsonb, -- Array of {type: 'image' | 'link', url: string, label: string}
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. IN-APP CALENDAR & APPOINTMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    location TEXT,
    event_type TEXT DEFAULT 'meeting' CHECK (event_type IN ('keynote', 'meeting', 'recording', 'personal', 'deadline')),
    client_or_host TEXT,
    reminder_minutes_before INT DEFAULT 15,
    google_calendar_event_id TEXT, -- For optional 2-way sync
    outlook_event_id TEXT, -- For optional 2-way sync
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. AI EXTRACTION AUDIT LOGS (Zero-leakage tracking)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ai_task_extractions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL CHECK (source_type IN ('typed_note', 'voice_transcript')),
    source_text_snippet TEXT NOT NULL,
    model_provider TEXT DEFAULT 'claude-3-5-sonnet',
    tasks_generated_count INT DEFAULT 0,
    tasks_approved_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — ABSOLUTE USER PRIVACY GUARANTEE
-- Personal diary & planner data is isolated at the database engine level.
-- Even if team accounts or shared project features are enabled later,
-- ONLY the authenticated owner (auth.uid()) can read/write their personal diary!
-- ==============================================================================

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planner_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_task_extractions ENABLE ROW LEVEL SECURITY;

-- 1. user_preferences RLS
CREATE POLICY "Users can manage own preferences"
ON public.user_preferences FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. planner_projects RLS
CREATE POLICY "Users can manage own projects"
ON public.planner_projects FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. planner_tasks RLS
CREATE POLICY "Users can manage own tasks"
ON public.planner_tasks FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. diary_entries RLS
CREATE POLICY "Users can strictly manage own diary entries"
ON public.diary_entries FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. calendar_events RLS
CREATE POLICY "Users can manage own calendar events"
ON public.calendar_events FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 6. ai_task_extractions RLS
CREATE POLICY "Users can manage own ai logs"
ON public.ai_task_extractions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- INDEXES FOR INSTANT MOBILE & LAPTOP QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_due ON public.planner_tasks(user_id, due_date, completed);
CREATE INDEX IF NOT EXISTS idx_diary_user_search ON public.diary_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calendar_user_date ON public.calendar_events(user_id, event_date);

# 🎯 Full-Stack Smart Habit Tracker

A modern, responsive full-stack habit tracking application built to demonstrate performance-optimized state synchronization, relational database integrity, and robust server management.

## 🚀 Live Demo
👉 **[View the Live Application Here](https://habit-tracker-nine-ruby.vercel.app/)**

## 🛠️ Tech Stack & Architecture

- **Frontend Framework:** Next.js 16 (React) with Turbopack compilation.
- **Styling UI:** Tailwind CSS for a scalable, responsive utility-first layout.
- **Database Backend:** Supabase (PostgreSQL) handling persistent relational tables.
- **Hosting Pipeline:** Automated CI/CD deployment via Vercel integration.

## ✨ Core Features Engineered

- **Optimized Optimistic UI Rendering:** Implemented immediate local state updates (`setHabits`) to keep user interactions running smoothly at 0ms latency while data-sync tasks handle database writes asynchronously in the background.
- **Comprehensive CRUD Operations:** Complete system workflow architecture supporting dynamic entry generation, local state mutation toggles, and multi-layer identifier row deletions (`.delete().or(...)`).
- **Relational Schema Integration:** Structured a resilient dual-table setup linking habit records with activity logging targets leveraging strict field constraints.

## 💾 Database Architecture (PostgreSQL Schema)

```sql
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE completion_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_date DATE DEFAULT CURRENT_DATE NOT NULL,
  CONSTRAINT unique_habit_date_key UNIQUE (habit_id, completed_date)
);
```

## 🧑‍💻 Key Architectural Solutions Solved

- **The Challenge (UI State Gaps):** Network latency during heavy insert roundtrips caused layout flickering.
- **The Solution:** Restructured handlers to generate client-side temporary identities, applying mutations locally before firing secure background background threads.
- **The Challenge (Data Schema Incompatibilities):** Strict relational table restrictions blocked data saves prior to custom authorization integrations.
- **The Solution:** Adjusted table column properties via customized SQL patches to drop unauthenticated constraints (`ALTER COLUMN user_id DROP NOT NULL`), opening a completely smooth route for testing workflows.

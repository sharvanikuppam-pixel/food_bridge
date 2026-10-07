# FoodBridge AI 🍲🤖

> **“Turning surplus food into community support.”**
>
> *Build-to-Ship Hackathon Submission — FN5 Food Donation Coordination Platform*

---

## 🌟 Overview

**FoodBridge AI** is an intelligent, location-aware surplus food coordination platform that bridges the gap between food donors (restaurants, canteens, hotels, event caterers) and community organizations / NGOs (shelters, food banks, community kitchens).

Unlike basic CRUD list apps, FoodBridge AI features a **Deterministic Smart Matching Engine** that mathematically scores and ranks recipient organizations, paired with **Server-Side Gemini 2.5 AI Intelligence** for natural language donation assistance, match explanations, and impact storytelling.

---

## ✨ Key Features & Architecture

### 1. 🧮 Deterministic Smart Matching Engine (Section 5)
Calculates a weighted match percentage (0–100%) from 5 criteria:
- **Distance (25%)**: Spherical Haversine distance formula between donor & recipient.
- **Urgency (25%)**: Remaining time window before safety expiration.
- **NGO Capacity (20%)**: Shelter dining/storage capacity vs meal quantity.
- **Service Area (15%)**: Designated community operational bounds.
- **Food Compatibility (15%)**: Dietary preferences (Vegetarian, Non-Vegetarian, Vegan).

### 2. ⏳ Real-Time Urgency Engine (Section 6)
Dynamically calculates urgency levels with live countdown timers:
- **LOW**: &gt; 6 hours remaining (Flexible pickup window)
- **MEDIUM**: 2–6 hours remaining (Standard dispatch window)
- **HIGH**: 30 mins–2 hours remaining (Urgent pickup recommended)
- **CRITICAL**: &lt; 30 minutes remaining (Immediate pickup required)
- **EXPIRED**: Past safety deadline (Safely delisted)

### 3. 🔄 7-Stage Donation Lifecycle (Section 7)
Visual progress timeline tracking handoff stages:
`CREATED` ➔ `MATCHING` ➔ `CLAIMED` ➔ `PICKUP_ASSIGNED` ➔ `PICKUP_IN_PROGRESS` ➔ `DELIVERED` ➔ `COMPLETED`

### 4. 🤖 Server-Side Gemini AI Features (Section 11, 12, 13, 14, 25)
- **AI Donation Assistant**: Parses freeform natural language (e.g. *"I have 40 biryani packets from a wedding event needing collection in 2 hours"*) into structured listing fields.
- **AI Description Generator**: Crafts polished, professional donation descriptions.
- **AI Match Explanation**: Provides human-friendly explanations answering *"Why this match?"*.
- **AI Impact Story Generator**: Generates inspiring thank-you stories after delivery.
- *Graceful Fallbacks*: Robust server-side fallbacks ensure zero downtime even without an API key.

### 5. 🗺️ Proximity & Interactive Map System (Section 15)
Integrates OpenStreetMap / Leaflet to visualize active donation locations, nearby verified NGO shelters, radius zones, and travel distances.

### 6. 📊 Impact Dashboard & Recharts Analytics (Section 16)
Visual graphs tracking:
- Total meals rescued
- Diverted organic waste (kg)
- People reached
- Category breakdown pie chart & monthly trend line chart

---

## 🎭 Main User Roles

1. **Food Donor (e.g. Priya - Green Leaf Restaurant)**:
   - Create surplus food listings via 4-Step Form
   - Use AI Assistant & AI Description Generator
   - View ranked NGO matches & AI explanations
   - Track live delivery timeline & impact analytics

2. **NGO / Community Partner (e.g. Father Joseph - Hope Community Kitchen)**:
   - Filter nearby donations by distance, dietary preference & urgency
   - View match percentages & claim food donations
   - Manage pickup status (Assigned ➔ In Progress ➔ Delivered ➔ Completed)

3. **Platform Admin**:
   - Audit platform statistics & system telemetry
   - Manage verified NGO registry & monitor active pickups
   - Inspect live activity & audit logs

> 💡 **Hackathon Demo Persona Switcher**: Click the **Role Switcher** in the top navigation bar to toggle between Donor, NGO, and Admin instantly!

---

## 🛠️ Stack & Technology

- **Frontend**: React 19, Vite 6, Tailwind CSS, Lucide Icons, Recharts, Leaflet / OpenStreetMap.
- **Backend API**: Node.js, Express, TypeScript (CommonJS target), REST Endpoints.
- **Database / Auth**: Supabase PostgreSQL Schema with Row Level Security (RLS) policies.
- **AI Model**: Server-side Google Gemini 2.5 (`@google/genai`).

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/foodbridge-ai.git
cd foodbridge-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key_here
DATABASE_URL=postgresql://postgres:password@db.your-supabase.supabase.co:5432/postgres
PORT=3001
```

### 3. Run Development Server
Start backend Express server & Vite client concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend Express API**: `http://localhost:3001`
- **API Health Check**: `http://localhost:3001/api/health`

### 4. Build for Production
```bash
npm run build
```

---

## 🎬 3-Minute Hackathon Demo Script (Section 34)

1. **Step 1 — Login as Donor**: Open `http://localhost:5173`. Click top role switcher ➔ select **Food Donor (Priya)**.
2. **Step 2 — Create Donation**: Click **+ Create Food Donation**. Fill out 4-step form or click **Describe with AI Assistant** and enter *"50 vegetarian paneer curry meal boxes ready at MG Road, expiry in 1.5 hours"*.
3. **Step 3 — Run Smart Match**: Click **Publish Donation & Run Smart Match**.
4. **Step 4 — View Ranked Matches**: See **#1 Hope Community Kitchen (94% Match, 2.4 km)**.
5. **Step 5 — AI Match Explanation**: Click **"Why this match?"** to view Gemini AI explanation popup.
6. **Step 6 — Switch to NGO**: Click role switcher ➔ select **NGO Partner (Hope)**.
7. **Step 7 — Claim Donation**: Locate the donation in high-priority feed ➔ click **Claim Donation for NGO**.
8. **Step 8 — Update Lifecycle**: Move claim to **Active Pickups** tab ➔ update status through **Assigned ➔ In Progress ➔ Delivered ➔ Completed**.
9. **Step 9 — View Impact Dashboard**: Switch back to Donor or visit `/donor/impact` ➔ click **Generate AI Impact Story**.

---

## 🔐 Database Schema (Supabase)

Execute `supabase/schema.sql` in your Supabase SQL Editor:
- Tables: `profiles`, `ngos`, `donations`, `claims`, `pickup_events`, `notifications`, `activity_logs`, `impact_metrics`.
- RLS Policies enabled for secure profile access and data isolation.

---

## 📜 License
MIT License. Built for BUILD-TO-SHIP Hackathon.

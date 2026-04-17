# Software Engineering Lab — Mini Project (Experiment 6)

**Project Title:** Engineering Career OS
**Subject:** Software Engineering Lab
**Experiment No:** 6

---

## 1. Mini Project Title & Problem Statement

**Title:** Engineering Career OS — A Unified Career Development Platform for Engineering Students

### Problem Definition

Engineering students in India face a deeply fragmented career preparation ecosystem. To prepare for placements and build a tech career, a student must simultaneously manage:
- YouTube for learning (no structure, no tracking)
- LinkedIn for networking
- Unstop / Hack2Skill for hackathon discovery
- Canva or Word for resume building
- ChatGPT or random forums for career guidance

There is no single platform that unifies all these tools into one cohesive, structured experience.

### Real-World Relevance

India produces over 1.5 million engineering graduates annually. The majority struggle with:
- No structured learning path
- Poor resume quality leading to ATS rejections
- Missing hackathon opportunities due to lack of awareness
- No personalized AI guidance for career decisions

This platform directly solves all four problems in one place.

---

## 2. Abstract

### Problem
Engineering students lack a unified platform that combines structured learning, career tools, hackathon discovery, and AI-powered guidance. The fragmented ecosystem wastes time and creates inconsistent outcomes.

### Proposed Solution
Engineering Career OS is a full-stack web application that integrates:
- Curated engineering courses sourced from YouTube playlists via API
- An AI-powered career assistant powered by Groq LLM (llama3)
- An ATS-optimized resume builder with live split-pane preview
- A hackathon discovery hub with 20+ real India hackathons, search/filter, and embedded Unstop & Hack2Skill feeds
- Personalized learning roadmaps for different engineering specializations
- A progress-tracking dashboard with enrollment management

### Technology Used
Next.js 16, TypeScript, Tailwind CSS, Supabase (PostgreSQL), Clerk Authentication, Groq AI SDK, shadcn/ui, Radix UI, Lucide Icons

### Application / Impact
Students can go from zero to job-ready using a single platform — learning, building their resume, competing in hackathons, and getting AI guidance — without switching tools. Targets India's 8M+ engineering students.

---

## 3. Objectives (Max 4)

1. **Build a centralized learning hub** — Aggregate 300+ engineering courses with category/level filtering and search, backed by a real Supabase PostgreSQL database with pagination.

2. **Enable AI-assisted career guidance** — Integrate a Groq-powered AI assistant that answers career, coding, and learning questions in real time with streaming responses.

3. **Simplify hackathon discovery** — Provide 20+ real India hackathons (SIH, HackWithInfy, Flipkart Grid, ETHIndia, etc.) with search, domain filter, status filter, and the ability for users to add their own hackathons.

4. **Provide a professional resume builder** — Allow students to create, preview in real time, and export ATS-optimized resumes directly within the platform without any external tool.

---

## 4. Stakeholders / Users / Investors

| Stakeholder | Role | How They Benefit |
|---|---|---|
| Engineering Students (B.Tech/B.E.) | Primary Users | Access to courses, resume builder, hackathons, AI assistant, roadmaps |
| Recent Graduates / Job Seekers | Secondary Users | Career roadmaps, mock interview prep, skill tracking |
| YouTube Educators / Instructors | Content Providers | Exposure through platform course listings |
| Recruiters & Companies | Talent Consumers | Access to a pool of skilled, portfolio-ready candidates |
| Hackathon Platforms (Unstop, Hack2Skill) | Partners | Increased traffic and registrations via embedded feeds |
| EdTech Investors / VCs | Investors | Scalable SaaS model targeting India's massive engineering student market |
| Platform Admins | Operators | Manage course catalog, user data, and platform health |

---

## 5. Team Members & Roles

| Name | Role | Responsibilities |
|---|---|---|
| Sreejith Nair | Team Lead & Full Stack Developer | System architecture, Next.js pages, Supabase integration, deployment |
| Member 2 | Frontend Developer | UI components, Tailwind CSS styling, responsive design, animations |
| Member 3 | Backend Developer | API routes, Supabase schema design, Clerk auth integration, seed data |
| Member 4 | QA Tester | Test case design, manual testing, bug reporting, regression testing |
| Member 5 | UI/UX Designer | Wireframes, design system, component library, user flow diagrams |
| Member 6 | Scrum Master | Sprint planning, Jira board management, daily stand-ups, retrospectives |

---

## 6. System Overview / Proposed Solution

The system follows a **client-server architecture** built on Next.js App Router with server-side rendering for performance and SEO.

### High-Level Flow

```
User visits platform (/)
        ↓
Clerk Authentication — Sign In / Sign Up
        ↓
Dashboard (/dashboard)
  → Enrolled courses with progress
  → Quick navigation to all modules
        ↓
┌─────────────────────────────────────────────────┐
│  /courses     → Browse & enroll in courses      │
│  /ai-assistant → Chat with Groq AI              │
│  /hackathons  → Discover & register hackathons  │
│  /resume-builder → Build & export resume        │
│  /roadmaps    → View career learning paths      │
│  /my-courses  → Track enrolled course progress  │
└─────────────────────────────────────────────────┘
        ↓
Supabase DB — stores courses, enrollments, progress
        ↓
Groq AI API — streams AI assistant responses
        ↓
YouTube API — populates course catalog (admin)
```

All protected routes are guarded by Clerk middleware. Course data is fetched server-side for fast initial load. The AI assistant streams token-by-token responses for a real-time feel.

---

## 7. System Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                        │
│   Next.js 16 App Router  |  React 19  |  TypeScript      │
│   Tailwind CSS  |  shadcn/ui  |  Radix UI Components     │
│   React Hooks (useState, useMemo) for local state        │
└───────────────────────────┬──────────────────────────────┘
                            │  HTTP Requests / Server Actions
┌───────────────────────────▼──────────────────────────────┐
│                      SERVER LAYER                        │
│   Next.js API Routes:                                    │
│     /api/chat              → Groq AI streaming           │
│     /api/populate-courses  → YouTube → Supabase sync     │
│   Server Components (SSR) → courses, dashboard pages     │
│   Clerk Middleware → guards /dashboard, /courses, etc.   │
└──────────────┬────────────────────────┬──────────────────┘
               │                        │
┌──────────────▼──────────┐  ┌──────────▼──────────────────┐
│     SUPABASE (DB)       │  │      EXTERNAL SERVICES       │
│  PostgreSQL Tables:     │  │  Groq AI  — LLM completions  │
│  - courses              │  │  YouTube  — playlist data    │
│  - enrollments          │  │  Clerk    — auth & JWT       │
│  - progress             │  │  Unstop   — iframe embed     │
│  Row Level Security ON  │  │  Hack2Skill — iframe embed   │
└─────────────────────────┘  └──────────────────────────────┘
```

**Layer Explanations:**
- **Client Layer** — React components rendered in the browser. Uses React hooks for local state (filters, modals), server components for data-heavy pages (courses, dashboard).
- **Server Layer** — Next.js handles SSR, API routes, and middleware. Clerk middleware protects all authenticated routes via JWT verification.
- **Data Layer** — Supabase (PostgreSQL) stores all persistent data. Accessed via `@supabase/ssr` server-side and `@supabase/supabase-js` client-side. RLS policies ensure users only access their own data.
- **External APIs** — Groq for AI streaming, YouTube Data API v3 for course population, Clerk for identity management.

---

## 8. Technology Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| **Frontend Framework** | Next.js | 16.1.6 — App Router, Turbopack |
| **UI Library** | React | 19.2.3 |
| **Language** | TypeScript | 5.7.3 — strict mode |
| **Styling** | Tailwind CSS | 3.4.17 — utility-first |
| **Component Library** | shadcn/ui + Radix UI | Accessible primitives |
| **Icons** | Lucide React | 0.544.0 |
| **Backend** | Next.js API Routes | Server-side logic & streaming |
| **AI** | Groq SDK | 0.37.0 — llama3-8b-8192 |
| **Database** | Supabase (PostgreSQL) | 2.95.3 — with RLS |
| **Authentication** | Clerk | 6.37.4 — JWT + OAuth |
| **Forms** | React Hook Form + Zod | Type-safe validation |
| **Charts** | Recharts | 2.15.0 |
| **Package Manager** | pnpm | 10.x |
| **IDE** | VS Code / Kiro IDE | — |
| **Version Control** | Git + GitHub | github.com/Sreejith-nair511/SE_MINIPROJECT |
| **Task Tracking** | Jira | Agile sprint management |
| **Deployment** | Vercel | Production + preview deployments |

---

## 9. Requirements

### Functional Requirements

| ID | Feature | Description |
|---|---|---|
| FR-01 | User Authentication | Sign up, sign in, sign out via Clerk (email + Google OAuth) |
| FR-02 | Course Catalog | Browse 300+ courses with search, category and level filters |
| FR-03 | Course Enrollment | Enroll in courses, track progress per course |
| FR-04 | AI Assistant | Real-time streaming chat with Groq LLM for career guidance |
| FR-05 | Resume Builder | Create resume with live preview, sections for experience/education/skills |
| FR-06 | Hackathon Discovery | 20+ real hackathons with search, domain/status/platform filters |
| FR-07 | Add Hackathon | Users can submit new hackathons via a modal form |
| FR-08 | Platform Embeds | Embedded Unstop and Hack2Skill live feeds via iframe |
| FR-09 | Learning Roadmaps | Structured roadmaps for Frontend, Backend, DevOps, ML, etc. |
| FR-10 | Dashboard | Personalized view of enrolled courses, progress, and activity |
| FR-11 | Pagination | Server-side pagination on course listings (12 per page) |
| FR-12 | Course Population | Admin API to sync YouTube playlists into the course database |

### Non-Functional Requirements

**Performance**
- Server-rendered pages load under 2 seconds
- Turbopack dev server with HMR under 500ms
- Supabase queries optimized with indexes on `category`, `level`, `created_at`
- `useMemo` used for expensive filter computations on the hackathons page

**Security**
- All protected routes guarded by Clerk middleware (JWT verification)
- Supabase Row Level Security (RLS) enabled on all tables
- Service role key never exposed to client — server-only usage
- `NEXT_PUBLIC_` prefix only for safe-to-expose environment variables
- `.env.local` excluded from version control via `.gitignore`

**Usability**
- Fully responsive — mobile, tablet, desktop
- Dark-first design with consistent color system
- Accessible components via Radix UI primitives (keyboard nav, ARIA)
- Clear empty states, loading indicators, and error messages

---

## 10. Use Case Modeling

### Use Cases (Text)

**UC-01: Student Enrolls in a Course**
- Actor: Authenticated Student
- Precondition: Student is signed in
- Flow: Student browses `/courses` → applies filters (category, level, search) → clicks course card → clicks "Enroll" → enrollment saved to Supabase `enrollments` table → course appears in `/my-courses` with 0% progress
- Postcondition: Course visible in dashboard with progress tracking enabled

**UC-02: Student Uses AI Assistant**
- Actor: Authenticated Student
- Precondition: Student is signed in, Groq API key configured
- Flow: Student navigates to `/ai-assistant` → types a career or coding question → message sent to `/api/chat` → Groq streams response token by token → response rendered with markdown formatting (code blocks, lists)
- Postcondition: Conversation history maintained in session

**UC-03: Student Discovers and Registers for a Hackathon**
- Actor: Any User (authenticated or guest)
- Precondition: None required
- Flow: User navigates to `/hackathons` → searches by keyword or filters by domain/platform/status → views hackathon card with prize, date, team size, tags → clicks "Register" → redirected to external platform (Unstop/Hack2Skill/Devfolio) → OR switches to Unstop/Hack2Skill tab to browse live embedded feed
- Postcondition: User registers on the external platform

### Use Case Diagram

```
                   ┌──────────────────────────────────────┐
                   │        Engineering Career OS          │
                   │                                      │
 ┌──────────┐      │  ┌──────────────────────────────┐   │
 │          │─────▶│  │  Browse & Enroll in Courses   │   │
 │          │      │  └──────────────────────────────┘   │
 │          │─────▶│  ┌──────────────────────────────┐   │
 │ Student  │      │  │  Use AI Career Assistant      │   │
 │  (Auth)  │─────▶│  └──────────────────────────────┘   │
 │          │      │  ┌──────────────────────────────┐   │
 │          │─────▶│  │  Build & Export Resume        │   │
 │          │      │  └──────────────────────────────┘   │
 │          │─────▶│  ┌──────────────────────────────┐   │
 └──────────┘      │  │  Track Course Progress        │   │
                   │  └──────────────────────────────┘   │
 ┌──────────┐      │  ┌──────────────────────────────┐   │
 │  Guest   │─────▶│  │  Discover Hackathons          │   │
 │  User    │─────▶│  │  Add a Hackathon              │   │
 └──────────┘      │  └──────────────────────────────┘   │
                   │  ┌──────────────────────────────┐   │
 ┌──────────┐      │  │  View Learning Roadmaps       │   │
 │  Admin   │─────▶│  └──────────────────────────────┘   │
 └──────────┘      │  ┌──────────────────────────────┐   │
                   │  │  Populate Courses (API)       │   │
                   │  └──────────────────────────────┘   │
                   └──────────────────────────────────────┘
```

---

## 11. System Design

### Class Diagram (Core Entities)

```
┌──────────────────────┐        ┌──────────────────────┐
│         User         │        │        Course         │
├──────────────────────┤        ├──────────────────────┤
│ id: string (Clerk)   │        │ id: uuid              │
│ email: string        │        │ title: string         │
│ name: string         │        │ description: string   │
└──────────┬───────────┘        │ instructor: string    │
           │ 1                  │ category: string      │
           │                    │ level: string         │
           ▼ N                  │ thumbnail_url: string │
┌──────────────────────┐        │ youtube_playlist_id   │
│     Enrollment       │        │ price: number         │
├──────────────────────┤        │ created_at: timestamp │
│ id: uuid             │◀───────┤ N                     │
│ user_id: string      │  1     └──────────────────────┘
│ course_id: uuid      │
│ enrolled_at: ts      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Progress       │
├──────────────────────┤
│ id: uuid             │
│ user_id: string      │
│ course_id: uuid      │
│ completed: boolean   │
│ completed_at: ts     │
└──────────────────────┘
```

### Sequence Diagram — Course Enrollment Flow

```
Student      Browser        Next.js Server       Supabase DB
   │             │                 │                   │
   │──Click ────▶│                 │                   │
   │  "Enroll"   │                 │                   │
   │             │──POST /enroll──▶│                   │
   │             │                 │──INSERT ──────────▶│
   │             │                 │  enrollments table │
   │             │                 │◀── success ────────│
   │             │◀── 200 OK ──────│                   │
   │◀─ Update UI─│                 │                   │
   │ (enrolled=true, button changes)                   │
```

### Sequence Diagram — AI Assistant Chat

```
Student      Browser        /api/chat         Groq API
   │             │               │                │
   │──Type msg──▶│               │                │
   │  + Submit   │               │                │
   │             │──POST ───────▶│                │
   │             │               │──stream req───▶│
   │             │               │◀─token stream──│
   │             │◀─stream resp──│                │
   │◀─render MD──│               │                │
   │  (live)     │               │                │
```

---

## 12. Agile Methodology

### Primary Methodology: Scrum

The project followed a **2-week sprint cycle** with the following structure per sprint:
- Sprint Planning (define stories, estimate points)
- Daily Stand-ups (what did I do, what will I do, blockers)
- Sprint Review (demo working features)
- Sprint Retrospective (what went well, what to improve)

### Sprint Plan

| Sprint | Duration | Goals | Status |
|---|---|---|---|
| Sprint 1 | Week 1–2 | Project setup, Clerk auth, Supabase schema, middleware | Done |
| Sprint 2 | Week 3–4 | Course catalog, enrollment, progress tracking, dashboard | Done |
| Sprint 3 | Week 5–6 | AI Assistant (Groq), Resume Builder, Hackathons page | Done |
| Sprint 4 | Week 7–8 | Roadmaps, bug fixes, performance optimization, deployment | Done |

### Jira Task Tracking

| Epic | User Story | Story Points | Status |
|---|---|---|---|
| Auth | As a user I can sign up and sign in | 3 | Done |
| Courses | As a student I can browse and filter courses | 5 | Done |
| Courses | As a student I can enroll and track progress | 5 | Done |
| AI | As a student I can chat with an AI assistant | 8 | Done |
| Resume | As a student I can build and preview my resume | 8 | Done |
| Hackathons | As a student I can discover and filter hackathons | 5 | Done |
| Hackathons | As a user I can add a new hackathon | 3 | Done |
| Roadmaps | As a student I can view career roadmaps | 3 | Done |
| DevOps | Deploy to Vercel with env config | 2 | Done |

**Secondary methodology:** Kanban was used informally for bug tracking between sprints — a simple To Do / In Progress / Done board for hotfixes.

---

## 13. Implementation / Screenshots

### Key Features Implemented

**1. Dashboard (`/dashboard`)**
- Personalized welcome card with user name from Clerk
- Enrolled courses with progress bars
- Quick navigation sidebar to all modules

**2. Course Catalog (`/courses`)**
- Server-side rendered grid of 55+ seeded courses (expandable to 300+)
- Sidebar filters: category, level, keyword search
- Server-side pagination (12 per page)
- Each card: instructor, level badge, thumbnail, enroll/enrolled status

**3. AI Assistant (`/ai-assistant`)**
- Chat interface with message history
- Markdown rendering for code blocks, lists, and headings
- Powered by Groq (llama3-8b-8192) with streaming responses
- Real-time token-by-token rendering

**4. Resume Builder (`/resume-builder`)**
- Form sections: Personal Info, Work Experience, Education, Skills
- Live split-pane preview updates as you type
- ATS-friendly clean formatting

**5. Hackathons (`/hackathons`)**
- 20 real India hackathons: SIH, HackWithInfy, Flipkart Grid, ETHIndia, Kavach, NASSCOM AI, and more
- Search by keyword, filter by domain (10 domains), status (Upcoming/Live), platform
- "Add Hackathon" modal — users can submit their own
- Unstop and Hack2Skill live embedded feeds (iframe tabs)
- Each card: organizer, description, prize, date, location, team size, tags, status badge

---

## 14. Testing Approach

### Types of Testing Used

- **Unit Testing** — Individual component logic (form validation, filter functions, useMemo computations)
- **Integration Testing** — API routes tested with real Supabase and Groq connections
- **System Testing** — End-to-end user flows (sign up → enroll → track progress)
- **Manual UI Testing** — Cross-browser and responsive layout verification on Chrome, Firefox, Edge

### Sample Test Cases

| Test ID | Test Case | Input | Expected Output | Actual Output | Status |
|---|---|---|---|---|---|
| TC-01 | User sign up | Valid email + password | Redirect to `/dashboard` | Redirected to `/dashboard` | Pass |
| TC-02 | Course filter by level | Level = "Beginner" | Only beginner courses shown | Only beginner courses shown | Pass |
| TC-03 | AI assistant response | "What is system design?" | Streamed markdown response | Streamed response rendered | Pass |
| TC-04 | Enroll in course | Click "Enroll" on course card | Enrollment saved, button → "Enrolled" | Button changed, DB updated | Pass |
| TC-05 | Missing env vars | No `.env.local` file | Error: `supabaseUrl is required` | Error thrown as expected | Pass |
| TC-06 | Hackathon search | Search "flipkart" | Flipkart Grid card shown | Correct card filtered | Pass |
| TC-07 | Add hackathon modal | Fill form + submit | New card appears in list | Card added instantly | Pass |
| TC-08 | Resume live preview | Type name in form | Preview updates in real time | Preview updated | Pass |
| TC-09 | Pagination | Navigate to page 2 | Next 12 courses loaded | Correct courses shown | Pass |
| TC-10 | Unstop iframe tab | Click "Unstop" tab | Unstop website embedded | Iframe loaded | Pass |

---

## 15. Tools Used

| Tool | Purpose | Usage in Project |
|---|---|---|
| **GitHub** | Version control | Code hosting at `github.com/Sreejith-nair511/SE_MINIPROJECT` |
| **Jira** | Task tracking | Sprint planning, backlog, story points, bug tracking |
| **VS Code / Kiro IDE** | Development environment | Primary coding, debugging, AI-assisted development |
| **Supabase Dashboard** | Database management | Table editor, SQL editor, RLS policy config, API keys |
| **Clerk Dashboard** | Auth management | User management, publishable/secret key config |
| **Vercel** | Deployment | Production deployment, preview deployments per PR |
| **Postman** | API testing | Testing `/api/chat` and `/api/populate-courses` routes |
| **Figma** | UI/UX design | Wireframes, component design, color system |
| **pnpm** | Package management | Fast, disk-efficient dependency management |
| **Turbopack** | Dev bundler | Fast HMR during development (built into Next.js 16) |

---

## 16. Challenges Faced

**1. Supabase SSR vs Clerk Auth Session Mismatch**
Clerk and Supabase both manage sessions differently. Getting server components to correctly read the authenticated user's ID and pass it to Supabase queries required careful use of `@supabase/ssr` and Clerk's `auth()` helper. They couldn't be mixed naively — required separate client instances for server and client contexts.

**2. ThemeProvider SSR Crash in Production**
The `ThemeProvider` component caused a production build crash because it used `useContext` in a way that wasn't safe during server-side rendering. Fixed by ensuring the context always has a default value and wrapping with a proper client boundary (`'use client'` directive).

**3. YouTube API Quota Exhaustion**
The `/api/populate-courses` route hits YouTube's Data API v3, which has a strict daily quota of 10,000 units. Bulk playlist fetching exhausted the quota quickly during development. Solved by adding upsert logic (`ON CONFLICT DO NOTHING`) so re-runs don't re-fetch already-stored courses.

**4. iframe Embedding Restrictions (X-Frame-Options)**
Both Unstop and Hack2Skill set `X-Frame-Options: SAMEORIGIN` headers that block embedding in some browsers. Handled gracefully with a fallback "Open in new tab" button and a user-facing notice. The `sandbox` attribute was carefully configured to allow necessary permissions.

**5. TypeScript Strict Mode Errors**
With `strict: true` in tsconfig, many `any` types from Supabase responses caused compile errors. Required explicit typing of all database response shapes, careful use of type assertions, and defining proper interfaces (`Hackathon`, `HackathonPlatform`, `HackathonStatus`) in constants.

**6. Duplicate Supabase RLS Policy Errors**
Running the migration SQL file a second time threw `policy already exists` errors. Fixed by wrapping all `CREATE POLICY` statements in `DO $$ IF NOT EXISTS` blocks to make migrations idempotent.

**7. Environment Variable Management**
The project uses `.env.local` (not committed to Git) for secrets. New team members frequently hit the `supabaseUrl is required` runtime error because they only had `.env.example`. Resolved by documenting the setup process clearly and providing a `.env.example` with all required keys listed.

---

## 17. Conclusion

Engineering Career OS successfully delivers a unified career development platform for engineering students. All four core objectives were achieved:

1. A fully functional course catalog backed by a real Supabase PostgreSQL database with 55+ seeded courses, search, filtering, and server-side pagination.
2. A working AI assistant powered by Groq that provides real-time streaming career and coding guidance with markdown rendering.
3. A comprehensive hackathon discovery hub with 20 real India hackathons, multi-dimensional filtering (search, domain, status, platform), embedded Unstop/Hack2Skill feeds, and user-submitted hackathon support.
4. A professional resume builder with live split-pane preview and ATS-optimized output.

Beyond features, the project demonstrated practical application of modern full-stack engineering practices — server-side rendering with Next.js App Router, secure authentication with Clerk, real-time AI streaming, Row Level Security in PostgreSQL, and agile development with Scrum sprints tracked in Jira.

The platform is deployed and production-ready on Vercel, with a clean TypeScript codebase on GitHub and a scalable architecture capable of supporting thousands of concurrent users. Future enhancements could include peer-to-peer mentorship, coding challenge integration (LeetCode-style), certificate generation, and a mobile app.

---

*Software Engineering Lab | Experiment 6 | Mini Project Presentation*
*GitHub Repository: https://github.com/Sreejith-nair511/SE_MINIPROJECT*

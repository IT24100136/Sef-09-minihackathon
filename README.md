# SmartKunu LK - Urban Waste Management & Dengue Prevention

![SmartKunu LK](https://img.shields.io/badge/Platform-SmartKunu%20LK-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)

## 📌 Problem Statement
Uncollected bulk waste in suburban councils like Dehiwala often ends up illegally dumped on roadsides. During monsoons, these exact items trap stagnant water and become prime breeding grounds for dengue mosquitoes (*Aedes aegypti*), posing serious public health hazards and clogging municipal drainage infrastructure.

## 💡 The Solution
**SmartKunu LK** is a rapid-response civic waste management portal that prevents illegal dumping by giving residents a searchable municipal collection timetable and a direct channel to report missed pickups and illegal dumping based on Central Environmental Authority (CEA) waste segregation guidelines.

---

## ✨ Key Features

1. **Interactive Schedule Dashboard (`ScheduleView.jsx`)**:
   - Filterable municipal timetables by Council / Ward (Colombo 03, Colombo 07, Dehiwala Ward 4, Battaramulla Ward 2) and CEA Waste Categories (Perishable Organic, Recyclable Plastics, Paper/Cardboard, Electronic Waste).
   - Segregation rules callout (*"CMC will reject mixed polythene bags"*).
   - CEA Color Code Legend highlighting environmental dengue prevention standards.

2. **Illegal Dumping & Missed Collection Report Form (`ReportForm.jsx`)**:
   - React Hook Form + Zod schema validation.
   - Strict Sri Lankan mobile number validation (`^(?:0|94)?7[0-9]{8}$`) with real-time error feedback.
   - Minimum 10-character description and location requirements.

3. **Active Complaints Live Feed**:
   - Reactively prepends newly submitted reports to a live feed below the form with visual confirmation banners.
   - Color-coded hazard badges and timestamp indicators.

4. **ASP.NET Core Minimal API Backend (`/server`)**:
   - Minimal API endpoints (`GET /api/schedules`, `POST /api/reports`, `GET /api/reports`).
   - EF Core DbContext connected to cloud-hosted Neon PostgreSQL database.
   - Swagger / OpenAPI documentation UI (`/swagger`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router v7, React Hook Form, Zod, Axios, Lucide React |
| **Backend** | ASP.NET Core 8/10 Minimal APIs, Entity Framework Core, Swashbuckle (Swagger) |
| **Database** | Cloud PostgreSQL (Neon Database) |
| **Tooling & Linter** | Node.js v24, .NET 10 SDK, Oxlint |

---

## 👥 Team Members

| Name | Student ID / Role | Branch Contribution |
|---|---|---|
| **Karunarathna M. M. G. A. S** | IT24100136  | Monorepo Setup & Integration & `feat/db-efcore-deploy`( EF Core, Neon DB) |
| **Rathnayake R. M. T. S** | IT24100012 | `feat/ui-schedule-filter` (Navbar, Footer, Legend, ScheduleView) |
| **Rathnayake R. M. H. T** | IT24100510 | `feat/ui-report-form` (Axios API, ReportForm, Live Feed) |
| **Abeynayake D. A** | IT24100971| `feat/api-endpoints-dtos`(Models, DTOs) |

---

## 🤖 AI Prompt Log & Tool Usage

| AI Tool / Agent | Prompt Summary | Modifications Made |
|---|---|---|
| **Antigravity AI (Gemini 3.6 Flash)** | Scaffold SmartKunu-LK monorepo structure with React Vite frontend & ASP.NET Core backend | Created monorepo layout, package configs, and API routing |
| **Antigravity AI (Gemini 3.6 Flash)** | Build `feat/ui-schedule-filter` branch (Navbar, Footer, Legend, ScheduleView) | Enforced CEA color codes, dengue problem/solution context banner, and interactive dropdown filters |
| **Antigravity AI (Gemini 3.6 Flash)** | Build `feat/ui-report-form` branch (Axios service, ReportForm, Zod schema) | Implemented Sri Lankan phone regex validation `^(?:0|94)?7[0-9]{8}$`, live complaints feed state, and Axios integration |
| **Antigravity AI (Gemini 3.6 Flash)** | Build `feat/api-endpoints-dtos` & `feat/db-efcore-deploy` (EF Core, Neon PostgreSQL) | Configured Npgsql EF Core DbContext, seed data for schedules, appsettings.json connection string, and README |

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18+) & npm
- .NET 8 / 10 SDK

### 1. Frontend Setup (`/client`)
```bash
cd SmartKunu-LK/client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

### 2. Backend Setup (`/server`)
```bash
cd SmartKunu-LK/server
dotnet restore
dotnet ef database update  # Or automatic database creation on startup
dotnet run
```
*Backend runs on `http://localhost:5000` with Swagger UI at `http://localhost:5000/swagger`.*

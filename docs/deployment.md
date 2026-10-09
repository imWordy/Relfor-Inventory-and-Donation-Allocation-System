# Production Deployment Guide

This guide details the steps required to deploy the **Relfor Inventory & Donation Allocation System** to production environments, fulfilling Phase 28 / Step 30 of the project execution plan.

---

## 1. Architecture Overview

The system consists of three production components:
1. **Frontend:** React + Vite Single Page Application served via Nginx (or hosted on Vercel/Netlify).
2. **Backend:** FastAPI REST API server managed by Uvicorn (Render, Railway, or Docker).
3. **Database:** PostgreSQL 16 relational database with initialized schemas and triggers.

```text
[ Client Web Browser ]
         │
         ▼
[ Nginx / Vercel Frontend ] (Port 80 / 443)
         │
         ▼
[ FastAPI Backend ] (Port 8000)
         │
         ▼
[ PostgreSQL Database ] (Port 5432)
```

---

## 2. Docker & Containerized Production Deployment (Recommended)

The repository provides production-ready multi-stage Dockerfiles and an orchestration profile in `docker-compose.yml`.

### Prerequisites
- Docker Engine 24.0+
- Docker Compose v2.20+

### Steps

1. **Clone the repository and set environment variables:**
   ```bash
   cp .env.production.example .env
   ```
   *Edit `.env` and configure strong passwords for `POSTGRES_PASSWORD` and `SECRET_KEY`.*

2. **Launch all services:**
   ```bash
   docker-compose up -d --build
   ```

3. **Verify running containers:**
   ```bash
   docker-compose ps
   ```

4. **Verify Healthchecks:**
   - Database: Checks readiness via `pg_isready`
   - Backend: Available at `http://localhost:8000/health`
   - Frontend: Available at `http://localhost:80`

---

## 3. Cloud Provider Deployment (Vercel + Render + Managed PostgreSQL)

### A. Managed Database (Supabase / Neon / Render Postgres)
1. Provision a PostgreSQL 16 database instance.
2. Obtain the external connection string:
   ```text
   postgresql+psycopg://<user>:<password>@<host>:<port>/<dbname>
   ```
3. Initialize the schema:
   ```bash
   psql -f database/schema.sql <connection_string>
   psql -f database/seed.sql <connection_string>
   ```

### B. Backend Deployment (Render / Railway)
1. Link GitHub repository and set Root Directory to `backend`.
2. Set Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `SECRET_KEY`: A cryptographically secure 32-byte secret (e.g. generated via `openssl rand -hex 32`).
   - `ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `120`
3. Build & Start Commands:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Verify `/health` endpoint once deployed.

### C. Frontend Deployment (Vercel)
1. Link GitHub repository root in Vercel.
2. Framework Preset: **Vite**.
3. Build & Output:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Set Environment Variables:
   - `VITE_API_BASE_URL`: The deployed Render backend URL (e.g., `https://relfor-api.onrender.com`).
5. Deploy and verify navigation and auth workflows.

---

## 4. Production Checklist & Security Controls

- [x] **CORS:** Configured in `app/main.py` allowing only trusted origins in production.
- [x] **JWT Expiration:** Tokens default to 120-minute expiry with bcrypt password hashing.
- [x] **No Secrets in Repo:** `.env` and secret keys are excluded in `.gitignore`.
- [x] **Static Assets:** Gzipped static bundle generation via Vite with multi-stage Nginx serving.
- [x] **Database Constraints:** Invariants (stock `>= 0`, status workflows) are strictly enforced at database and API levels.

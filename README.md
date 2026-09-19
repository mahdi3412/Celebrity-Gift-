# Celebrity Gift

Privacy-first physical gift platform for fans sending physical gifts to celebrities, influencers and creators.

## Monorepo
- `apps/web`: Next.js + React + Tailwind RTL Persian UI
- `apps/api`: NestJS API with validation, Helmet, auth token foundation, creator discovery, gift lifecycle, verification workflow, station scanning and configurable thresholds
- `apps/cms`: Strapi for editorial content only
- PostgreSQL + Redis are provided by Docker Compose for the production architecture

## Current workflows
- Fan/creator registration and login entry points
- Mandatory verification workflow with auto/manual review states
- Public creator discovery without private address or verification data
- Gift IDs such as `GFT-000184` and QR payloads
- Gift lifecycle: requested -> received at station -> processing -> shipped -> delivered -> accepted/declined/returned
- Food/fragile declarations and station SOP guidance
- Separate unique-fan and total-request threshold model
- Station scan/status dashboard
- CI build workflow

## Run locally
```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Web: http://localhost:3000  
API health: http://localhost:4000/api/health  
CMS: http://localhost:1337

## Important production hardening
The repository now contains the application foundation and domain boundaries. Before accepting real users or identity documents, replace demo/in-memory persistence with PostgreSQL repositories and migrations; add real password hashing, refresh-token rotation, full RBAC guards, rate limiting, private encrypted object storage, KYC provider integration, webhook verification, notification providers, courier integration, audit persistence, automated tests and deployment secrets.

Never commit real credentials or identity documents.

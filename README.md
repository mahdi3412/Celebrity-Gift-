# Celebrity Gift

Privacy-first physical gift platform for fans sending physical gifts to celebrities, influencers and creators.

## Architecture
- Web: Next.js + React + Tailwind CSS, Persian RTL
- API: NestJS
- CMS: Strapi for editorial content/configuration only
- Data: PostgreSQL + Redis architecture
- Physical workflow: fan -> central station -> processing -> courier -> creator/management

## Implemented foundation
- Creator discovery without exposing private addresses or verification data
- Gift IDs such as GFT-000184 with QR payload
- Gift lifecycle and station scanning
- Food/fragile declarations and station SOP guidance
- Verification workflow with manual-review state
- Configurable unique-fan / total-request thresholds
- CI workflow

## Local development
```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Web: http://localhost:3000
API health: http://localhost:4000/api/health
CMS: http://localhost:1337

## Production gate
This repository is the application foundation, not yet a production KYC deployment. Before real users or identity documents are accepted, implement PostgreSQL persistence/migrations, Argon2 password authentication, refresh-token rotation, full RBAC guards, rate limiting, private encrypted document storage, a real KYC provider, verified webhooks, notifications, courier integration, audit persistence, automated tests and deployment secrets.

Never commit real credentials or identity documents.

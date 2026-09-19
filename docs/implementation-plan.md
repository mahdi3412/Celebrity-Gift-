# Implementation plan

## Phase 1 — foundation
- [x] Next.js / Tailwind web shell
- [x] NestJS API shell
- [x] Strapi CMS shell
- [x] Gift lifecycle and station workflow skeleton
- [x] Verification workflow skeleton
- [x] Threshold engine skeleton
- [x] CI workflow

## Phase 2 — persistence and security
- [x] PostgreSQL schema foundation
- [x] Database service and connection pool
- [x] Argon2id password authentication
- [x] Access + refresh token issuance
- [x] Refresh-token rotation/revocation
- [x] Global JWT authentication guard
- [x] Role-based access control
- [x] Gift ownership and transition authorization
- [x] Rate limiting and brute-force controls
- [x] Audit log persistence

## Phase 3 — verification and operations
- [x] Verification status persistence
- [x] KYC provider abstraction
- [x] Manual-review provider placeholder
- [ ] Real KYC provider integration
- [ ] Private encrypted verification storage
- [ ] Manual-review admin queue UI
- [x] Persisted in-app notifications API
- [ ] Courier provider abstraction
- [ ] Food/expiry operational alerts

## Phase 4 — quality and release
- [ ] API integration tests
- [ ] E2E tests
- [ ] Production observability
- [ ] Backup/restore drills
- [ ] Deployment environments and secret management
- [ ] Database migration runner for existing environments
- [x] Web auth proxy with HttpOnly cookies
- [x] Live creator discovery and creator profile management
- [x] Web dashboard notification feed

The repository remains intentionally below the production gate until real KYC, encrypted identity storage, operational notifications, testing and deployment controls are complete.
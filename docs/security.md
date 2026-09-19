# Security and privacy

## Mandatory controls
- Passwords: Argon2id.
- Access tokens: short-lived; refresh tokens are rotated and revocable.
- RBAC: fan, creator/influencer/creator, station staff and admin scopes.
- Validation: whitelist DTOs and reject unknown fields.
- HTTP: Helmet, strict CORS, TLS in production and secure cookies where applicable.
- Abuse prevention: login/request rate limits, unique-request limits per fan/creator pair, suspicious-activity flags.
- Secrets: environment/secret manager only; never commit credentials.
- Verification: private object storage, encryption at rest, provider webhooks verified, minimal metadata retained.
- Audit: record security-sensitive actions without storing unnecessary document contents.
- Retention: configurable deletion/anonymization jobs for expired verification artifacts.
- Privacy: creator addresses and verification details are never returned by public endpoints.

## Physical station SOP
Inspect external packaging and declarations. Flag damage or suspicious packaging. Do not normally open sealed packages or unnecessarily read personal letters. Do not automatically repackage original packaging; add outer protection only when required for safe transport. Food gifts receive priority handling and expiry-aware notification.

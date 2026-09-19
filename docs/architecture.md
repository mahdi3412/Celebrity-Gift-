# Architecture

The API owns transactional business data. Strapi is reserved for editorial content/configuration. Verification documents live outside public CMS media and are referenced by opaque IDs.

Domains: auth/RBAC, identity verification, creators, requests, gifts, station operations, notifications, thresholds and admin.

Physical workflow: fan -> central station -> processing -> shipment -> delivered -> creator decision -> accepted/declined/returned.

Security baseline: Argon2 password hashing, short-lived access tokens, refresh rotation, validation, rate limiting, audit logs, private object storage, encryption at rest, least privilege and retention/deletion jobs.

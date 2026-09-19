# Product requirements

Roles: fan, creator/influencer/creator, admin, plus controlled station staff.

Fan flow: account -> mandatory identity verification -> creator discovery -> gift request -> unique gift ID/QR -> shipment to Delhi station -> tracking and notifications.

Creator flow: account -> mandatory identity verification -> private profile/address management -> request review -> accept/decline/return.

Non-member creator thresholds: separately count unique fans and total requests/activity. Per fan, cap unique requests to a configurable limit. Public indicators may start at 100 unique fans and stronger invitation messaging around 150; admins control thresholds. No public rejection counts or leaderboard.

Gift categories: clothing, book, letter, handmade, food, fragile, other. Store declarations for food/fragile/note. State machine: requested -> received at station -> processing -> shipped -> delivered -> accepted/declined/returned.

Courier pricing should be abstracted behind a provider interface so v1 can use configured/manual prices and later add an API without changing the domain.

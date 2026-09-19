export const AUTH_COOKIE={access:"cg_access",refresh:"cg_refresh"};
export const API_BASE=process.env.API_URL??process.env.NEXT_PUBLIC_API_URL??"http://localhost:4000";
export const ACCESS_MAX_AGE=15*60;
export const REFRESH_MAX_AGE=30*24*60*60;
export const ACCESS_TOKEN_TTL = "15m";
export const ROLES = ["fan","creator","admin","station_staff"] as const;
export type Role = typeof ROLES[number];
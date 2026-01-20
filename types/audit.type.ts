// src/types/AuditLog.type.ts
export type AuditLog = {
  id: string;
  timestamp: string; // "12 March, 2025 09:23:15"
  admin: string;
  status: "Downloaded Report" | "Viewed Profile";
  user: string;
  details: string;
};
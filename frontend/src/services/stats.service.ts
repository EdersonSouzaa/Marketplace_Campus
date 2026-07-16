import { apiRequest } from "./api";
import type { Stats } from "../types";

export function fetchStats(): Promise<Stats> {
  return apiRequest<Stats>("/stats");
}

const METRIKA_ID = 110276271;

declare global {
  interface Window {
    ym?: (id: number, action: string, target: string, params?: Record<string, unknown>) => void;
  }
}

export function reachGoal(target: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.ym === "function") {
    window.ym(METRIKA_ID, "reachGoal", target, params);
  }
}

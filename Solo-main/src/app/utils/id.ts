// src/app/utils/id.ts
export function createId(prefix = "id"): string {
  const c: any = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }

  // Fallback aman untuk browser yang tidak support randomUUID
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

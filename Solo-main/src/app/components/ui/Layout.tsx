// src/components/Layout.tsx
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      {/* Topbar mobile */}
      <div className="flex items-center justify-between p-3 md:hidden">
        <button
          className="rounded border px-3 py-2"
          onClick={() => setOpen(true)}
        >
          ☰ Menu
        </button>
        <div className="font-semibold">Solo</div>
      </div>

      {/* Sidebar desktop */}
      <aside className="hidden w-64 border-r md:block">
        {/* sidebar content */}
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-4">
            <button
              className="mb-4 rounded border px-3 py-2"
              onClick={() => setOpen(false)}
            >
              Close
            </button>

            {/* sidebar content */}
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

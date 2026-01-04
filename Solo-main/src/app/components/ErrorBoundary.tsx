import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message?: string }
> {
  state = { hasError: false as boolean, message: undefined as string | undefined };

  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: err?.message || "Unknown error" };
  }

  componentDidCatch(err: any) {
    console.error("App crashed:", err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <h1 className="text-lg font-semibold">Oops, terjadi error</h1>
          <p className="mt-2 text-sm opacity-80">{this.state.message}</p>
          <button className="mt-4 rounded border px-3 py-2" onClick={() => location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

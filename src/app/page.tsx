"use client";

import dynamic from "next/dynamic";

// Dynamically load the client-side single page app with SSR disabled to prevent hydration mismatch on document/window objects
const AppClient = dynamic(() => import("../App"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-[#faf9f6]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
        <p className="font-serif italic text-sm text-gray-500">
          Loading Chambers...
        </p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <AppClient />;
}

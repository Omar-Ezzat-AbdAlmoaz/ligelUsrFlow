import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "The Counselor Suite",
  description: "An elegant, magazine-style legal intelligence workspace providing advanced document audits, contract template drafting, and grounded jurisprudential consultations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#faf9f6] text-navy-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

export const metadata = {
  title: "LabelLens — Ingredient Intelligence",
  description: "Instant additive flags, allergen scan, and NOVA-style estimate from any ingredient list. Client-only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-5">{children}</div>
      </body>
    </html>
  );
}

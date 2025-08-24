import "./globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata = {
  title: "LabelLens — Food Label Analysis",
  description: "Instantly understand additives, allergens, and cross-region compliance from any ingredient list",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          Skip to main content
        </a>
        <AppShell>
          <div id="main-content">
            {children}
          </div>
        </AppShell>
      </body>
    </html>
  );
}

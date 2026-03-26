import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { OffersProvider } from "@/contexts/offers-context";
import { WatchlistProvider } from "@/contexts/watchlist-context";
import { PlatformProvider } from "@/components/providers/platform-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Froogo - Cele mai bune oferte",
  description: "Cele mai bune oferte la un click distanță",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Froogo",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F9FA" },
    { media: "(prefers-color-scheme: dark)", color: "#111412" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${manrope.variable} ${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-slate-950">
        <ThemeProvider>
          <PlatformProvider>
            <AuthProvider>
              <OffersProvider>
                <WatchlistProvider>
                  {children}
                </WatchlistProvider>
              </OffersProvider>
            </AuthProvider>
          </PlatformProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

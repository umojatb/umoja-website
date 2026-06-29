import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Manrope, Newsreader } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
});

const DESCRIPTION =
  "Umoja Africa empowers academically gifted, underprivileged students in Africa through full scholarships, dedicated mentorship, and community partnerships.";

export const metadata: Metadata = {
  title: {
    default: "Umoja Africa",
    template: "%s | Umoja Africa",
  },
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Umoja Africa",
    title: "Umoja Africa",
    description: DESCRIPTION,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Umoja Africa — Education changes lives",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umoja Africa",
    description: DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
};

/**
 * Without this, mobile browsers fall back to a synthetic 980px desktop
 * viewport and scale the page to fit, which makes Tailwind's `md:`
 * (>=768px) breakpoints evaluate as if the device were a desktop —
 * desktop nav renders at a tiny scale, hamburger button is hidden, and
 * the entire layout looks "shrunk." Setting `width=device-width`
 * restores normal mobile rendering and lets all responsive utilities
 * evaluate against the real device width.
 *
 * `initialScale: 1` matches device-width 1:1. We deliberately do NOT
 * set `maximumScale` or `userScalable: false` — those break pinch-to-
 * zoom for users who need it (accessibility regression).
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b4079",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${manrope.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-primary-700 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

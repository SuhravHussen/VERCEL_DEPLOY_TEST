import { El_Messiri, Inter, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  generateMetadata as generateSeoMetadata,
  viewport,
} from "@/config/seo";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { unstable_ViewTransition as ViewTransition } from "react";
const elMessiri = El_Messiri({
  variable: "--font-el-messiri",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = generateSeoMetadata();

export { viewport };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://fluencychecker.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Fluency Checker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Fluency Checker" />
        <meta name="description" content="Check your language fluency" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Schema.org structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Fluency Checker",
              url: "https://fluencychecker.com",
              description:
                "A sophisticated tool for analyzing and improving your language proficiency across multiple languages",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://fluencychecker.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <ViewTransition>
        <body
          className={`${elMessiri.variable} ${inter.variable} ${hindSiliguri.variable} antialiased`}
        >
          <TooltipProvider>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
            >
              <ReactQueryProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >

                  {children}
                </ThemeProvider>
              </ReactQueryProvider>
            </GoogleOAuthProvider>
          </TooltipProvider>
        </body>
      </ViewTransition>
    </html>
  );
}

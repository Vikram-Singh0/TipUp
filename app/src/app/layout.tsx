import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Suspense } from "react";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { PushChainProviders } from "@/providers/PushChainProviders";

export const metadata: Metadata = {
  title: "TipUp",
  description: "Tip creators instantly on any chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body className={`font-sans`}>
        <Suspense fallback={<div>Loading...</div>}>
          <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="pushflow-theme"
          >
            <PushChainProviders>
              <LoadingProvider>{children}</LoadingProvider>
            </PushChainProviders>
          </NextThemesProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}

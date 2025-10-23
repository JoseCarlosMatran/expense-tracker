import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SimpleFullWidthLayout from "@/components/layout/SimpleFullWidthLayout";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { I18nProvider } from "@/contexts/I18nContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FinanceTracker - Daily Budget Tracking",
  description: "Track your daily expenses like you track your calories. Simple, visual, and effective budget management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <I18nProvider>
          <CurrencyProvider>
            <SimpleFullWidthLayout>{children}</SimpleFullWidthLayout>
          </CurrencyProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
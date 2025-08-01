import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TicketProvider } from '@/contexts/ticket-context';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Samalyze – AI-Powered Expense Tracker for Smart Budgeting',
  description:
    'Track your spending smarter with Samalyze. Use AI to snap receipts, auto-categorize expenses, get financial insights, and reach your savings goals effortlessly.',
  keywords: [
    'Samalyze',
    'AI expense tracker',
    'budgeting app',
    'personal finance',
    'receipt scanner',
    'spending tracker',
    'smart budgeting',
    'financial insights',
    'expense management',
    'money saving tips',
  ],
  authors: [{ name: 'Sabbir Mohammad Sami', url: 'https://samalyze.com' }],
  creator: 'Sabbir Mohammad Sami',
  themeColor: '#0f172a',
  metadataBase: new URL('https://yourdomain.com'), // replace with your real domain
  openGraph: {
    title: 'Samalyze – AI-Powered Expense Tracker',
    description:
      'Effortlessly manage your finances with AI. Upload receipts, get spending insights, and improve your budget with Samalyze.',
    url: 'https://yourdomain.com',
    siteName: 'Samalyze',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg', // replace with your OG image
        width: 1200,
        height: 630,
        alt: 'Samalyze Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samalyze – AI-Powered Expense Tracker',
    description: 'Snap receipts, track expenses, and get financial insights instantly with AI.',
    creator: '@yourtwitterhandle', // optional
    images: ['https://yourdomain.com/og-image.jpg'], // same as OG image
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TicketProvider>{children}</TicketProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}

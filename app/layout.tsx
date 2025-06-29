import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NomadTips - Share Your Digital Nomad Journey',
  description: 'Discover and share the best spots for digital nomads worldwide. Find cafes, co-working spaces, restaurants, and hidden gems from fellow nomads.',
  keywords: 'digital nomad, travel tips, remote work, coworking spaces, nomad community',
  authors: [{ name: 'NomadTips Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'NomadTips - Share Your Digital Nomad Journey',
    description: 'Discover and share the best spots for digital nomads worldwide.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NomadTips - Share Your Digital Nomad Journey',
    description: 'Discover and share the best spots for digital nomads worldwide.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
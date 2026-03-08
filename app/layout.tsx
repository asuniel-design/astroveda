import './globals.css';
import { Inter, Poppins } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: 'AstroVeda • Cosmic Guidance, Modern UX',
  description: 'Live consultations, natal charts, and astrology tools in a premium, glassmorphic interface.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-cosmic-purple via-cosmic-indigo to-[#0b0a1c] bg-starfield selection:bg-gold/40">
        <div className="relative">
          {/* Soft vignette */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.35] bg-radial from-transparent via-transparent to-transparent" />
          {children}
        </div>
      </body>
    </html>
  );
}

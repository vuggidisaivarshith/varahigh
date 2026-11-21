import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingActions from '@/components/layout/FloatingActions';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VARAHI GIRLS HOSTEL — Premier Women Accommodation in Shamshabad, Hyderabad',
  description:
    'Varahi Girls Hostel (Branch 1). High-security, fully monitored accommodation exclusively for female students, working women, and RGIA airport staff in Shamshabad, Hyderabad. Proprietor: E. Bharath Chandra (Phone: +91 93919 44082). Homely food, attached washrooms, 24/7 CCTV & resident lady warden, high-speed Wi-Fi, and generator backup.',
  keywords: [
    'Varahi Girls Hostel',
    'Varaahi Girls Hostel',
    'Varahi Girls Hostel Shamshabad',
    'Girls hostel in Shamshabad',
    'Hostel near RGIA airport Hyderabad for female',
    'Women PG Shamshabad',
    'Working women hostel Shamshabad',
    'Student hostel Shamshabad girls',
    'E. Bharath Chandra hostel',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${plusJakarta.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAF9] text-[#1E293B] font-sans selection:bg-[#6957F5]/15 selection:text-[#0F172A]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}

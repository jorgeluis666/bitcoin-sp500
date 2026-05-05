import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Simulador de inversión a 10 años',
  description: 'Simulador didáctico de inversión DCA para un inversor peruano.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[var(--bg)] text-[var(--text-primary)] antialiased`}>
        {children}
      </body>
    </html>
  );
}

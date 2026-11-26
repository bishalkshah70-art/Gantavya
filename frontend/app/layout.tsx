import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gantavya — Find your next destination',
  description: 'Plan your next journey across Nepal with Gantavya.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

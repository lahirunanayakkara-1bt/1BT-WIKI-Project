// Root layout — replaced from Next.js scaffold.
// Imports globals.css from src/app/ (which has Tailwind directives + Inter font).
// Shell layout (Sidebar + Navbar) is in src/app/(dashboard)/layout.tsx.
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '1BT WIKI',
  description: '1Billion Technology Internal Knowledge Base',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#F5F5F5]">
        {children}
      </body>
    </html>
  );
}

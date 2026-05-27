import type { ReactNode } from 'react';

export const metadata = {
  title: 'HanApp API',
  description: 'Next.js API backend for HanApp',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

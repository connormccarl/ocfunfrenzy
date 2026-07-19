import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', 
});

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'OC Fun Frenzy',
  description: 'Fun things to do in Orange County, CA',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <div className="max-w-5xl w-full mx-auto p-4">    
          <Header />
          <main className="mt-20 mb-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

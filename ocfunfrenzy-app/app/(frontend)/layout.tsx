import './globals.css';
import '@mantine/core/styles.css';

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
import { theme } from './theme';

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'OC Fun Frenzy',
  description: 'Fun things to do in Orange County, CA',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        {/*<ColorSchemeScript />*/}
        <link rel="shortcut icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <div className="max-w-5xl mx-auto p-4">    
            <Header />
            <main className="mt-20 mb-30 sm:mb-50">
              {children}
            </main>
            <Footer />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}

"use client";

import Head from "next/head";
import "./globals.css";
import Providers from "./providers";
import { noto_serif_display, poppins } from "./components/utils/Font";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div>
            <Head>
              <link rel="icon" href="/favicon.ico" />
              <title>NUS Aerobics</title>
            </Head>
            <header></header>
            <main
              className={`${poppins.className} ${noto_serif_display.variable}`}
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}


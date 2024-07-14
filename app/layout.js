"use client";

import Head from "next/head";
import "../styles/globals.css";
import Providers from "./providers";
import { noto_serif_display, poppins } from "./components/fonts";

const name = "NUS Aerobics";
export const siteTitle = "Next.js Sample Website";

export default function Layout({ children, home }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div>
            <Head>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
            </header>
            <main className={`${poppins.className} ${noto_serif_display.variable}`}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

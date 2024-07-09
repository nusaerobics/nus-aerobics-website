"use client";

import Head from "next/head";
import "../styles/globals.css";
import styles from "./layout.module.css";
import Providers from "./providers";
import { noto_serif_display, poppins } from "./components/fonts";

const name = "NUS Aerobics";
export const siteTitle = "Next.js Sample Website";

export default function Layout({ children, home }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className={styles.container}>
            <Head>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>
            </header>
            <main className={`${poppins.variable} ${noto_serif_display.variable}`}>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}

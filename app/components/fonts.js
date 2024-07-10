import { Noto_Serif_Display, Poppins } from "next/font/google";

export const poppins = Poppins({ 
  weight: ['400', '700'], 
  subsets: ['latin'] ,
  variable: '--font-poppins',
});

export const noto_serif_display = Noto_Serif_Display({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-noto-serif-display',
});

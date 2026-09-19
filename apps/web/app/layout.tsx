import "./globals.css";
import type { ReactNode } from "react";
export const metadata = { title: "Celebrity Gift", description: "Privacy-first physical gifting platform" };
export default function RootLayout({children}:{children:ReactNode}) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}

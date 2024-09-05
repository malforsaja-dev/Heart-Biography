import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeartThink",
  description: "Website for HeartThink",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
              {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

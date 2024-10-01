import { Inter } from "next/font/google";
import 'quill/dist/quill.snow.css';
import "./globals.css";
import { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { UserDataProvider } from "@/context/UserDataContext";


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
          <UserProvider>
            <UserDataProvider>
              {children}
            </UserDataProvider>
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

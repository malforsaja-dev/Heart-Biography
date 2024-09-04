"use client";

import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <LanguageProvider>
      <div className="flex h-screen">
        {user && <Navbar />}
        <main className="flex-1 ml-16 mt-16 p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}

"use client";

import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <LanguageProvider>
      <div className="flex h-screen">
        {/* Always render the main structure but only show the navbar when the user is loaded */}
        {user && !loading && <Navbar />}
        <main
          className={`flex-1 ${user ? 'ml-16 mt-16' : ''} bg-gray-100`}
        >
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}

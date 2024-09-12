import Navbar from "@/components/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main
        className="ml-16 mt-16 bg-gray-100"
        style={{
          minHeight: "calc(100vh - 4rem)",
          width: "calc(100vw - 5.05rem)",
        }}
      >
        {children}
      </main>
    </>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100 p-5">
      <h1 className="text-center text-2xl font-bold mb-5">Biography</h1>
      <Link className="text-blue-600" href="/LpWelle">LpWelle</Link>
      <Link className="text-blue-600" href="/Seiten">Seiten</Link>
    </main>
  );
}

import Auth from "./components/Auth";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Auth />
    </main>
  );
}

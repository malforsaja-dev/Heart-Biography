import UploadImage from "@/components/UploadImage";
import Auth from "../components/Auth";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
      <Auth />
      <UploadImage />
    </main>
  );
}

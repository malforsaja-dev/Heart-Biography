import Auth from "@/components/Auth";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen bg-gray-100">
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p>login credentials for testing:</p>
        <p>Email: test@test.test</p>
        <p>Password: testtest</p>
      </div>

      <Auth />
    </main>
  );
}

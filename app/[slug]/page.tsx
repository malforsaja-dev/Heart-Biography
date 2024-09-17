// app/[slug]/page.tsx
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function RegistrationPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const registrationURL = process.env.NEXT_PUBLIC_REGISTRATION_URL;

  // Get the user token from cookies (supabase token)
  const token = cookies().get('sb-access-token')?.value || null;

  // If user is logged in, redirect to home page before rendering the registration page
  if (token) {
    return redirect('/');
  }

  // Check if the slug matches the registration URL. If not, redirect to welcome page
  if (slug !== registrationURL) {
    return redirect('/welcome');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 w-full z-30 flex justify-between items-center border-b-4 border-orange-200 bg-orange-100 text-black h-16 px-4">
        <Link href={"/"} className="font-bold text-xl text-orange-500">HeartThink</Link>
        <Link href={"/authenticate"} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Let&apos;s get started</Link>
      </header>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="text"
          placeholder="Full Name"
          className="mb-4 p-3 w-full border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-3 w-full border rounded"
        />
        <input
          type="date"
          placeholder="Birth Date"
          className="mb-4 p-3 w-full border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-3 w-full border rounded"
        />
        <button className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
          Register
        </button>
      </div>
    </div>
  );
}

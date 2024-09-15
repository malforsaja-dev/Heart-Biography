import Link from "next/link";

interface AuthFormProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleAction: () => void;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  handleAction,
  loading
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-screen">
      <header className="fixed top-0 right-0 z-30 flex justify-end items-center w-full border-b-4 border-orange-200 bg-orange-100 text-black h-16 px-4 space-x-4">
        <Link href={"/"} className="mr-auto font-bold text-xl text-orange-500">HeartThink</Link>
      </header>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-3 w-full border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-3 w-full border rounded"
        />
        <button
          onClick={handleAction}
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <div className="bg-orange-200 rounded-xl p-4 mt-4">
          <p className="py-2 text-orange-700">Alternatively use these credentials:</p>
          <p>email: test@test.test</p>
          <p>password: testtest</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;

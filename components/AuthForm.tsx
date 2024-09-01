
interface AuthFormProps {
  isRegistering: boolean;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setBirthDate: (birthDate: string) => void;
  handleAction: () => void;
  toggleAuthMode: () => void;
  loading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isRegistering, email, password, firstName, lastName, birthDate, setEmail, setPassword, setFirstName, setLastName, setBirthDate, handleAction, toggleAuthMode, loading
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? 'Register' : 'Sign In'}
        </h2>
        {isRegistering && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              disabled={loading}
              onChange={(e) => setFirstName(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              disabled={loading}
              onChange={(e) => setLastName(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
            <input
              type="date"
              placeholder="Birth Date"
              value={birthDate}
              disabled={loading}
              onChange={(e) => setBirthDate(e.target.value)}
              className="mb-4 p-3 w-full border rounded"
            />
          </>
        )}
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
          {loading ? 'Loading...' : isRegistering ? 'Register' : 'Sign In'}
        </button>
        <button
          onClick={toggleAuthMode}
          className="w-full p-3 mt-4 text-center text-blue-500 hover:underline"
        >
          {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;

"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  const { user, loading, handleSignIn, handleRegister, handleLogout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleAuthMode = () => setIsRegistering(!isRegistering);

  const handleAction = async () => {
    try {
      if (isRegistering) {
        await handleRegister(email, password, firstName, lastName, birthDate);
      } else {
        await handleSignIn(email, password);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!user) {
    return (
      <AuthForm
        isRegistering={isRegistering}
        email={email}
        password={password}
        firstName={firstName}
        lastName={lastName}
        birthDate={birthDate}
        setEmail={setEmail}
        setPassword={setPassword}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setBirthDate={setBirthDate}
        handleAction={handleAction}
        toggleAuthMode={toggleAuthMode}
        loading={loading}
      />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
        <p>You are logged in, feel free to browse the protected pages!</p>
        <button
          onClick={handleLogout}
          className="w-full p-3 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Auth;

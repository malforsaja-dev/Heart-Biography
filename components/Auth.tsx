"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const { user, loading, handleSignIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleAction = async () => {
    try {
      await handleSignIn(email, password);
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Invalid credentials, please try again.');
    }
  };

  return (
    <div>
      <AuthForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleAction={handleAction}
        loading={loading}
      />
      {errorMessage && (
        <div className="text-red-500 mt-4 text-center">{errorMessage}</div>
      )}
    </div>
  );
};

export default Auth;

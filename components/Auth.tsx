"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import Dashboard from './Dashboard';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const { user, loading, handleSignIn, handleRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();
  const toggleAuthMode = () => setIsRegistering(!isRegistering);

  const handleAction = async () => {
    try {
      if (isRegistering) {
        await handleRegister(email, password, userName, birthDate);
      } else {
        await handleSignIn(email, password);
      }

      router.push('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (user) {
    return <Dashboard />;
  }

  return (
    <AuthForm
      isRegistering={isRegistering}
      email={email}
      password={password}
      userName={userName}
      birthDate={birthDate}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      setBirthDate={setBirthDate}
      handleAction={handleAction}
      toggleAuthMode={toggleAuthMode}
      loading={loading}
    />
  );
};

export default Auth;

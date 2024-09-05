"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import Profile from '@/components/Profile';
import Dashboard from './Dashboard';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const { user, loading, handleSignIn, handleRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const router = useRouter();
  const toggleAuthMode = () => setIsRegistering(!isRegistering);

  const handleAction = async () => {
    try {
      if (isRegistering) {
        await handleRegister(email, password, firstName, lastName, birthDate);
      } else {
        await handleSignIn(email, password);
      }

      // After successful login, navigate to the root URL
      router.push('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Render a loading indicator while loading the authentication state
  if (loading) {
    return null;
  }

  // Show the dashboard for logged-in users
  if (user) {
    return <Dashboard />;
  }

  // If the user is not authenticated, show the authentication form
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
};

export default Auth;

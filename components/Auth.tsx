"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import Profile from '@/components/Profile';
import Dashboard from './Dashboard';

const Auth = () => {
  const { user, loading, handleSignIn, handleRegister } = useAuth();
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

  // Render nothing while loading the authentication state
  if (loading) {
    return null;
  }

  // Show the dashboard for logged-in users
  if (user) {
    return (
      <Dashboard />
    );
  }

  // Unauthenticated users will be redirected to /welcome by middleware
  return null;
};

export default Auth;

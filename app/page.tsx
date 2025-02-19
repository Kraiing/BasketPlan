'use client';

import { useState } from 'react';
import BasketballBoard from '@/components/BasketballBoard';
import LoginForm from '@/components/LoginForm';

export default function HomePage() {
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <main className="min-h-screen">
      {user ? (
        <>
          <header className="flex items-center justify-between p-4 bg-blue-800">
            <h1 className="text-2xl font-bold text-white">
              ยินดีต้อนรับ, {user}!
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </header>
          <section className="p-4">
            <BasketballBoard />
          </section>
        </>
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}
    </main>
  );
}

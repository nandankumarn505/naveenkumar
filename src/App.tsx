import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, type Destination } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import Blog from './components/Blog';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import DestinationsModal from './components/DestinationsModal';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showDestinations, setShowDestinations] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function handleOpenAuth(mode: 'login' | 'register' = 'login', showPrompt = false) {
    setAuthMode(mode);
    setShowRegisterPrompt(showPrompt);
    setShowAuth(true);
  }

  function handleAuthRequired() {
    handleOpenAuth('register', true);
  }

  function handleBook(destination: Destination) {
    setSelectedDestination(destination);
    setShowDestinations(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header user={user} onOpenAuth={() => handleOpenAuth('login')} onSignOut={handleSignOut} />

      <main>
        <Hero onSelectDestination={() => setShowDestinations(true)} />
        <Blog />
        <AboutSection />
      </main>

      <Footer />

      <DestinationsModal
        isOpen={showDestinations}
        onClose={() => setShowDestinations(false)}
        onBook={handleBook}
        isLoggedIn={!!user}
        onAuthRequired={handleAuthRequired}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => { setShowAuth(false); setShowRegisterPrompt(false); }}
        initialMode={authMode}
        showRegisterPrompt={showRegisterPrompt}
      />

      <BookingModal
        isOpen={!!selectedDestination}
        destination={selectedDestination}
        user={user}
        onClose={() => setSelectedDestination(null)}
      />
    </div>
  );
}

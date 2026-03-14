import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Doctors from './pages/Doctors';
import Insurance from './pages/Insurance';
import About from './pages/About';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Onboarding from './pages/Onboarding';
import Wearables from './pages/Wearables';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-owl-tan/30 feather-pattern">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 border-4 border-white overflow-hidden"
        >
          <img src="/ollie-logo.png" alt="Ollie" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </motion.div>
        <div className="flex flex-col items-center">
          <div className="text-owl-blue font-bold text-xl tracking-tight mb-2">Ollie is waking up...</div>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-owl-blue rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-owl-blue rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-owl-blue rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#F3F4F6] font-sans">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
          <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
          <Route path="/wearables" element={user ? <Wearables /> : <Navigate to="/auth" />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <ChatBot />
      </div>
    </Router>
  );
}

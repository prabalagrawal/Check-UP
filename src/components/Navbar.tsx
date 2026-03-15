import { Link, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Heart, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-owl-brown/5 sticky top-0 z-50 feather-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="text-xl font-bold text-owl-blue">CheckUp</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/doctors" className="text-sm font-medium text-gray-600 hover:text-owl-blue">The Doctor's Nest</Link>
            <Link to="/insurance" className="text-sm font-medium text-gray-600 hover:text-owl-blue">The Wisdom Shield</Link>
            <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-owl-blue">The Owl's Story</Link>
            {user ? (
              <div className="flex items-center space-x-6">
                <Link to="/wearables" className="text-sm font-medium text-gray-600 hover:text-owl-blue flex items-center">
                  <Heart className="w-4 h-4 mr-1 text-red-500" />
                  Vitality Sync
                </Link>
                <Link to="/dashboard" className="text-sm font-medium text-white bg-owl-blue px-6 py-2 rounded-full shadow-lg hover:shadow-owl-blue/20 transition-all">My Nest</Link>
                <button onClick={handleSignOut} className="text-gray-600 hover:text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-owl-blue text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-owl-blue/90 transition-all shadow-lg shadow-owl-blue/10">
                Join the Nest
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-owl-blue">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-owl-brown/5 feather-pattern"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/doctors" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-bold text-owl-blue">The Doctor's Nest</Link>
              <Link to="/insurance" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-bold text-owl-blue">The Wisdom Shield</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-bold text-owl-blue">The Owl's Story</Link>
              {user ? (
                <>
                  <Link to="/wearables" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-bold text-owl-blue">Vitality Sync</Link>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-bold text-owl-forest">My Nest</Link>
                  <button onClick={() => { handleSignOut(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-bold text-red-600">Leave the Nest</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-bold text-owl-blue">Join the Nest</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

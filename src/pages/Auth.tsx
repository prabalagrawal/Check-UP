import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, Chrome } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'consumer' | 'doctor' | 'insurance'>('consumer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'consumer', // Default role for Google sign-in
          createdAt: new Date().toISOString()
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          role: role,
          createdAt: new Date().toISOString()
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-owl-tan/20 feather-pattern">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-owl-brown/10 relative overflow-hidden nest-pattern"
      >
        <div className="absolute -top-12 -right-12 opacity-5 animate-feather">
          <img src="/ollie-logo.png" alt="Ollie" className="w-40 h-40" referrerPolicy="no-referrer" />
        </div>

        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-owl-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-owl-blue/20">
            <img src="/ollie-logo.png" alt="Ollie" className="w-10 h-10 brightness-0 invert" referrerPolicy="no-referrer" />
          </div>
          <h2 className="text-3xl font-bold text-owl-blue">
            {isLogin ? 'Welcome to the Nest' : 'Build Your Nest'}
          </h2>
          <p className="text-owl-brown mt-2">
            {isLogin ? 'Sign in to access Ollie\'s wisdom' : 'Start your wise health journey today'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['consumer', 'doctor', 'insurance'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as any)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    role === r 
                      ? 'bg-owl-blue text-white border-owl-blue shadow-md' 
                      : 'bg-white text-gray-600 border-owl-brown/10 hover:border-owl-blue'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-owl-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-owl-blue transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-owl-brown/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-owl-blue transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-owl-blue text-white py-4 rounded-2xl font-bold hover:bg-owl-blue/90 transition-all shadow-lg shadow-owl-blue/20"
          >
            {isLogin ? 'Enter the Nest' : 'Create Your Nest'}
          </button>
        </form>

        <div className="relative my-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-owl-brown/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-owl-brown uppercase tracking-widest text-[10px] font-bold">Or Wisdom via</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 border border-owl-brown/10 py-4 rounded-2xl font-bold text-owl-blue hover:bg-owl-tan/10 transition-all relative z-10"
        >
          <Chrome className="w-5 h-5" />
          <span>Google Account</span>
        </button>

        <p className="text-center mt-8 text-gray-600 relative z-10">
          {isLogin ? "New to the nest?" : "Already have a nest?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-owl-blue font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

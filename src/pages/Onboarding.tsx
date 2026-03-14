import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { motion } from 'framer-motion';
import { Heart, Activity, Utensils, Cigarette, Wine, Save, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [medicalHistory, setMedicalHistory] = useState('');
  const [foodHabits, setFoodHabits] = useState('');
  const [exercise, setExercise] = useState('Sedentary');
  const [smoking, setSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState('None');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        medicalHistory,
        lifestyle: {
          foodHabits,
          exerciseFrequency: exercise,
          smoking,
          alcohol
        }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-owl-tan/30 flex items-center justify-center p-4 feather-pattern">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(139,94,52,0.1)] p-12 relative overflow-hidden border border-owl-brown/5"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
          <motion.div 
            className="h-full bg-owl-blue"
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-owl-tan rounded-3xl flex items-center justify-center shadow-inner overflow-hidden border-4 border-white">
            <img src="/ollie-logo.png" alt="Ollie" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-owl-blue mb-2">Building Your Nest</h2>
          <p className="text-gray-500 italic">"A wise owl prepares its nest before the storm."</p>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="text-owl-brown w-6 h-6" />
              <h3 className="text-xl font-bold text-owl-blue">Medical History</h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm leading-relaxed">
                Please provide details about your **past diagnoses**, **surgeries**, and **family medical history**. This helps Ollie build a secure nest for your health data.
              </p>
              <div className="relative">
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Example:
- Diagnoses: Hypertension (2020)
- Surgeries: Knee surgery (2015)
- Family: Father had heart disease"
                  className="w-full h-64 p-6 bg-gray-50 border border-owl-brown/10 rounded-[2rem] focus:ring-2 focus:ring-owl-blue outline-none transition-all resize-none text-gray-700 leading-relaxed"
                />
                <div className="absolute bottom-4 right-6 text-[10px] text-owl-brown/40 font-bold uppercase tracking-widest">
                  Wise Input
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Utensils className="text-owl-brown w-6 h-6" />
              <h3 className="text-xl font-bold text-owl-blue">Food & Lifestyle</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Food Habits</label>
                <input
                  type="text"
                  value={foodHabits}
                  onChange={(e) => setFoodHabits(e.target.value)}
                  placeholder="e.g., High protein, low carb, vegetarian..."
                  className="owl-input"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Exercise Frequency</label>
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  className="owl-input"
                >
                  <option>Sedentary</option>
                  <option>1-2 times a week</option>
                  <option>3-5 times a week</option>
                  <option>Daily</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="text-owl-forest w-6 h-6" />
              <h3 className="text-xl font-bold text-owl-blue">Habits</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-owl-brown/5">
                <div className="flex items-center space-x-3">
                  <Cigarette className="text-owl-brown/40 w-5 h-5" />
                  <span className="font-medium">Do you smoke?</span>
                </div>
                <button
                  onClick={() => setSmoking(!smoking)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${smoking ? 'bg-owl-blue' : 'bg-gray-300'}`}
                >
                  <motion.div 
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{ x: smoking ? 24 : 0 }}
                  />
                </button>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Alcohol Consumption</label>
                <div className="grid grid-cols-3 gap-2">
                  {['None', 'Social', 'Regular'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAlcohol(opt)}
                      className={`py-3 rounded-xl border font-medium transition-all ${
                        alcohol === opt ? 'bg-owl-blue text-white border-owl-blue' : 'bg-white text-gray-600 border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-10 flex justify-between">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-8 py-3 text-gray-500 font-bold hover:text-gray-700"
            >
              Back
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="bg-owl-blue text-white px-10 py-4 rounded-[2rem] font-bold flex items-center hover:bg-owl-blue/90 transition-all shadow-lg shadow-owl-blue/20"
            >
              Continue Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-owl-forest text-white px-10 py-4 rounded-[2rem] font-bold flex items-center hover:bg-owl-forest/90 transition-all disabled:opacity-50 shadow-lg shadow-owl-forest/20"
            >
              {loading ? 'Nesting...' : 'Complete Nesting'}
              {!loading && <Save className="ml-2 w-5 h-5" />}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit, doc, getDoc, addDoc, getDocs, getDocFromServer } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  Moon, 
  Heart, 
  Brain, 
  AlertCircle,
  Plus,
  Calendar,
  ChevronRight,
  Watch,
  ArrowUpRight,
  ArrowDownRight,
  Camera,
  Search,
  Shield,
  Users,
  X,
  Sparkles,
  FileText,
  Utensils,
  RefreshCw,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { 
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { predictHealthRisks, searchInsuranceSchemes, scanPrescription, getOllieWisdom, HealthPrediction } from '../services/aiService';
import { analyzeDailyJournal, analyzeHealthData, HealthAnalysis, JournalInsight } from '../services/aiHealthService';
import OllieMascot from '../components/OllieMascot';

const mockChartData = [
  { name: 'Mon', hr: 68, sleep: 7.2 },
  { name: 'Tue', hr: 72, sleep: 6.5 },
  { name: 'Wed', hr: 70, sleep: 8.0 },
  { name: 'Thu', hr: 75, sleep: 5.8 },
  { name: 'Fri', hr: 71, sleep: 7.5 },
  { name: 'Sat', hr: 65, sleep: 8.5 },
  { name: 'Sun', hr: 67, sleep: 8.2 },
];

export default function Dashboard() {
  const [healthScore, setHealthScore] = useState(82);
  const [predictions, setPredictions] = useState<HealthPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [insuranceQuery, setInsuranceQuery] = useState('');
  const [insuranceResults, setInsuranceResults] = useState<any>(null);
  const [isSearchingInsurance, setIsSearchingInsurance] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [wiseWords, setWiseWords] = useState<string>('');
  const [healthRecords, setHealthRecords] = useState<any[]>([]);
  const [journalEntry, setJournalEntry] = useState('');
  const [isAnalyzingJournal, setIsAnalyzingJournal] = useState(false);
  const [journalInsight, setJournalInsight] = useState<JournalInsight | null>(null);
  const [calories, setCalories] = useState(0);
  const [water, setWater] = useState(0);
  const [isSavingVitals, setIsSavingVitals] = useState(false);
  const [isAnalyzingHealth, setIsAnalyzingHealth] = useState(false);
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
        }
      }
    };
    testConnection();

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch User Data
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Run AI Prediction
          try {
            const res = await predictHealthRisks(
              data.medicalHistory || 'None provided',
              data.lifestyle || {},
              "Resting HR: 68-74 bpm (Stable), Sleep Quality: 82% (Good), Active Calories: 450/day (Moderate), HRV: 55ms (Normal)"
            );
            setPredictions(res);
          } catch (err) {
            console.error("AI Prediction Error:", err);
          }

          // Fetch Wisdom
          try {
            const wisdom = await getOllieWisdom(data);
            setWiseWords(wisdom || '');
          } catch (err) {
            console.error("Wisdom Error:", err);
          }
        }

        // Fetch Health Records
        const q = query(
          collection(db, 'healthRecords'),
          where('userId', '==', auth.currentUser!.uid),
          orderBy('date', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        setHealthRecords(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        handleFirestoreError(err, OperationType.GET, 'initial_dashboard_data');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleJournalSubmit = async () => {
    if (!journalEntry.trim()) return;
    setIsAnalyzingJournal(true);
    try {
      const insight = await analyzeDailyJournal(journalEntry);
      setJournalInsight(insight);
      
      // Save to Firestore
      try {
        await addDoc(collection(db, 'journalEntries'), {
          userId: auth.currentUser?.uid,
          entry: journalEntry,
          date: new Date().toISOString(),
          insight
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'journalEntries');
      }
      
      setJournalEntry('');
    } catch (err) {
      console.error("Journal analysis error:", err);
    } finally {
      setIsAnalyzingJournal(false);
    }
  };

  const handleSaveVitals = async () => {
    setIsSavingVitals(true);
    try {
      await addDoc(collection(db, 'vitals'), {
        userId: auth.currentUser?.uid,
        calories,
        water,
        date: new Date().toISOString()
      });
      alert("Vitals saved to your nest!");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'vitals');
    } finally {
      setIsSavingVitals(false);
    }
  };

  const handleDeepAnalysis = async () => {
    setIsAnalyzingHealth(true);
    try {
      // Combine all relevant data for analysis
      const analysisData = {
        medicalHistory: userData?.medicalHistory,
        lifestyle: userData?.lifestyle,
        records: healthRecords.map(r => ({ title: r.title, type: r.type, content: r.content })),
        vitals: { calories, water },
        wearableTrends: {
          avgHeartRate: 72,
          avgSleep: 7.4,
          avgHRV: 58,
          weeklyHistory: mockChartData
        }
      };
      
      const analysis = await analyzeHealthData(analysisData);
      setHealthAnalysis(analysis);
      
      // Save prediction to Firestore
      try {
        await addDoc(collection(db, 'riskPredictions'), {
          userId: auth.currentUser?.uid,
          predictionDate: new Date().toISOString(),
          category: 'Deep Analysis',
          riskScore: healthScore,
          insights: JSON.stringify(analysis),
          recommendations: analysis.preventiveActions
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'riskPredictions');
      }
      
    } catch (err) {
      console.error("Deep analysis error:", err);
    } finally {
      setIsAnalyzingHealth(false);
    }
  };

  const handleScanPrescription = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await scanPrescription(base64);
        // Save to Firestore
        await addDoc(collection(db, 'healthRecords'), {
          userId: auth.currentUser?.uid,
          type: 'prescription',
          title: `Prescription from ${result.date || 'Unknown'}`,
          date: new Date().toISOString(),
          content: JSON.stringify(result),
          verified: true
        });
        
        // Refresh records
        const q = query(
          collection(db, 'healthRecords'),
          where('userId', '==', auth.currentUser!.uid),
          orderBy('date', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        setHealthRecords(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        alert("Prescription scanned and added to portfolio!");
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, 'healthRecords');
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInsuranceSearch = async () => {
    if (!insuranceQuery) return;
    setIsSearchingInsurance(true);
    try {
      const res = await searchInsuranceSchemes(insuranceQuery);
      setInsuranceResults(res);
    } catch (err) {
      console.error("Insurance search error:", err);
    } finally {
      setIsSearchingInsurance(false);
    }
  };

  return (
    <div className="min-h-screen bg-cloud-grey pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ollie's Wisdom Banner */}
        <AnimatePresence>
          {wiseWords && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-10 bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-owl-blue/5 border border-owl-blue/5 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-owl-blue/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <OllieMascot size={150} glow className="shrink-0" />
              <div className="relative z-10">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-insight-purple/10 text-insight-purple text-[10px] font-black uppercase tracking-widest mb-4">
                  <Sparkles size={12} />
                  <span>Ollie's Wisdom</span>
                </div>
                <p className="text-2xl font-display font-bold text-owl-blue leading-tight mb-2 italic">
                  "{wiseWords}"
                </p>
                <p className="text-gray-500 font-medium">Your health guardian has analyzed your latest trends.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Core Metrics */}
          <div className="lg:col-span-8 space-y-8">
            {/* Central Health Score Visualization */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Activity size={200} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Your Health Mirror</h2>
                  <div className="relative inline-block mb-6">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-100"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={552.92}
                        initial={{ strokeDashoffset: 552.92 }}
                        animate={{ strokeDashoffset: 552.92 - (552.92 * healthScore) / 100 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="text-wellness-green"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black text-owl-blue">{healthScore}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase">Optimal</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-4">
                    <div className="flex items-center text-wellness-green font-bold">
                      <TrendingUp size={16} className="mr-1" />
                      +2.4%
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Since last week</span>
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-owl-blue">Weekly Vitality</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockChartData}>
                        <defs>
                          <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                        />
                        <Area type="monotone" dataKey="hr" stroke="#22C55E" strokeWidth={4} fillOpacity={1} fill="url(#colorHr)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Avg HR</p>
                      <p className="text-lg font-black text-owl-blue">72</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Sleep</p>
                      <p className="text-lg font-black text-owl-blue">7.4h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">HRV</p>
                      <p className="text-lg font-black text-owl-blue">58ms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight Panel */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-insight-purple rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none feather-pattern" />
              <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform">
                <Brain size={120} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black">AI Predictive Insight</h3>
                </div>
                {predictions ? (
                  <div className="space-y-6">
                    <p className="text-xl font-medium leading-relaxed italic border-l-4 border-white/30 pl-6">
                      "{predictions.explanation}"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Priority Actions</h4>
                        <div className="space-y-4">
                          {predictions.lifestyleChanges.slice(0, 2).map((change, i) => (
                            <div key={i} className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-wellness-green rounded-full flex items-center justify-center shrink-0 mt-1">
                                <Zap size={14} />
                              </div>
                              <div>
                                <p className="font-bold text-sm">{change.action}</p>
                                <p className="text-xs text-white/60">{change.impact}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Risk Mitigation</h4>
                        <div className="space-y-4">
                          {predictions.riskLevels.slice(0, 2).map((risk, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="text-sm font-bold">{risk.problem}</span>
                              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${risk.level === 'High' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                {risk.level}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleDeepAnalysis}
                      disabled={isAnalyzingHealth}
                      className="w-full py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
                    >
                      {isAnalyzingHealth ? <RefreshCw className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      <span>{isAnalyzingHealth ? 'Analyzing Deep Trends...' : 'Run Deep Health Analysis'}</span>
                    </button>

                    <AnimatePresence>
                      {healthAnalysis && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-8 space-y-8 border-t border-white/10 pt-8"
                        >
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Lifestyle Risks</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {healthAnalysis.potentialRisks.map((risk, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold">{risk.condition}</span>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${risk.probability === 'High' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                      {risk.probability}
                                    </span>
                                  </div>
                                  <p className="text-xs text-white/60">{risk.reasoning}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Preventive Actions</h4>
                              <ul className="space-y-2">
                                {healthAnalysis.preventiveActions.map((action, i) => (
                                  <li key={i} className="text-sm flex items-start space-x-2">
                                    <CheckCircle2 size={14} className="text-wellness-green mt-1 shrink-0" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Dietary Wisdom</h4>
                              <ul className="space-y-2">
                                {healthAnalysis.dietaryRecommendations.map((diet, i) => (
                                  <li key={i} className="text-sm flex items-start space-x-2">
                                    <Utensils size={14} className="text-wellness-green mt-1 shrink-0" />
                                    <span>{diet}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-white/60 mb-4">Lifestyle Adjustments</h4>
                            <div className="flex flex-wrap gap-3">
                              {healthAnalysis.lifestyleAdjustments.map((adj, i) => (
                                <div key={i} className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-xs font-bold">
                                  {adj}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center italic text-white/50">
                    Ollie is analyzing your health twin...
                  </div>
                )}
              </div>
            </motion.div>

            {/* Wearable Metrics Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-owl-blue flex items-center">
                  <Watch className="w-6 h-6 mr-3 text-owl-brown" />
                  Wearable Trends
                </h3>
                <Link to="/wearables" className="text-xs font-black text-insight-purple uppercase tracking-widest hover:underline flex items-center">
                  Sync Device <ChevronRight size={14} className="ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Sleep Quality', value: '7.4h', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                  { label: 'Heart Rate', value: '72 bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
                  { label: 'Activity', value: '8,432', icon: Activity, color: 'text-wellness-green', bg: 'bg-green-50' },
                ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center text-center"
                >
                  <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <stat.icon size={32} />
                  </div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-owl-blue">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Health Portfolio */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-owl-blue flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-insight-purple" />
                  Health Portfolio
                </h2>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-insight-purple/10 text-insight-purple text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-insight-purple hover:text-white transition-all"
                >
                  Add Record
                </button>
              </div>
              
              <div className="space-y-4">
                {healthRecords.length > 0 ? (
                  healthRecords.map((record, i) => (
                    <div key={record.id} className="flex items-center justify-between p-6 bg-cloud-grey/30 rounded-[2rem] border border-gray-50 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6 text-insight-purple" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-owl-blue">{record.title}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                            {record.type} • {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {record.verified && (
                          <div className="px-3 py-1 bg-wellness-green/10 text-wellness-green text-[10px] font-black uppercase rounded-full">
                            AI Verified
                          </div>
                        )}
                        <button className="p-2 text-gray-400 hover:text-owl-blue">
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-cloud-grey/20 rounded-[2rem] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold italic">Your health portfolio is empty.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Wisdom Journal */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-owl-blue flex items-center">
                  <Brain className="w-6 h-6 mr-3 text-insight-purple" />
                  Daily Wisdom Journal
                </h2>
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-insight-purple w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Review Active</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="relative">
                  <textarea 
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="How are you feeling today? What did you eat? Any symptoms or activities you want Ollie to review?"
                    className="w-full h-40 p-6 bg-cloud-grey border border-gray-100 rounded-[2rem] focus:ring-2 focus:ring-owl-blue outline-none font-medium resize-none"
                  />
                  <button 
                    onClick={handleJournalSubmit}
                    disabled={isAnalyzingJournal || !journalEntry.trim()}
                    className="absolute bottom-4 right-4 px-6 py-3 bg-owl-blue text-white rounded-2xl font-bold hover:bg-owl-blue/90 transition-all shadow-lg flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isAnalyzingJournal ? <RefreshCw className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    <span>{isAnalyzingJournal ? 'Analyzing...' : 'Ask Ollie'}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {journalInsight && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 bg-insight-purple/5 border border-insight-purple/10 rounded-[2.5rem] space-y-6"
                    >
                      <div className="flex items-center space-x-3">
                        <OllieMascot size={60} />
                        <div>
                          <p className="text-xs font-black text-insight-purple uppercase tracking-widest">Ollie's Review</p>
                          <p className="text-lg font-bold text-owl-blue">Biological Patterns Detected</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed italic">"{journalInsight.analysis}"</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Potential Issues</h4>
                          <div className="flex flex-wrap gap-2">
                            {journalInsight.potentialIssues.map((issue, i) => (
                              <span key={i} className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black uppercase rounded-full border border-red-100">
                                {issue}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Matching Symptoms</h4>
                          <div className="flex flex-wrap gap-2">
                            {journalInsight.matchingSymptoms.map((symptom, i) => (
                              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-black uppercase rounded-full border border-blue-100">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-white rounded-3xl border border-insight-purple/10">
                        <h4 className="text-sm font-black text-owl-blue mb-2">Regulation Advice</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{journalInsight.regulationAdvice}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tools & Actions */}
          <div className="lg:col-span-4 space-y-8">
            {/* Vitality Tracker (Calories & Water) */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-owl-blue mb-6 flex items-center">
                <Utensils className="w-6 h-6 mr-3 text-wellness-green" />
                Vitality Tracker
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-cloud-grey rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Calories</p>
                    <div className="flex items-center justify-between">
                      <input 
                        type="number" 
                        value={calories}
                        onChange={(e) => setCalories(Number(e.target.value))}
                        className="w-20 bg-transparent text-2xl font-black text-owl-blue outline-none"
                      />
                      <span className="text-xs font-bold text-gray-400">kcal</span>
                    </div>
                  </div>
                  <div className="p-6 bg-cloud-grey rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Water</p>
                    <div className="flex items-center justify-between">
                      <input 
                        type="number" 
                        value={water}
                        onChange={(e) => setWater(Number(e.target.value))}
                        className="w-20 bg-transparent text-2xl font-black text-owl-blue outline-none"
                      />
                      <span className="text-xs font-bold text-gray-400">glasses</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSaveVitals}
                  disabled={isSavingVitals}
                  className="w-full py-4 bg-wellness-green text-white rounded-2xl font-bold hover:bg-wellness-green/90 transition-all shadow-lg shadow-wellness-green/20 flex items-center justify-center space-x-2"
                >
                  {isSavingVitals ? <RefreshCw className="animate-spin w-5 h-5" /> : <Plus size={20} />}
                  <span>{isSavingVitals ? 'Saving...' : 'Log Vitals'}</span>
                </button>
              </div>
            </div>

            {/* Scan Prescription Quick Action */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-insight-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-black text-owl-blue mb-4 flex items-center">
                <Camera className="w-6 h-6 mr-3 text-insight-purple" />
                Scan Prescription
              </h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">
                Upload your medical prescriptions. Ollie will extract the data and add it to your digital twin.
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="w-full py-4 bg-insight-purple text-white rounded-2xl font-bold hover:bg-insight-purple/90 transition-all shadow-lg shadow-insight-purple/20 flex items-center justify-center space-x-2"
              >
                {isScanning ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>{isScanning ? 'Scanning...' : 'Upload & Scan'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Digital Twin Simulation */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 scan-line opacity-20" />
              <h3 className="text-xl font-black text-owl-blue mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-insight-purple" />
                Digital Twin
              </h3>
              <div className="relative h-64 bg-cloud-grey rounded-3xl mb-6 flex items-center justify-center overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-t from-insight-purple/10 to-transparent" />
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-32 h-32 bg-insight-purple/20 rounded-full flex items-center justify-center"
                >
                  <Users size={64} className="text-insight-purple" />
                </motion.div>
                {/* Floating Risk Tags */}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-black text-red-500">
                  +30% Risk
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100 text-[10px] font-black text-wellness-green">
                  -18% Potential
                </div>
              </div>
              <button className="w-full py-4 bg-owl-blue text-white rounded-2xl font-bold hover:bg-owl-blue/90 transition-all shadow-lg shadow-owl-blue/20">
                Run Simulation
              </button>
            </div>

            {/* Insurance Finder */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-owl-blue mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-owl-brown" />
                Wisdom Shield
              </h3>
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={insuranceQuery}
                  onChange={(e) => setInsuranceQuery(e.target.value)}
                  placeholder="Diabetes cover..."
                  className="w-full pl-12 pr-4 py-4 bg-cloud-grey border border-gray-100 rounded-2xl focus:ring-2 focus:ring-owl-blue outline-none font-medium"
                />
              </div>
              <button 
                onClick={handleInsuranceSearch}
                disabled={isSearchingInsurance}
                className="w-full py-4 bg-cloud-grey text-owl-blue rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-200"
              >
                {isSearchingInsurance ? 'Searching...' : 'Find Insurance'}
              </button>
            </div>

            {/* Preventive Alerts */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100">
              <h3 className="text-xl font-black text-owl-blue mb-6 flex items-center">
                <AlertCircle className="w-6 h-6 mr-3 text-red-500" />
                Early Alerts
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Blood Sugar Screening', time: 'Due in 2 days', priority: 'High' },
                  { title: 'Annual Eye Exam', time: 'Due in 1 month', priority: 'Low' },
                ].map((alert, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-cloud-grey border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-owl-blue">{alert.title}</p>
                      <div className="flex items-center text-[10px] text-gray-400 font-bold mt-1">
                        <Clock size={10} className="mr-1" />
                        {alert.time}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${alert.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

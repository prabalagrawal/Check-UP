import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Watch, 
  Smartphone, 
  Plus, 
  Check, 
  RefreshCw, 
  Activity, 
  Moon, 
  Footprints, 
  Heart,
  AlertCircle,
  Save,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import OllieMascot from '../components/OllieMascot';
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

interface WearableData {
  heartRate: number;
  steps: number;
  sleepHours: number;
  hrv: number;
  timestamp: string;
  source: 'manual' | 'apple' | 'google' | 'fitbit' | 'garmin';
}

export default function Wearables() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [recentData, setRecentData] = useState<WearableData[]>([]);
  const [manualData, setManualData] = useState({
    heartRate: '',
    steps: '',
    sleepHours: '',
    hrv: ''
  });
  const [linkedDevices, setLinkedDevices] = useState<string[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser!.uid));
        if (userDoc.exists()) {
          setLinkedDevices(userDoc.data().linkedDevices || []);
        }

        const q = query(
          collection(db, 'wearableData'),
          where('userId', '==', auth.currentUser!.uid),
          orderBy('timestamp', 'desc'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => doc.data() as WearableData);
        setRecentData(data);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'wearableData');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setSaving(true);

    const newData: WearableData = {
      heartRate: Number(manualData.heartRate),
      steps: Number(manualData.steps),
      sleepHours: Number(manualData.sleepHours),
      hrv: Number(manualData.hrv),
      timestamp: new Date().toISOString(),
      source: 'manual'
    };

    try {
      await addDoc(collection(db, 'wearableData'), {
        ...newData,
        userId: auth.currentUser.uid
      });
      setRecentData([newData, ...recentData].slice(0, 5));
      setManualData({ heartRate: '', steps: '', sleepHours: '', hrv: '' });
      alert("Data saved to your nest!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'wearableData');
    } finally {
      setSaving(false);
    }
  };

  const handleLinkDevice = async (device: string) => {
    if (!auth.currentUser) return;
    setSyncing(device);

    // Simulate OAuth/Sync process
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const newDevices = [...linkedDevices, device];
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        linkedDevices: newDevices
      });
      setLinkedDevices(newDevices);
      
      // Add some mock synced data
      const mockData: WearableData = {
        heartRate: 72 + Math.floor(Math.random() * 10),
        steps: 8000 + Math.floor(Math.random() * 2000),
        sleepHours: 7 + Math.random(),
        hrv: 50 + Math.floor(Math.random() * 20),
        timestamp: new Date().toISOString(),
        source: device as any
      };
      
      await addDoc(collection(db, 'wearableData'), {
        ...mockData,
        userId: auth.currentUser.uid
      });
      setRecentData([mockData, ...recentData].slice(0, 5));
      
      alert(`${device.charAt(0).toUpperCase() + device.slice(1)} linked successfully!`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
    } finally {
      setSyncing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-owl-tan/10">
        <RefreshCw className="w-8 h-8 text-owl-blue animate-spin" />
      </div>
    );
  }

  const devices = [
    { id: 'apple', name: 'Apple Health', icon: Smartphone, color: 'text-red-500' },
    { id: 'google', name: 'Google Fit', icon: Activity, color: 'text-blue-500' },
    { id: 'fitbit', name: 'Fitbit', icon: Watch, color: 'text-teal-500' },
    { id: 'garmin', name: 'Garmin', icon: Activity, color: 'text-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-cloud-grey pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-black text-owl-blue mb-4">Sync Your Vitality</h1>
          <p className="text-gray-500 text-lg max-w-2xl font-medium">
            Connect your digital twin to real-time data or manually record your daily progress. Ollie is ready to analyze.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Devices & Logs */}
          <div className="lg:col-span-8 space-y-8">
            {/* Device Grid */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-owl-blue flex items-center">
                  <RefreshCw className="w-6 h-6 mr-3 text-insight-purple" />
                  Connect Devices
                </h2>
                <div className="px-3 py-1 bg-wellness-green/10 text-wellness-green text-[10px] font-black uppercase tracking-widest rounded-full">
                  Real-time Sync
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {devices.map((device) => {
                  const isLinked = linkedDevices.includes(device.id);
                  const isSyncing = syncing === device.id;

                  return (
                    <motion.div
                      key={device.id}
                      whileHover={{ y: -5 }}
                      className={`p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between ${
                        isLinked ? 'border-wellness-green bg-wellness-green/5' : 'border-gray-50 bg-cloud-grey/50 hover:border-owl-blue/20'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center ${device.color}`}>
                          <device.icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h3 className="font-bold text-owl-blue">{device.name}</h3>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {isLinked ? 'Connected' : 'Available'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => !isLinked && handleLinkDevice(device.id)}
                        disabled={isLinked || isSyncing}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isLinked 
                            ? 'bg-wellness-green text-white' 
                            : 'bg-white text-owl-blue hover:bg-owl-blue hover:text-white shadow-sm'
                        } disabled:opacity-50`}
                      >
                        {isSyncing ? (
                          <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : isLinked ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Plus className="w-5 h-5" />
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent Logs */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
              <h2 className="text-xl font-black text-owl-blue mb-8 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-owl-brown" />
                Vitality Stream
              </h2>
              <div className="space-y-4">
                {recentData.length > 0 ? (
                  recentData.map((data, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-6 bg-cloud-grey/30 rounded-[2rem] border border-gray-50 hover:bg-white hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          {data.source === 'manual' ? <Smartphone className="w-6 h-6 text-owl-brown" /> : <Watch className="w-6 h-6 text-owl-blue" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3 mb-1">
                            <span className="text-lg font-black text-owl-blue">{data.steps.toLocaleString()} Steps</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-sm font-bold text-gray-500">{data.heartRate} BPM</span>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                            {new Date(data.timestamp).toLocaleDateString()} • {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {data.source}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-wellness-green">{data.sleepHours.toFixed(1)}h Sleep</div>
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{data.hrv}ms HRV</div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-cloud-grey/20 rounded-[2rem] border-2 border-dashed border-gray-100">
                    <OllieMascot size={100} className="mx-auto mb-4 opacity-20" />
                    <p className="text-gray-400 font-bold italic">No vitality logs found yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Manual Entry & Insights */}
          <div className="lg:col-span-4 space-y-8">
            {/* Manual Entry Form */}
            <div className="bg-insight-purple rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Plus size={100} />
              </div>
              <h2 className="text-2xl font-black mb-8 flex items-center relative z-10">
                Manual Entry
              </h2>
              <form onSubmit={handleManualSubmit} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-2">Heart Rate</label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="number"
                      required
                      value={manualData.heartRate}
                      onChange={(e) => setManualData({ ...manualData, heartRate: e.target.value })}
                      placeholder="72 bpm"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none placeholder:text-white/20 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-2">Daily Steps</label>
                  <div className="relative">
                    <Footprints className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                    <input
                      type="number"
                      required
                      value={manualData.steps}
                      onChange={(e) => setManualData({ ...manualData, steps: e.target.value })}
                      placeholder="10,000"
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none placeholder:text-white/20 font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-2">Sleep</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={manualData.sleepHours}
                      onChange={(e) => setManualData({ ...manualData, sleepHours: e.target.value })}
                      placeholder="7.5h"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none placeholder:text-white/20 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/60 ml-2">HRV</label>
                    <input
                      type="number"
                      required
                      value={manualData.hrv}
                      onChange={(e) => setManualData({ ...manualData, hrv: e.target.value })}
                      placeholder="55ms"
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white outline-none placeholder:text-white/20 font-bold"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-white text-insight-purple py-5 rounded-2xl font-black flex items-center justify-center hover:bg-gray-100 transition-all disabled:opacity-50 shadow-xl"
                >
                  {saving ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-6 h-6 mr-3" />
                      Save Vitality
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Why Sync Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <AlertCircle size={80} />
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-owl-brown/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-owl-brown" />
                </div>
                <h3 className="font-black text-owl-blue">Why Sync?</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Linking your devices allows Ollie to analyze real-time trends in your heart rate, sleep, and activity. This data powers the <span className="text-insight-purple font-bold">Digital Twin</span> and provides more accurate preventive health predictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

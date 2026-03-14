import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  Brain, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  Watch, 
  Smartphone, 
  FileText, 
  Zap,
  ArrowUpRight,
  Sparkles,
  Search,
  Stethoscope,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import OllieMascot from '../components/OllieMascot';

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Section 2: Problem - Dark City Flight
  const cityOpacity = useTransform(smoothProgress, [0.1, 0.15, 0.25, 0.3], [0, 1, 1, 0]);
  const cityScale = useTransform(smoothProgress, [0.1, 0.3], [1.2, 1]);
  
  // Section 3: Data Collection
  const dataOpacity = useTransform(smoothProgress, [0.3, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const iconFlow = useTransform(smoothProgress, [0.3, 0.45], [100, -100]);

  // Section 4: AI Health Mirror
  const mirrorOpacity = useTransform(smoothProgress, [0.5, 0.55, 0.65, 0.7], [0, 1, 1, 0]);
  const ringRotate = useTransform(smoothProgress, [0.5, 0.7], [0, 360]);

  // Section 5: Digital Twin
  const twinOpacity = useTransform(smoothProgress, [0.7, 0.75, 0.85, 0.9], [0, 1, 1, 0]);
  
  // Section 8: Dashboard Preview
  const dashOpacity = useTransform(smoothProgress, [0.9, 0.95], [0, 1]);

  return (
    <div ref={containerRef} className="relative bg-cloud-grey">
      {/* SECTION 1 — HERO (Fixed) */}
      <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-white feather-pattern">
        <motion.div 
          style={{ opacity: useTransform(smoothProgress, [0, 0.1], [1, 0]) }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-owl-blue/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-insight-purple/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center px-4"
        >
          <OllieMascot size={350} glow className="mb-8 mx-auto" />
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-owl-blue mb-6 tracking-tighter"
          >
            See Your Health <br />
            <span className="text-insight-purple">Before It Happens.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto font-medium"
          >
            The AI-powered preventive health guardian that watches over your nest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link to="/auth" className="bg-owl-blue text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-owl-blue/90 transition-all shadow-2xl shadow-owl-blue/20 flex items-center mx-auto w-fit group">
              Start Your CheckUp
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-owl-blue/30"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* SECTION 2 — THE PROBLEM (Scroll Story) */}
      <motion.section 
        style={{ opacity: cityOpacity, scale: cityScale }}
        className="sticky top-0 h-screen w-full flex items-center justify-center bg-midnight overflow-hidden z-20"
      >
        <div className="absolute inset-0 opacity-30">
          {/* Dark City Grid Simulation */}
          <div className="w-full h-full grid grid-cols-12 gap-4 p-10">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-4xl text-center px-6">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="mb-12"
          >
            <OllieMascot size={200} interactive={false} className="mx-auto" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Health develops <span className="text-red-500">silently.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/70">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <AlertCircle className="w-10 h-10 text-red-500 mb-4 mx-auto" />
              <p className="font-medium">Symptoms are often the final stage, not the first.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <Zap className="w-10 h-10 text-yellow-500 mb-4 mx-auto" />
              <p className="font-medium">Fragmented data hides the full picture of your health.</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
              <Activity className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
              <p className="font-medium">Early detection increases survival rates by up to 90%.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 — DATA COLLECTION */}
      <motion.section 
        style={{ opacity: dataOpacity }}
        className="sticky top-0 h-screen w-full flex items-center justify-center bg-white feather-pattern z-30"
      >
        <div className="max-w-6xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-black text-owl-blue mb-6">Gathering the Wisdom.</h2>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Ollie connects to your entire health ecosystem. From the watch on your wrist to the reports in your drawer.
            </p>
            <div className="space-y-4">
              {[
                { icon: Watch, text: "Real-time Wearable Data", color: "text-blue-500" },
                { icon: Smartphone, text: "Fitness & Nutrition Apps", color: "text-green-500" },
                { icon: FileText, text: "Lab Reports & EHR", color: "text-purple-500" },
                { icon: Stethoscope, text: "Clinical Prescriptions", color: "text-red-500" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-cloud-grey border border-gray-100"
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                  <span className="font-bold text-owl-blue">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center">
            <OllieMascot size={300} className="z-10" />
            {/* Floating Icons Animation */}
            <div className="absolute inset-0 pointer-events-none">
              {[Watch, Smartphone, FileText, Activity, Heart].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [Math.random() * 400 - 200, 0],
                    y: [Math.random() * 400 - 200, 0],
                    opacity: [0, 1],
                    scale: [0.5, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="absolute p-4 bg-white rounded-2xl shadow-xl border border-gray-100"
                  style={{ top: '40%', left: '40%' }}
                >
                  <Icon className="w-8 h-8 text-owl-blue" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 4 — AI HEALTH MIRROR */}
      <motion.section 
        style={{ opacity: mirrorOpacity }}
        className="sticky top-0 h-screen w-full flex items-center justify-center bg-owl-blue overflow-hidden z-40"
      >
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            style={{ rotate: ringRotate }}
            className="w-full h-full border-[40px] border-white rounded-full scale-150 border-dashed"
          />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          <div className="relative inline-block mb-12">
            <OllieMascot size={250} glow interactive={false} className="relative z-10" />
            {/* AI Scanning Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-4 border-wellness-green border-dashed rounded-full scale-125 opacity-50"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-insight-purple border-dashed rounded-full scale-150 opacity-30"
            />
          </div>
          <h2 className="text-5xl font-black mb-6">The AI Health Mirror.</h2>
          <p className="text-xl text-white/70 mb-12">
            Ollie translates raw metrics into biological wisdom. We don't just show numbers; we show what they mean for your future.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Sleep Depth", value: "84%", color: "bg-indigo-500" },
              { label: "Heart Vitality", value: "Normal", color: "bg-red-500" },
              { label: "Stress Load", value: "Low", color: "bg-green-500" },
              { label: "Metabolic Rate", value: "Optimal", color: "bg-purple-500" }
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className={`w-3 h-3 rounded-full ${stat.color} mb-3 mx-auto`} />
                <p className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* SECTION 5 — DIGITAL HEALTH TWIN */}
      <motion.section 
        style={{ opacity: twinOpacity }}
        className="sticky top-0 h-screen w-full flex items-center justify-center bg-white nest-pattern z-50"
      >
        <div className="max-w-7xl w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[600px] flex items-center justify-center">
            {/* Holographic Avatar Simulation */}
            <div className="absolute inset-0 bg-gradient-to-t from-owl-blue/20 to-transparent rounded-full blur-3xl" />
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative z-10 w-64 h-[500px] bg-insight-purple/10 border-2 border-insight-purple/30 rounded-[100px] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 scan-line" />
              <div className="text-center p-8">
                <div className="w-32 h-32 bg-insight-purple/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-insight-purple" />
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-insight-purple/10 rounded-full" />
                  <div className="h-4 w-[80%] bg-insight-purple/10 rounded-full mx-auto" />
                  <div className="h-4 w-[60%] bg-insight-purple/10 rounded-full mx-auto" />
                </div>
              </div>
            </motion.div>
            
            <div className="absolute top-10 right-0 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-[200px]">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Current Path</p>
              <p className="text-2xl font-black text-red-500">+30%</p>
              <p className="text-xs text-gray-500">Cardiovascular Risk</p>
            </div>

            <div className="absolute bottom-10 left-0 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-[200px]">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">Improved Path</p>
              <p className="text-2xl font-black text-wellness-green">-18%</p>
              <p className="text-xs text-gray-500">With Ollie's Guidance</p>
            </div>
          </div>

          <div>
            <OllieMascot size={100} interactive={false} className="mb-6" />
            <h2 className="text-5xl font-black text-owl-blue mb-6">Your Digital Health Twin.</h2>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Ollie projects your future health based on current patterns. Simulate lifestyle changes and see the impact before you make them.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                "10-Year Risk Projections",
                "Lifestyle Impact Simulations",
                "Biological Age Tracking",
                "Metabolic Trend Analysis"
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-wellness-green/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-wellness-green" />
                  </div>
                  <span className="font-bold text-owl-blue">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* SECTION 8 — PRODUCT DASHBOARD PREVIEW */}
      <motion.section 
        style={{ opacity: dashOpacity }}
        className="relative min-h-screen w-full bg-cloud-grey py-32 z-[60]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-owl-blue mb-6">The Command Center for Your Nest.</h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              A premium, intuitive interface designed to give you total awareness of your health at a single glance.
            </p>
          </div>

          <div className="relative">
            {/* Dashboard Mockup */}
            <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(30,58,138,0.1)] border border-owl-blue/5 overflow-hidden">
              <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6 space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar Mock */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="flex items-center space-x-3 mb-10">
                    <div className="w-10 h-10 bg-owl-blue rounded-xl flex items-center justify-center">
                      <Heart className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-black text-owl-blue">CheckUp</span>
                  </div>
                  {[Activity, Shield, Users, Search, Brain].map((Icon, i) => (
                    <div key={i} className={`flex items-center space-x-4 p-4 rounded-2xl ${i === 0 ? 'bg-owl-blue text-white' : 'text-gray-400'}`}>
                      <Icon className="w-6 h-6" />
                      <span className="font-bold">Menu Item</span>
                    </div>
                  ))}
                </div>

                {/* Main Content Mock */}
                <div className="lg:col-span-9 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl bg-owl-blue text-white shadow-xl">
                      <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Health Score</p>
                      <p className="text-4xl font-black mb-4">84</p>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-wellness-green w-[84%]" />
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sleep Quality</p>
                      <p className="text-4xl font-black text-owl-blue mb-4">7.4h</p>
                      <div className="flex items-center text-wellness-green text-sm font-bold">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        +12%
                      </div>
                    </div>
                    <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Activity</p>
                      <p className="text-4xl font-black text-owl-blue mb-4">8.4k</p>
                      <p className="text-xs text-gray-400">Steps today</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2.5rem] bg-insight-purple/5 border border-insight-purple/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <Sparkles className="text-insight-purple w-6 h-6" />
                      <h3 className="text-xl font-bold text-owl-blue">AI Insight</h3>
                    </div>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      "Your sleep pattern indicates increased metabolic risk. Ollie suggests a 15-minute evening walk to stabilize your circadian rhythm."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-10 -right-10 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <Heart className="text-red-500 w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Heart Rate</p>
                <p className="text-xl font-black text-owl-blue">72 BPM</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-20 text-center">
            <Link to="/auth" className="bg-owl-blue text-white px-12 py-6 rounded-full text-2xl font-black hover:bg-owl-blue/90 transition-all shadow-2xl shadow-owl-blue/30 inline-flex items-center group">
              Join the Nest
              <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-white py-20 border-t border-gray-100 relative z-[70]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-owl-blue rounded-2xl flex items-center justify-center">
                  <Heart className="text-white w-8 h-8" />
                </div>
                <span className="text-3xl font-black text-owl-blue">CheckUp</span>
              </div>
              <p className="text-xl text-gray-500 max-w-md leading-relaxed">
                Empowering humanity with the wisdom of foresight. Detect, prevent, and thrive with Ollie the Owl.
              </p>
            </div>
            <div>
              <h4 className="font-black text-owl-blue mb-6 uppercase tracking-widest text-sm">Product</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><Link to="/features" className="hover:text-owl-blue transition-colors">Features</Link></li>
                <li><Link to="/dashboard" className="hover:text-owl-blue transition-colors">Dashboard</Link></li>
                <li><Link to="/wearables" className="hover:text-owl-blue transition-colors">Integrations</Link></li>
                <li><Link to="/pricing" className="hover:text-owl-blue transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-owl-blue mb-6 uppercase tracking-widest text-sm">Company</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li><Link to="/about" className="hover:text-owl-blue transition-colors">About Ollie</Link></li>
                <li><Link to="/privacy" className="hover:text-owl-blue transition-colors">Privacy Nest</Link></li>
                <li><Link to="/terms" className="hover:text-owl-blue transition-colors">Terms of Wisdom</Link></li>
                <li><Link to="/contact" className="hover:text-owl-blue transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100">
            <p className="text-gray-400 font-medium mb-4 md:mb-0">
              © 2026 CheckUp Health. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {/* Social Icons Placeholder */}
              <div className="w-10 h-10 bg-cloud-grey rounded-full" />
              <div className="w-10 h-10 bg-cloud-grey rounded-full" />
              <div className="w-10 h-10 bg-cloud-grey rounded-full" />
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Progress Indicator */}
      <motion.div 
        style={{ scaleX: smoothProgress }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-insight-purple origin-left z-[100]"
      />
    </div>
  );
}

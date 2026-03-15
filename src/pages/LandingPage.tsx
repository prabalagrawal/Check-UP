import React, { useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
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
  AlertCircle,
  Camera,
  RefreshCw,
  Wind,
  Layers,
  Eye,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import OllieMascot from '../components/OllieMascot';
import Logo from '../components/Logo';

// Particle component for the hero background
const Particle = ({ delay }: { delay: number; key?: any }) => {
  const size = useMemo(() => Math.random() * 4 + 2, []);
  const x = useMemo(() => Math.random() * 100, []);
  const y = useMemo(() => Math.random() * 100, []);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0],
        scale: [0, 1, 0],
        y: ["0%", "-20%"],
        x: ["0%", `${Math.random() * 10 - 5}%`]
      }}
      transition={{ 
        duration: Math.random() * 5 + 5,
        repeat: Infinity,
        delay,
        ease: "linear"
      }}
      className="absolute bg-owl-blue/20 rounded-full"
      style={{ 
        width: size, 
        height: size,
        left: `${x}%`,
        top: `${y}%`
      }}
    />
  );
};

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative bg-white selection:bg-owl-blue selection:text-white overflow-x-hidden">
      {/* HERO SECTION: THE WELCOME */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-6 overflow-hidden bg-owl-tan/30">
        <div className="absolute inset-0 z-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <Particle key={i} delay={i * 0.3} />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <OllieMascot size={320} glow className="mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            <h1 className="text-[10vw] md:text-[7vw] font-black leading-[0.9] tracking-tighter text-owl-blue mb-8 uppercase">
              Welcome to <br />
              <span className="text-insight-purple italic font-serif lowercase">The Nest.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12 font-medium">
              "Hoot! I am Ollie. I see the health patterns hidden in the dark. Let me guide you through a journey of biological wisdom and preventive foresight."
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
              <Link to="/auth" className="group relative px-12 py-6 bg-owl-blue text-white rounded-[2rem] text-xl font-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-owl-blue/30">
                <span className="relative z-10 flex items-center">
                  Begin Your Journey
                  <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-insight-purple to-owl-blue opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <a href="#journey" className="text-owl-blue font-black uppercase tracking-widest text-sm hover:underline underline-offset-8">
                How it works
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-owl-blue/20 flex flex-col items-center"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* SECTION 1: THE PROBLEM - THE DARK BEFORE THE DAWN */}
      <section className="py-32 px-6 bg-midnight text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 nest-pattern" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-3 px-4 py-2 bg-red-500/10 rounded-full mb-8 border border-red-500/20">
              <Eye className="text-red-500 w-5 h-5" />
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">The Hidden Truth</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
              Don't fly <br /> 
              <span className="text-white/30 italic font-serif lowercase">blind.</span>
            </h2>
            <p className="text-xl text-white/50 leading-relaxed mb-12 max-w-lg">
              "Most health issues develop in the shadows of fragmented data. By the time you feel it, the path is already steep. I see the subtle shifts before they become symptoms."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                <p className="text-4xl font-black text-white mb-2">70%</p>
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Chronic diseases are preventable</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
                <p className="text-4xl font-black text-white mb-2">10x</p>
                <p className="text-sm text-white/40 font-bold uppercase tracking-widest">Better outcomes with foresight</p>
              </div>
            </div>
          </motion.div>
          <div className="relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative z-10"
            >
              <OllieMascot size={350} interactive={false} className="grayscale brightness-50 contrast-125" />
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE JOURNEY - GUIDED STEPS */}
      <section id="journey" className="py-32 px-6 bg-owl-tan/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-insight-purple mb-6">The Guided Path</h2>
            <h3 className="text-5xl md:text-8xl font-black text-owl-blue tracking-tighter leading-[0.85]">
              Four steps to <br /> biological wisdom.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { 
                step: "01", 
                title: "Join the Nest", 
                desc: "Create your secure profile. Your data is encrypted and owned by you.",
                icon: <Lock className="w-6 h-6" />,
                color: "bg-owl-blue"
              },
              { 
                step: "02", 
                title: "Sync Your Wings", 
                desc: "Connect your wearables. Ollie begins monitoring your vital rhythms 24/7.",
                icon: <Watch className="w-6 h-6" />,
                color: "bg-insight-purple"
              },
              { 
                step: "03", 
                title: "Consult the Wise", 
                desc: "Share your history with top doctors who use Ollie's insights for better care.",
                icon: <Stethoscope className="w-6 h-6" />,
                color: "bg-wellness-green"
              },
              { 
                step: "04", 
                title: "Protect the Future", 
                desc: "Get better insurance rates by proving your commitment to health.",
                icon: <Shield className="w-6 h-6" />,
                color: "bg-owl-forest"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 flex flex-col h-full"
              >
                <div className={`w-12 h-12 ${item.color} text-white rounded-xl flex items-center justify-center mb-6 shadow-lg`}>
                  {item.icon}
                </div>
                <span className="text-4xl font-black text-owl-blue/10 mb-4 font-display">{item.step}</span>
                <h4 className="text-2xl font-black text-owl-blue mb-4">{item.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed flex-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: OLLIE'S WISDOM - THE TECH */}
      <section id="wisdom" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-insight-purple mb-6">Ollie's Wisdom</h2>
              <h3 className="text-5xl md:text-7xl font-black text-owl-blue tracking-tighter leading-[0.85] mb-8">
                Seeing what <br /> others miss.
              </h3>
              <p className="text-xl text-gray-500 leading-relaxed mb-12">
                "I don't just collect data; I interpret it. I look for the 'biological signature' of your health, predicting risks months before they manifest."
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-6 bg-owl-tan rounded-3xl">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Brain className="text-insight-purple" />
                  </div>
                  <div>
                    <p className="font-black text-owl-blue">AI Health Mirror</p>
                    <p className="text-sm text-gray-500">Translating metrics into actionable wisdom.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-wellness-green/5 rounded-3xl border border-wellness-green/10">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Users className="text-wellness-green" />
                  </div>
                  <div>
                    <p className="font-black text-owl-blue">Digital Twin Simulations</p>
                    <p className="text-sm text-gray-500">Test lifestyle changes in a virtual environment.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <OllieMascot size={400} glow />
              </motion.div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 max-w-xs">
                <div className="flex items-center space-x-3 mb-4">
                  <Sparkles className="text-insight-purple w-5 h-5" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Ollie's Insight</p>
                </div>
                <p className="text-sm font-bold text-owl-blue leading-relaxed">
                  "Your heart rate variability suggests you need 2 more hours of deep rest tonight to maintain peak metabolic efficiency."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: VISION - THE BRIGHT FUTURE */}
      <section id="vision" className="py-40 px-6 bg-owl-blue text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 feather-pattern" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <Sparkles className="w-20 h-20 text-insight-purple mx-auto mb-16" />
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-16 leading-[0.85]">
            A future where <br /> no one flies alone.
          </h2>
          <p className="text-2xl text-white/60 font-medium mb-20 leading-relaxed max-w-3xl mx-auto">
            "We are building a world where health is a guided journey, not a guessing game. Join the thousands of wise souls already in the Nest."
          </p>
          <Link to="/auth" className="group relative px-16 py-8 bg-white text-owl-blue rounded-[2.5rem] text-3xl font-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/20 inline-block">
            <span className="relative z-10 flex items-center">
              Join the Nest
              <ArrowRight className="ml-4 w-10 h-10 group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-24">
            <div className="mb-12 md:mb-0">
              <div className="flex items-center space-x-3 mb-8">
                <Logo size="sm" />
                <span className="text-3xl font-black text-owl-blue tracking-tighter">CheckUp</span>
              </div>
              <p className="text-xl text-gray-400 max-w-sm font-medium">
                The AI-powered preventive health guardian for you and your family.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-owl-blue mb-8">Product</h4>
                <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li><a href="#journey" className="hover:text-owl-blue transition-colors">The Journey</a></li>
                  <li><a href="#wisdom" className="hover:text-owl-blue transition-colors">Ollie's Wisdom</a></li>
                  <li><Link to="/wearables" className="hover:text-owl-blue transition-colors">Vitality Sync</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-owl-blue mb-8">Company</h4>
                <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li><Link to="/about" className="hover:text-owl-blue transition-colors">The Owl's Story</Link></li>
                  <li><Link to="/doctors" className="hover:text-owl-blue transition-colors">The Doctor's Nest</Link></li>
                  <li><Link to="/insurance" className="hover:text-owl-blue transition-colors">The Wisdom Shield</Link></li>
                </ul>
              </div>
              <div className="hidden md:block">
                <h4 className="text-xs font-black uppercase tracking-widest text-owl-blue mb-8">Legal</h4>
                <ul className="space-y-4 text-gray-400 font-bold text-sm">
                  <li><a href="#" className="hover:text-owl-blue transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-owl-blue transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100">
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-8 md:mb-0">
              © 2026 CheckUp Health. All rights reserved.
            </p>
            <div className="flex space-x-8">
              <div className="w-10 h-10 bg-cloud-grey rounded-xl flex items-center justify-center text-owl-blue hover:bg-owl-blue hover:text-white transition-all cursor-pointer">
                <Zap size={20} />
              </div>
              <div className="w-10 h-10 bg-cloud-grey rounded-xl flex items-center justify-center text-owl-blue hover:bg-owl-blue hover:text-white transition-all cursor-pointer">
                <Layers size={20} />
              </div>
              <div className="w-10 h-10 bg-cloud-grey rounded-xl flex items-center justify-center text-owl-blue hover:bg-owl-blue hover:text-white transition-all cursor-pointer">
                <Lock size={20} />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

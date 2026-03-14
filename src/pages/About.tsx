import { motion } from 'framer-motion';
import { Heart, Shield, Eye, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-24 bg-owl-tan/30 feather-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold text-owl-blue mb-8">The Wisdom of the Nest</h1>
            <p className="text-2xl text-owl-brown max-w-3xl mx-auto leading-relaxed">
              To transform healthcare from a reactive system into a proactive sanctuary that preserves your health with the foresight of an owl.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="branch-divider" />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold text-owl-blue mb-8">Why Ollie's Wisdom?</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Most chronic diseases develop silently, like a predator in the night. By the time symptoms appear, the damage is often done. 
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We believe that your health data holds the key to your future. Ollie uses advanced AI to find the "Health Drift" that human eyes might miss, seeing through the darkness of uncertainty.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-4xl font-bold text-owl-brown mb-2">90%</div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Foresight Rate</p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-owl-brown mb-2">1M+</div>
                  <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Wisdom Points Analyzed</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "Foresight", icon: Eye, color: "bg-owl-blue/5 text-owl-blue" },
                { title: "Wisdom", icon: Heart, color: "bg-owl-brown/5 text-owl-brown" },
                { title: "Precision", icon: Target, color: "bg-owl-forest/5 text-owl-forest" },
                { title: "Security", icon: Shield, color: "bg-owl-tan text-owl-blue" },
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.05 }}
                  className={`p-8 rounded-[2.5rem] ${item.color} flex flex-col items-center justify-center text-center shadow-sm border border-black/5`}
                >
                  <item.icon className="w-10 h-10 mb-4" />
                  <h3 className="text-xl font-bold">{item.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="branch-divider" />

      <section className="py-24 bg-owl-blue text-white relative overflow-hidden feather-pattern">
        <div className="absolute top-0 right-0 p-12 opacity-10 animate-feather">
          <img src="/ollie-logo.png" alt="Ollie" className="w-64 h-64 brightness-0 invert" referrerPolicy="no-referrer" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-8">
            <img src="/ollie-logo.png" alt="Ollie" className="w-24 h-24 mx-auto brightness-0 invert" referrerPolicy="no-referrer" />
          </div>
          <h2 className="text-4xl font-bold mb-8">The Guardian of Your Nest</h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12">
            Ollie the Owl is more than just a mascot. He represents our core philosophy: the ability to see clearly in the dark, to observe subtle movements, and to act with wisdom before it's too late.
          </p>
          <div className="inline-block border-2 border-white/20 rounded-full px-8 py-4 text-lg font-bold">
            "Watch Today. Protect Tomorrow."
          </div>
        </div>
      </section>
    </div>
  );
}

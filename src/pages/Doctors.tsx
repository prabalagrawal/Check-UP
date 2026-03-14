import { motion } from 'framer-motion';
import { Stethoscope, Database, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Doctors() {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-20 bg-owl-blue text-white relative overflow-hidden feather-pattern">
        <div className="absolute top-0 right-0 p-12 opacity-10 animate-feather">
          <img src="/ollie-logo.png" alt="Ollie" className="w-64 h-64 brightness-0 invert" referrerPolicy="no-referrer" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">The Doctor's Nest: Wisdom for Providers</h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Ollie bridges the gap between clinical visits and daily life. Access your patients' verified health history and real-time wearable trends with the sharp eyes of an owl.
          </p>
        </div>
      </section>

      <div className="branch-divider" />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Verified Nest History",
                desc: "Access a unified, patient-authorized digital portfolio of lab reports, prescriptions, and past diagnoses.",
                icon: Database
              },
              {
                title: "Lifestyle Wisdom",
                desc: "See the full picture with patient-shared data from wearables: sleep, activity, and heart rate trends.",
                icon: Activity
              },
              {
                title: "Owl-Eye Warnings",
                desc: "Our AI highlights 'Health Drift' patterns, helping you identify risks before they manifest as clinical symptoms.",
                icon: Stethoscope
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="text-center p-8 rounded-[2.5rem] bg-owl-tan/20 border border-owl-brown/5"
              >
                <div className="w-16 h-16 bg-owl-blue/10 text-owl-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-owl-blue">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="branch-divider" />

      <section className="py-20 bg-owl-tan/30 feather-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="owl-card flex flex-col lg:flex-row items-center gap-12 nest-pattern">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-bold text-owl-blue mb-6">Join Ollie's Provider Network</h2>
              <p className="text-lg text-gray-600 mb-8">
                Reduce administrative burden and focus on what matters: patient care. Our platform ensures data is structured, verified, and ready for your wise review.
              </p>
              <ul className="space-y-4 mb-8">
                {["HIPAA Compliant Data Sharing", "Structured Lab Report Analysis", "Patient Adherence Tracking", "Seamless Integration with EMRs"].map((item) => (
                  <li key={item} className="flex items-center text-gray-700 font-medium">
                    <ShieldCheck className="text-owl-forest w-5 h-5 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="bg-owl-blue text-white px-8 py-4 rounded-full font-bold hover:bg-owl-blue/90 transition-all flex items-center shadow-lg shadow-owl-blue/20">
                Register as a Wise Provider
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
            <div className="lg:w-1/2 bg-white/50 backdrop-blur-sm border border-owl-brown/10 rounded-[2.5rem] h-80 w-full flex flex-col items-center justify-center p-8 text-center">
              <img src="/ollie-logo.png" alt="Ollie" className="w-24 h-24 mb-4 opacity-20" referrerPolicy="no-referrer" />
              <span className="text-owl-brown font-medium">Provider Nest Preview</span>
              <p className="text-sm text-gray-400 mt-2">Coming soon to your clinic</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

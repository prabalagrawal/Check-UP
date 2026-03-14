import { Shield, BarChart3, FileCheck, Zap, ArrowRight } from 'lucide-react';

export default function Insurance() {
  return (
    <div className="bg-owl-tan/20 min-h-screen">
      <section className="py-20 bg-white border-b border-owl-brown/10 feather-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-owl-blue/10 text-owl-blue text-sm font-medium mb-6">
            Wisdom Shield: For Payers & Insurance Providers
          </div>
          <h1 className="text-5xl font-bold text-owl-blue mb-6 leading-tight">
            Owl-Eye Risk Assessment <br />
            <span className="text-owl-brown">Powered by Wisdom</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ollie provides insurance companies with a transparent, verified health history of users, enabling better risk assessment with the foresight of an owl.
          </p>
        </div>
      </section>

      <div className="branch-divider" />

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-owl-blue mb-8">Transforming Underwriting with Ollie's Sight</h2>
              <div className="space-y-8">
                {[
                  {
                    title: "Verified Nest History",
                    desc: "Eliminate manual data entry and errors with a digital health record verified by medical providers.",
                    icon: FileCheck
                  },
                  {
                    title: "Predictive Wisdom Modeling",
                    desc: "Leverage our AI-driven 'Digital Health Twin' to understand long-term health trajectories of policyholders.",
                    icon: BarChart3
                  },
                  {
                    title: "Nest Protection",
                    desc: "Blockchain-inspired verification of medical records ensures that every claim is backed by authentic data.",
                    icon: Shield
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 border border-owl-brown/10">
                      <item.icon className="text-owl-brown w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-owl-blue mb-2">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-owl-blue rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl feather-pattern">
              <div className="absolute top-0 right-0 p-8 opacity-10 animate-feather">
                <img src="/ollie-logo.png" alt="Ollie" className="w-48 h-48 brightness-0 invert" referrerPolicy="no-referrer" />
              </div>
              <div className="relative z-10">
                <Zap className="w-12 h-12 text-owl-tan mb-6" />
                <h3 className="text-3xl font-bold mb-6">The Preventive Advantage</h3>
                <p className="text-white/80 text-lg mb-8 leading-relaxed">
                  Insurance companies that encourage preventive care see a **32% reduction** in long-term chronic disease claims. Ollie incentivizes users to stay healthy, creating a win-win for both payers and policyholders.
                </p>
                <div className="space-y-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <p className="text-sm font-medium">Average Claim Reduction</p>
                    <p className="text-3xl font-bold text-owl-forest">24%</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                    <p className="text-sm font-medium">User Engagement Rate</p>
                    <p className="text-3xl font-bold text-owl-forest">78%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="branch-divider" />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8 text-owl-blue">Ready to modernize your risk assessment with Ollie?</h2>
          <button className="bg-owl-blue text-white px-10 py-4 rounded-full font-bold hover:bg-owl-blue/90 transition-all flex items-center mx-auto shadow-lg shadow-owl-blue/20">
            Contact Enterprise Sales
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}

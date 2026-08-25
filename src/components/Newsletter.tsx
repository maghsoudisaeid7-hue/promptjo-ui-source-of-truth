import React, { useState } from 'react';
import { NewsletterConfig } from '../types';
import { Mail, CheckCircle } from 'lucide-react';

interface NewsletterProps {
  config: NewsletterConfig;
  onSubscribe: (email: string) => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ config, onSubscribe }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubscribe(email);
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <section className="w-full bg-[#1C1F26] py-16 border-b border-[#3A4150]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-[#282D38] border border-[#3A4150] p-8 md:p-12 shadow-2xl">
          
          {/* Background Glow */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#D97757]/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Right Side: Envelope Icon & Titles */}
            <div className="lg:col-span-6 flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#D97757]/15 border border-[#D97757]/30 flex items-center justify-center text-[#D97757] shrink-0 shadow-glow-sm">
                <Mail size={28} />
              </div>
              <div className="space-y-2 text-right">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                  {config.title}
                </h2>
                <p className="text-[#A8B0C0] text-xs sm:text-sm leading-relaxed">
                  {config.subtitle}
                </p>
              </div>
            </div>

            {/* Left Side: Form Input & Button */}
            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                  <CheckCircle size={20} />
                  <span>ایمیل شما با موفقیت ثبت شد! سپاسگزاریم.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                  <div className="relative flex items-center bg-transparent border border-[#3A4150] hover:border-[#D97757] focus-within:border-[#D97757] p-1.5 rounded-2xl transition-colors duration-200">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={config.inputPlaceholder}
                      className="w-full bg-transparent px-4 py-3 text-[#F8FAFC] placeholder-[#A8B0C0] text-sm focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D97757] to-[#E58A66] text-white font-bold text-sm shadow-glow-sm hover:brightness-110 active:scale-95 transition-all duration-200 shrink-0"
                    >
                      {config.buttonText}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#A8B0C0] text-right pr-2">
                    {config.disclaimer}
                  </p>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

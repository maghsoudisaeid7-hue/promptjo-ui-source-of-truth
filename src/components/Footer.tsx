import React from 'react';
import { FooterConfig } from '../types';
import { Youtube, Disc as Discord, Twitter, Instagram, Send } from 'lucide-react';

interface FooterProps {
  config: FooterConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="w-full bg-[#232833] border-t border-[#3A4150] text-[#A8B0C0] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#3A4150]">
          
          {/* Logo & Description Column (RTL Right side) */}
          <div className="lg:col-span-4 space-y-4 text-right">
            <a href="#" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97757] to-[#E58A66] flex items-center justify-center text-white shadow-glow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="flex items-center text-2xl font-bold tracking-tight">
                <span className="text-white">{config.logoTextPrimary}</span>
                <span className="text-[#D97757] ml-0.5">{config.logoTextSecondary}</span>
              </div>
            </a>
            
            <p className="text-xs sm:text-sm text-[#A8B0C0] leading-relaxed max-w-sm">
              {config.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={config.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#282D38] border border-[#3A4150] flex items-center justify-center text-slate-300 hover:text-[#D97757] hover:border-[#D97757] transition-all duration-200"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
              <a
                href={config.socialLinks.discord}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#282D38] border border-[#3A4150] flex items-center justify-center text-slate-300 hover:text-[#D97757] hover:border-[#D97757] transition-all duration-200"
                aria-label="Discord"
              >
                <Discord size={18} />
              </a>
              <a
                href={config.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#282D38] border border-[#3A4150] flex items-center justify-center text-slate-300 hover:text-[#D97757] hover:border-[#D97757] transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href={config.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#282D38] border border-[#3A4150] flex items-center justify-center text-slate-300 hover:text-[#D97757] hover:border-[#D97757] transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href={config.socialLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-[#282D38] border border-[#3A4150] flex items-center justify-center text-slate-300 hover:text-[#D97757] hover:border-[#D97757] transition-all duration-200"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
            </div>
          </div>

          {/* Navigation Link Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-right">
            {config.columns.map((col, idx) => (
              <div key={idx} className="space-y-3">
                {col.titleUrl ? (
                  <a
                    href={col.titleUrl}
                    className="text-sm font-bold text-white tracking-wide hover:text-[#D97757] transition-colors inline-block"
                  >
                    {col.title}
                  </a>
                ) : (
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {col.title}
                  </h3>
                )}
                <ul className="space-y-2 text-xs">
                  {col.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a
                        href={link.href}
                        className="hover:text-[#D97757] transition-colors duration-150 inline-block py-0.5"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span>{config.copyrightText}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-2.5 py-1 rounded-md bg-[#121824] border border-[#1F293D] text-slate-400 text-[11px] font-mono">
              {config.versionText}
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

import React from 'react';
import { HeartPulse, ShieldAlert, Award, Phone, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {t('appName')}
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Empowering rural and remote communities across India with instant AI symptom triage, verified Primary Health Centre (PHC) directories, doctor consultations, and multilingual health guidance.
            </p>
            <div className="p-3 bg-stone-800/80 rounded-lg border border-stone-700 text-xs text-stone-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {t('medicalDisclaimer')}
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  {t('navAssistant')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('hospitals')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  {t('navHospitals')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  {t('navDoctors')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('awareness')}
                  className="hover:text-emerald-400 transition cursor-pointer text-left"
                >
                  {t('navAwareness')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Initiatives & Emergency */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              National Helplines
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-400" />
                <span className="font-semibold text-white">108</span> — Emergency Ambulance (Toll-Free)
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-white">112</span> — National Emergency Service
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-white">14555</span> — Ayushman Bharat (PM-JAY)
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span className="font-semibold text-white">14416</span> — Tele-MANAS Mental Health
              </li>
            </ul>
            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400">
              Supporting National Health Mission (NHM) objectives for universal primary healthcare coverage in rural India.
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © {new Date().getFullYear()} Gramin Swasthya Seva. Rural Community Health Initiative.
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Rural Triage Engine Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export const EmergencyBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-red-700 text-white text-xs sm:text-sm font-medium border-b border-red-800 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <span className="font-bold tracking-wide uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            {t('emergencyBarTitle')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <a
            href="tel:108"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-red-700 rounded-md font-bold hover:bg-red-50 transition shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>108 {t('emergencyAmbulance')}</span>
          </a>

          <a
            href="tel:112"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-800/80 hover:bg-red-800 text-white rounded-md transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>112 {t('emergencyGeneral')}</span>
          </a>

          <a
            href="tel:14555"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 bg-red-800/80 hover:bg-red-800 text-white rounded-md transition"
          >
            <span>{t('emergencyAyushman')}</span>
          </a>

          <a
            href="tel:14416"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 bg-red-800/80 hover:bg-red-800 text-white rounded-md transition"
          >
            <span>{t('emergencyTeleManas')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

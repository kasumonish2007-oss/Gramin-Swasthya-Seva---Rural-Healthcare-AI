import React, { useState } from 'react';
import {
  HeartPulse,
  MapPin,
  Stethoscope,
  BookOpen,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Globe,
  Activity,
  ShieldCheck,
  ChevronDown,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Language } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t('navHome'), icon: HeartPulse },
    { id: 'assistant', label: t('navAssistant'), icon: Activity },
    { id: 'hospitals', label: t('navHospitals'), icon: MapPin },
    { id: 'doctors', label: t('navDoctors'), icon: Stethoscope },
    { id: 'awareness', label: t('navAwareness'), icon: BookOpen },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (user?.role === 'admin') {
      setActiveTab('admin-dashboard');
    } else {
      setActiveTab('patient-dashboard');
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-emerald-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <HeartPulse className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-emerald-950 tracking-tight">
                  {t('appName')}
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                  India Rural Health
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">
                {language === 'hi'
                  ? 'ग्रामीण स्वास्थ्य सहायता एवं प्रारंभिक रोग पहचान'
                  : language === 'te'
                  ? 'గ్రామీణ ఆరోగ్య సహాయం & ముందస్తు వ్యాధి గుర్తింపు'
                  : 'AI Health Assistance & Early Disease Detection'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Language & Account */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 transition"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'తెలుగు'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-50">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${
                      language === 'en' ? 'font-bold text-emerald-700' : 'text-stone-700'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${
                      language === 'hi' ? 'font-bold text-emerald-700' : 'text-stone-700'
                    }`}
                  >
                    <span>हिन्दी</span>
                    {language === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('te');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${
                      language === 'te' ? 'font-bold text-emerald-700' : 'text-stone-700'
                    }`}
                  >
                    <span>తెలుగు</span>
                    {language === 'te' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* WhatsApp Share Button */}
            <a
              href="https://api.whatsapp.com/send?text=Gramin%20Swasthya%20Seva%20-%20Rural%20Healthcare%20AI%0A%F0%9F%8F%A5%20Free%20AI%20symptom%20check%2C%20find%20nearby%20PHCs%2C%20and%20consult%20doctors%3A%0Ahttps%3A%2F%2Fais-pre-5aglxm6urd6dvbli4473os-57751676092.asia-east1.run.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
              title="Share on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Auth / Profile Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDashboardClick}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-xs cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="px-1.5 py-0.2 bg-emerald-900 text-emerald-100 text-[10px] rounded uppercase font-bold">
                      Admin
                    </span>
                  )}
                </button>
                <button
                  onClick={() => logout()}
                  title={t('navLogout')}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition shadow-xs cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t('navLogin')}</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Quick lang switch for mobile */}
            <button
              onClick={() => {
                const nextLang: Language = language === 'en' ? 'hi' : language === 'hi' ? 'te' : 'en';
                setLanguage(nextLang);
              }}
              className="px-2 py-1 text-xs font-bold rounded bg-stone-100 text-stone-700 border border-stone-200"
            >
              {language.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-stone-600 hover:text-emerald-700 hover:bg-stone-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <a
            href="https://api.whatsapp.com/send?text=Gramin%20Swasthya%20Seva%20-%20Rural%20Healthcare%20AI%0A%F0%9F%8F%A5%20Free%20AI%20symptom%20check%2C%20find%20nearby%20PHCs%2C%20and%20consult%20doctors%3A%0Ahttps%3A%2F%2Fais-pre-5aglxm6urd6dvbli4473os-57751676092.asia-east1.run.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp (व्हाट्सएप पर शेयर करें)</span>
          </a>

          <div className="pt-2 border-t border-stone-100">
            {user ? (
              <div className="space-y-2">
                <button
                  onClick={handleDashboardClick}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-emerald-50 text-emerald-900 rounded-lg text-sm font-bold"
                >
                  <span className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-emerald-700" />
                    {user.name} ({user.role === 'admin' ? 'Admin' : 'Patient'})
                  </span>
                  <span className="text-xs text-emerald-700">Open Dashboard →</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('navLogout')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  openAuthModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-700 text-white rounded-lg font-bold text-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span>{t('navLogin')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

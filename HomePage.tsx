import React from 'react';
import {
  Activity,
  MapPin,
  Stethoscope,
  BookOpen,
  ShieldAlert,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  HeartHandshake,
  Users,
  Building2,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { AudioPlayer } from '../components/AudioPlayer.tsx';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  openAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, openAuthModal }) => {
  const { t, language, setLanguage } = useLanguage();

  const teluguNoticeMessage =
    'ఆరోగ్యమే మహాభాగ్యం. ఏ అనారోగ్య లక్షణాలనైనా నిర్లక్ష్యం చేయవద్దు. మీ సమీప ప్రాథమిక ఆరోగ్య కేంద్రంలో ఉచిత పరీక్షలు మరియు మందులు అందుబాటులో ఉన్నాయి.';

  const hindiNoticeMessage =
    'स्वास्थ्य ही सबसे बड़ा धन है। किसी भी बीमारी के शुरुआती लक्षणों को नजरअंदाज न करें। प्राथमिक स्वास्थ्य केंद्र में मुफ्त जांच और दवाएं उपलब्ध हैं।';

  const englishNoticeMessage =
    'Health is the greatest wealth. Never ignore early disease warning signs. Free screening, diagnostics, and essential medicines are available at your local Primary Health Centre.';

  const awarenessMessage =
    language === 'hi'
      ? hindiNoticeMessage
      : language === 'te'
      ? teluguNoticeMessage
      : englishNoticeMessage;

  return (
    <div className="space-y-12 pb-16">
      {/* Awareness Ticker with Direct Telugu Voice Button */}
      <div className="bg-emerald-950 text-emerald-100 py-2.5 px-4 border-b border-emerald-900 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-center md:text-left flex-wrap">
            <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-bold text-xs uppercase tracking-wide">
              {language === 'te' ? 'గ్రామ ఆరోగ్య ప్రకటన' : language === 'hi' ? 'सामुदायिक सूचना' : 'Notice'}
            </span>
            <span className="font-medium text-stone-100">{awarenessMessage}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            {/* Direct Telugu Voice Player */}
            <AudioPlayer
              text={teluguNoticeMessage}
              forceLanguage="te"
              label="🔊 తెలుగులో వినండి (Telugu)"
              className="bg-teal-700 hover:bg-teal-600 text-white font-bold border-teal-600 shadow-xs"
            />

            {/* Current Active Language Audio Player if not already Telugu */}
            {language !== 'te' && (
              <AudioPlayer
                text={awarenessMessage}
                label={language === 'hi' ? 'हिन्दी में सुनें' : 'Listen English'}
                className="bg-emerald-800 text-emerald-100 border-emerald-700 hover:bg-emerald-700"
              />
            )}

            {/* Quick Language Switcher Buttons */}
            <div className="flex items-center gap-1 bg-emerald-900/80 p-0.5 rounded-lg border border-emerald-800 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  language === 'te' ? 'bg-emerald-500 text-stone-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  language === 'hi' ? 'bg-emerald-500 text-stone-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  language === 'en' ? 'bg-emerald-500 text-stone-950 shadow-xs' : 'text-emerald-200 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle background overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-xs sm:text-sm font-semibold">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>National Rural Health Assistance Portal</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* Quick Voice Overview in Telugu */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <AudioPlayer
                text="గ్రామీణ ఆరోగ్య సేవలకు స్వాగతం. మీ ఆరోగ్య లక్షణాలను AIతో తనిఖీ చేసుకోండి, సమీప ప్రాథమిక ఆరోగ్య కేంద్రాలు మరియు ప్రభుత్వ ఆసుపత్రుల వివరాలు కనుగొనండి, మరియు అనుభవజ్ఞులైన వైద్యులతో సంప్రదించండి."
                forceLanguage="te"
                label="🔊 పరిచయం వినండి (Listen Telugu)"
                className="bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/60 font-semibold"
              />
              <AudioPlayer
                text={t('heroSubtitle')}
                label="🔊 Listen Overview"
                className="bg-white/10 hover:bg-white/20 text-stone-200 border border-white/20"
              />
            </div>

            {/* Main Action CTAs */}
            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => setActiveTab('assistant')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Activity className="w-5 h-5 text-stone-950" />
                <span>{t('heroStartAssessment')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('hospitals')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/20 transition cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>{t('heroFindHospitals')}</span>
              </button>

              <button
                onClick={() => setActiveTab('doctors')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 font-bold text-sm sm:text-base border border-stone-700 transition cursor-pointer"
              >
                <Stethoscope className="w-5 h-5 text-teal-400" />
                <span>{t('heroBookConsult')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Danger Signs Emergency Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-amber-950">
                  Critical Emergency Red-Flags: Seek Hospital Care Immediately
                </h3>
                <p className="text-xs sm:text-sm text-amber-800">
                  Do not rely on home remedies if any of these life-threatening warning signs appear. Call 108 Ambulance immediately.
                </p>
              </div>
            </div>

            <a
              href="tel:108"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition self-start lg:self-auto"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 108 Emergency Ambulance</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
              <div className="font-bold text-stone-900 text-sm mb-1 text-red-700">1. Breathing Distress</div>
              <p className="text-xs text-stone-600 leading-normal">
                Chest tightness, bluing lips, wheezing or severe breathlessness at rest.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
              <div className="font-bold text-stone-900 text-sm mb-1 text-red-700">2. High Fever in Infants</div>
              <p className="text-xs text-stone-600 leading-normal">
                Fever &gt;102°F with stiff neck, seizures/fits, or child refusing to breastfeed/drink.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
              <div className="font-bold text-stone-900 text-sm mb-1 text-red-700">3. Snakebite or Stings</div>
              <p className="text-xs text-stone-600 leading-normal">
                Bites from venomous snakes. Immobilize limb and rush to hospital for free anti-venom.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
              <div className="font-bold text-stone-900 text-sm mb-1 text-red-700">4. Severe Dehydration</div>
              <p className="text-xs text-stone-600 leading-normal">
                Sunken eyes, no urine for over 6 hours, severe vomiting unable to keep liquids down.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Comprehensive Rural Healthcare Ecosystem
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2">
            Designed to bridge the distance between remote Indian villages and timely medical expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div
            onClick={() => setActiveTab('assistant')}
            className="group bg-white rounded-2xl border border-stone-200 p-6 hover:border-emerald-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 group-hover:text-emerald-700 transition">
                AI Health Assistant
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Enter symptoms, duration, and village exposure factors. Receive risk triage, warning signs, and doctor questions.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-emerald-700 gap-1">
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setActiveTab('hospitals')}
            className="group bg-white rounded-2xl border border-stone-200 p-6 hover:border-emerald-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 group-hover:text-teal-700 transition">
                Find Hospitals & PHCs
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Interactive Google Maps locator for Primary Health Centres, Jan Aushadhi generic stores, and 24x7 emergency beds.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-teal-700 gap-1">
              <span>View Map & Directory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setActiveTab('doctors')}
            className="group bg-white rounded-2xl border border-stone-200 p-6 hover:border-emerald-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 group-hover:text-blue-700 transition">
                Doctors & Telemedicine
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Connect with certified physicians, pediatricians, and gynecologists for in-person visits or village tele-consultations.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-blue-700 gap-1">
              <span>Book Appointment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => setActiveTab('awareness')}
            className="group bg-white rounded-2xl border border-stone-200 p-6 hover:border-emerald-500 hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition">
                Multilingual Awareness
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Audio-enabled health guides on clean water, dengue prevention, anemia, snakebite first-aid, and infant immunization.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center text-xs font-bold text-amber-700 gap-1">
              <span>Read & Listen Guides</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</div>
            <div className="text-xs sm:text-sm text-stone-400 mt-1">Free Public PHC Care</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-400">24x7</div>
            <div className="text-xs sm:text-sm text-stone-400 mt-1">108 Ambulance Hotline</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">3 Langs</div>
            <div className="text-xs sm:text-sm text-stone-400 mt-1">English, हिन्दी & తెలుగు</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">₹0 Fee</div>
            <div className="text-xs sm:text-sm text-stone-400 mt-1">Essential Generic Drugs</div>
          </div>
        </div>
      </section>
    </div>
  );
};

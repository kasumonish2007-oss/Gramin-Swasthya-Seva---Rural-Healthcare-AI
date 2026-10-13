import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Loader2,
  Calendar,
  MapPin,
  Stethoscope,
  Volume2,
  RefreshCw,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { HealthAssessment } from '../types';
import { AudioPlayer } from '../components/AudioPlayer.tsx';

interface AiAssessmentPageProps {
  setActiveTab: (tab: string) => void;
  setPrefillDoctorReason?: (reason: string) => void;
}

const COMMON_SYMPTOM_CHIPS = [
  'High fever with chills & shivering',
  'Watery diarrhea / loose motions',
  'Persistent dry cough with chest tightness',
  'Severe joint and muscular aches',
  'Vomiting and inability to hold water',
  'Extreme dizziness & dehydration',
  'Pain behind eyes and forehead',
  'Abdominal cramps after well water',
];

const PRE_EXISTING_CHIPS = [
  'Diabetes',
  'Hypertension / High BP',
  'Asthma / Bronchitis',
  'Tuberculosis (TB) History',
  'Severe Anemia',
  'Heart Condition',
];

export const AiAssessmentPage: React.FC<AiAssessmentPageProps> = ({ setActiveTab, setPrefillDoctorReason }) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // Form State
  const [patientName, setPatientName] = useState(user?.name || '');
  const [age, setAge] = useState<number | ''>(32);
  const [gender, setGender] = useState('female');
  const [isPregnant, setIsPregnant] = useState(false);
  const [symptoms, setSymptoms] = useState('');
  const [durationDays, setDurationDays] = useState<number>(2);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [feverPresent, setFeverPresent] = useState(true);
  const [temperatureF, setTemperatureF] = useState<number | ''>(101);
  const [selectedPreExisting, setSelectedPreExisting] = useState<string[]>([]);
  const [environmentalRisk, setEnvironmentalRisk] = useState('Monsoon standing water in village ditches, mosquito bites');

  // Request State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HealthAssessment | null>(null);

  const togglePreExisting = (cond: string) => {
    if (selectedPreExisting.includes(cond)) {
      setSelectedPreExisting(selectedPreExisting.filter((c) => c !== cond));
    } else {
      setSelectedPreExisting([...selectedPreExisting, cond]);
    }
  };

  const addSymptomChip = (chip: string) => {
    if (!symptoms) {
      setSymptoms(chip);
    } else if (!symptoms.includes(chip)) {
      setSymptoms(`${symptoms}, ${chip}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Please enter patient name.');
      return;
    }
    if (!symptoms.trim()) {
      setError('Please describe the symptoms.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.assessSymptoms({
        patientName: patientName.trim(),
        age: Number(age) || 30,
        gender,
        isPregnant,
        symptoms: symptoms.trim(),
        durationDays: Number(durationDays) || 1,
        severity,
        feverPresent,
        vitals: temperatureF ? { temperatureF: Number(temperatureF) } : undefined,
        preExistingConditions: selectedPreExisting,
        environmentalRisk,
      });

      setResult(res.assessment);
      // Scroll smoothly to results
      setTimeout(() => {
        document.getElementById('assessment-result')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Assessment failed. Please try again or seek direct hospital care.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookConsultationWithPrefill = () => {
    if (setPrefillDoctorReason && result) {
      setPrefillDoctorReason(
        `AI Triage: ${result.triageLevel.toUpperCase()} - ${result.possibleConcerns.map((c) => c.name).join(', ')}. Symptoms: ${result.symptoms}`
      );
    }
    setActiveTab('doctors');
  };

  // Prepare full speech text for AudioPlayer
  const getSpeechSummary = () => {
    if (!result) return '';
    return `Patient ${result.patientName}. Priority level: ${result.triageLevel}. ${result.assessmentSummary}. Possible conditions: ${result.possibleConcerns.map((c) => c.name).join(', ')}. Recommendations: ${result.recommendedActions.join('. ')}. Self care: ${result.selfCareTips.join('. ')}.`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Early Disease Detection & Triage</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          {t('assessTitle')}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-3xl">
          {t('assessSubtitle')}
        </p>

        {/* Prominent Mandatory Clinical Disclaimer */}
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Medical Safety Notice: </span>
            {t('medicalDisclaimer')}
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-700" />
          <span>Patient Health Details</span>
        </h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Row 1: Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('patientName')} *</label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('patientAge')} *</label>
            <input
              type="number"
              min="0"
              max="120"
              required
              value={age}
              onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('patientGender')} *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="female">{t('female')}</option>
              <option value="male">{t('male')}</option>
              <option value="other">{t('other')}</option>
            </select>
          </div>
        </div>

        {/* Female maternal option */}
        {gender === 'female' && (
          <div className="flex items-center gap-2 p-3 bg-teal-50 rounded-lg border border-teal-200">
            <input
              type="checkbox"
              id="pregnant-check"
              checked={isPregnant}
              onChange={(e) => setIsPregnant(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="pregnant-check" className="text-xs font-medium text-teal-900 cursor-pointer">
              {t('isPregnant')} (Special antenatal risk considerations applied)
            </label>
          </div>
        )}

        {/* Row 2: Symptoms & Quick Chips */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">{t('symptomsLabel')} *</label>
          <textarea
            required
            rows={3}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder={t('symptomsPlaceholder')}
            className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          ></textarea>

          {/* Quick chips */}
          <div className="mt-2 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-semibold text-stone-500 mr-1">Common in rural areas:</span>
            {COMMON_SYMPTOM_CHIPS.map((chip, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => addSymptomChip(chip)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-700 border border-stone-200 transition"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Row 3: Duration & Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('durationDays')}</label>
            <input
              type="number"
              min="1"
              max="90"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value) || 1)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('severityLabel')}</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              <option value="mild">{t('severityMild')}</option>
              <option value="moderate">{t('severityModerate')}</option>
              <option value="severe">{t('severitySevere')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('feverPresent')}</label>
            <div className="flex items-center gap-3 pt-2">
              <label className="inline-flex items-center gap-1.5 text-xs text-stone-800 cursor-pointer">
                <input
                  type="radio"
                  name="fever"
                  checked={feverPresent}
                  onChange={() => setFeverPresent(true)}
                  className="text-emerald-600"
                />
                Yes
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs text-stone-800 cursor-pointer">
                <input
                  type="radio"
                  name="fever"
                  checked={!feverPresent}
                  onChange={() => setFeverPresent(false)}
                  className="text-emerald-600"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Row 4: Temperature if fever */}
        {feverPresent && (
          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-stone-700 mb-1">{t('temperatureF')}</label>
            <input
              type="number"
              step="0.1"
              min="95"
              max="108"
              value={temperatureF}
              onChange={(e) => setTemperatureF(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 101.4"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        )}

        {/* Pre-existing conditions */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Pre-Existing Conditions (If known)
          </label>
          <div className="flex flex-wrap gap-2">
            {PRE_EXISTING_CHIPS.map((chip, idx) => {
              const isSelected = selectedPreExisting.includes(chip);
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => togglePreExisting(chip)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${
                    isSelected
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {isSelected ? `✓ ${chip}` : chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Environmental Risk */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">{t('environmentalRisk')}</label>
          <input
            type="text"
            value={environmentalRisk}
            onChange={(e) => setEnvironmentalRisk(e.target.value)}
            placeholder={t('environmentalPlaceholder')}
            className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold text-base shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('analyzingText')}</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                <span>{t('runAssessmentBtn')}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ASSESSMENT RESULT SECTION */}
      {result && (
        <div
          id="assessment-result"
          className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-lg space-y-6"
        >
          {/* Triage Banner Header */}
          <div
            className={`p-6 text-white ${
              result.triageLevel === 'urgent'
                ? 'bg-red-700'
                : result.triageLevel === 'moderate'
                ? 'bg-amber-600'
                : 'bg-emerald-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-white/90">
                  {result.triageLevel === 'urgent' && <AlertOctagon className="w-4 h-4" />}
                  {result.triageLevel === 'moderate' && <AlertTriangle className="w-4 h-4" />}
                  {result.triageLevel === 'low' && <CheckCircle2 className="w-4 h-4" />}
                  <span>Triage Priority: {result.triageLevel.toUpperCase()}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black mt-1">
                  {result.triageLevel === 'urgent' && t('triageUrgent')}
                  {result.triageLevel === 'moderate' && t('triageModerate')}
                  {result.triageLevel === 'low' && t('triageLow')}
                </h3>
                <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-2xl leading-relaxed">
                  {result.assessmentSummary}
                </p>
              </div>

              {/* Read Aloud Audio Player */}
              <div className="shrink-0">
                <AudioPlayer
                  text={getSpeechSummary()}
                  label={t('listenAudio')}
                  className="bg-white text-stone-900 border-white hover:bg-stone-100 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Urgent Red-Flag Warnings if any */}
            {result.urgentWarningSigns && result.urgentWarningSigns.length > 0 && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                <h4 className="font-bold text-red-900 text-sm flex items-center gap-2 mb-2">
                  <AlertOctagon className="w-4 h-4 text-red-600" />
                  <span>{t('urgentWarnings')}</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-red-800">
                  {result.urgentWarningSigns.map((w, idx) => (
                    <li key={idx} className="font-medium">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Possible Health Concerns */}
            <div>
              <h4 className="font-bold text-stone-900 text-base mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-700" />
                <span>{t('possibleConcerns')}</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.possibleConcerns.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-stone-900">{c.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          c.likelihood === 'High'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        Likelihood: {c.likelihood}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{c.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Steps & Safe Home Care in 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recommendations */}
              <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <h4 className="font-bold text-emerald-950 text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{t('recommendedSteps')}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
                  {result.recommendedActions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Safe Supportive Self-Care */}
              <div className="p-5 rounded-xl bg-teal-50/70 border border-teal-200">
                <h4 className="font-bold text-teal-950 text-sm mb-3 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-700" />
                  <span>{t('safeHomeCare')}</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-teal-900">
                  {result.selfCareTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Questions for Doctor */}
            {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-stone-900 text-sm mb-2 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-stone-700" />
                  <span>{t('questionsForDoctor')}</span>
                </h4>
                <div className="space-y-1.5 text-xs sm:text-sm text-stone-700">
                  {result.questionsForDoctor.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="font-semibold text-stone-500">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Connect Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setActiveTab('hospitals')}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Locate Nearest PHC or Hospital Now</span>
              </button>

              <button
                onClick={handleBookConsultationWithPrefill}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <span>Book Doctor Consultation with this Assessment</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

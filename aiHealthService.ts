import { GoogleGenAI } from '@google/genai';

export interface HealthAssessmentInput {
  patientName: string;
  age: number;
  gender: string;
  isPregnant?: boolean;
  symptoms: string;
  durationDays: number;
  severity: 'mild' | 'moderate' | 'severe';
  feverPresent: boolean;
  preExistingConditions?: string[];
  vitals?: {
    temperatureF?: number;
    bloodPressure?: string;
    pulseRate?: number;
  };
  environmentalRisk?: string;
}

export interface HealthAssessmentResult {
  assessmentSummary: string;
  possibleConcerns: Array<{
    name: string;
    likelihood: 'High' | 'Moderate' | 'Low';
    description: string;
  }>;
  triageLevel: 'low' | 'moderate' | 'urgent';
  urgentWarningSigns: string[];
  recommendedActions: string[];
  selfCareTips: string[];
  questionsForDoctor: string[];
  disclaimerAcknowledged: boolean;
  aiProvider: 'gemini' | 'clinical_rules_fallback';
  createdAt: string;
}

export async function generateHealthAssessment(input: HealthAssessmentInput): Promise<HealthAssessmentResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are an expert rural healthcare triage assistant for primary care in rural India (Gramin Swasthya Seva).
Assess the following patient's symptoms and health details.
IMPORTANT SAFETY INSTRUCTIONS:
1. Provide PRELIMINARY risk stratification ONLY.
2. DO NOT provide a definitive diagnosis.
3. DO NOT prescribe prescription medications (no antibiotics, no steroids, no scheduled drugs).
4. If there are red-flag danger signs (e.g. chest pain, breathing difficulty, severe dehydration, high fever >103F in infants/elderly, altered consciousness, uncontrolled bleeding, snakebite), set triageLevel to "urgent" and clearly list emergency warnings.
5. Provide actionable advice for rural settings: nearest PHC (Primary Health Centre), CHC (Community Health Centre), or District Hospital.
6. Provide safe home supportive care (e.g., ORS hydration, sponge bath for fever, resting, boiled drinking water).

PATIENT DETAILS:
- Name: ${input.patientName}
- Age: ${input.age} years
- Biological Sex: ${input.gender}
- Pregnant / Nursing: ${input.isPregnant ? 'Yes' : 'No'}
- Primary Symptoms: "${input.symptoms}"
- Duration: ${input.durationDays} day(s)
- Stated Severity: ${input.severity}
- Fever Present: ${input.feverPresent ? 'Yes' : 'No'}
- Pre-existing Conditions: ${input.preExistingConditions && input.preExistingConditions.length ? input.preExistingConditions.join(', ') : 'None reported'}
- Vitals: ${input.vitals ? `Temp: ${input.vitals.temperatureF || 'N/A'}°F, BP: ${input.vitals.bloodPressure || 'N/A'}, Pulse: ${input.vitals.pulseRate || 'N/A'}` : 'Not recorded'}
- Environmental factors (Monsoon, stagnant water, heat, etc.): ${input.environmentalRisk || 'None noted'}

Output MUST be valid JSON adhering strictly to this schema:
{
  "assessmentSummary": "Brief compassionate summary in simple English (2-3 sentences)",
  "triageLevel": "low" | "moderate" | "urgent",
  "possibleConcerns": [
    {
      "name": "Condition name (e.g. Acute Gastroenteritis, Viral Upper Respiratory Illness, Suspected Vector-borne Fever)",
      "likelihood": "High" | "Moderate" | "Low",
      "description": "Short explanation in simple language why this matches the symptoms"
    }
  ],
  "urgentWarningSigns": [
    "Red flag danger sign 1",
    "Red flag danger sign 2"
  ],
  "recommendedActions": [
    "Action 1 (e.g. Visit village PHC or consult doctor within 24-48 hours)",
    "Action 2"
  ],
  "selfCareTips": [
    "Safe non-medicinal supportive tip 1 (e.g. Drink boiled water and ORS)",
    "Safe tip 2"
  ],
  "questionsForDoctor": [
    "Question patient should ask the doctor 1",
    "Question 2"
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        return {
          assessmentSummary: parsed.assessmentSummary || 'Preliminary symptom assessment generated.',
          triageLevel: ['low', 'moderate', 'urgent'].includes(parsed.triageLevel) ? parsed.triageLevel : 'moderate',
          possibleConcerns: Array.isArray(parsed.possibleConcerns) ? parsed.possibleConcerns : [],
          urgentWarningSigns: Array.isArray(parsed.urgentWarningSigns) ? parsed.urgentWarningSigns : [],
          recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : ['Visit nearest PHC for clinical examination.'],
          selfCareTips: Array.isArray(parsed.selfCareTips) ? parsed.selfCareTips : ['Drink boiled water and rest.'],
          questionsForDoctor: Array.isArray(parsed.questionsForDoctor) ? parsed.questionsForDoctor : ['Should any diagnostic blood tests or smears be performed?'],
          disclaimerAcknowledged: true,
          aiProvider: 'gemini',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[AI] Gemini API assessment call failed or errored. Transitioning to clinical rules engine.', err);
    }
  }

  // Clinical Rule-Based Fallback Engine
  return generateClinicalRulesFallback(input);
}

function generateClinicalRulesFallback(input: HealthAssessmentInput): HealthAssessmentResult {
  const sym = input.symptoms.toLowerCase();
  const isEmergencySymptoms =
    sym.includes('chest pain') ||
    sym.includes('heart') ||
    sym.includes('difficulty breathing') ||
    sym.includes('cannot breathe') ||
    sym.includes('breathless') ||
    sym.includes('unconscious') ||
    sym.includes('fainted') ||
    sym.includes('snake') ||
    sym.includes('blood in vomit') ||
    sym.includes('blood in stool') ||
    sym.includes('seizure') ||
    sym.includes('fits') ||
    (input.severity === 'severe' && input.feverPresent && input.age < 2);

  const isVectorBorne =
    sym.includes('mosquito') ||
    sym.includes('shivering') ||
    sym.includes('chills') ||
    sym.includes('joint pain') ||
    sym.includes('eye pain') ||
    (sym.includes('fever') && (input.environmentalRisk?.toLowerCase().includes('monsoon') || input.environmentalRisk?.toLowerCase().includes('water')));

  const isGastro =
    sym.includes('loose') ||
    sym.includes('diarrhea') ||
    sym.includes('vomit') ||
    sym.includes('stomach') ||
    sym.includes('cramp') ||
    sym.includes('food');

  const isRespiratory =
    sym.includes('cough') ||
    sym.includes('throat') ||
    sym.includes('cold') ||
    sym.includes('runny nose') ||
    sym.includes('sneeze');

  let triageLevel: 'low' | 'moderate' | 'urgent' = 'moderate';
  const possibleConcerns: Array<{ name: string; likelihood: 'High' | 'Moderate' | 'Low'; description: string }> = [];
  const urgentWarningSigns: string[] = [];
  const recommendedActions: string[] = [];
  const selfCareTips: string[] = [];
  const questionsForDoctor: string[] = [];

  if (isEmergencySymptoms || input.severity === 'severe') {
    triageLevel = 'urgent';
    urgentWarningSigns.push('Reported severe acute symptoms require immediate in-person evaluation.');
    urgentWarningSigns.push('Call Emergency 108/112 or rush to the nearest Community Health Centre / District Hospital casualty immediately.');
    recommendedActions.push('Do NOT delay travel to the nearest 24x7 hospital with emergency casualty ward.');
    recommendedActions.push('Keep the patient calm, comfortable, and ensure clear airway during transit.');
  }

  if (isGastro) {
    possibleConcerns.push({
      name: 'Acute Gastroenteritis / Waterborne Infection',
      likelihood: 'High',
      description: 'Symptoms of loose motions, vomiting, or abdominal cramps often stem from food or water contamination common in rural areas.',
    });
    selfCareTips.push('Begin Oral Rehydration Salts (ORS) solution immediately: 1 packet in 1 liter of cooled boiled water.');
    selfCareTips.push('Continue light liquids (rice kanji, coconut water, buttermilk). Avoid raw or street food.');
    urgentWarningSigns.push('Watch for severe dehydration: sunken eyes, inability to retain liquids, extreme thirst, or no urine output for >6 hours.');
    questionsForDoctor.push('Is a stool culture or zinc supplementation recommended?');
  }

  if (isVectorBorne || (input.feverPresent && input.durationDays >= 2)) {
    possibleConcerns.push({
      name: 'Suspected Vector-Borne Fever (Malaria / Dengue / Viral Fever)',
      likelihood: 'Moderate',
      description: 'Fever accompanied by chills, joint pain, or headaches during rainy seasons warrants malaria smear or dengue NS1 screening.',
    });
    selfCareTips.push('Tepid water sponging on forehead and body to gently lower body temperature.');
    selfCareTips.push('Drink plenty of fluids. Rest in a well-ventilated room under a mosquito net.');
    urgentWarningSigns.push('Avoid pain relievers like Aspirin or Ibuprofen which can aggravate bleeding risks. Use only Paracetamol if prescribed.');
    recommendedActions.push('Visit your village Primary Health Centre (PHC) for a free finger-prick blood smear / Rapid Diagnostic Test (RDT).');
    questionsForDoctor.push('Can we perform a complete blood count (CBC) to check platelet count?');
  }

  if (isRespiratory) {
    possibleConcerns.push({
      name: 'Viral Upper Respiratory Tract Infection (URTI)',
      likelihood: isVectorBorne ? 'Moderate' : 'High',
      description: 'Cold, dry cough, or mild sore throat typically caused by common seasonal viruses.',
    });
    selfCareTips.push('Steam inhalation twice daily with warm water to relieve nasal congestion.');
    selfCareTips.push('Warm water with honey or tulsi ginger decoction (kadha) for soothing throat irritation.');
    questionsForDoctor.push('Should an X-ray or sputum test be done if the cough persists for more than 2 weeks?');
  }

  if (possibleConcerns.length === 0) {
    possibleConcerns.push({
      name: 'General Mild Physiological Symptom',
      likelihood: 'Moderate',
      description: 'Symptoms reported may be related to physical fatigue, dehydration, seasonal change, or mild viral illness.',
    });
    triageLevel = input.severity === 'mild' ? 'low' : 'moderate';
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push('Consult a doctor at the nearest Primary Health Centre (PHC) or Community Health Centre (CHC).');
    recommendedActions.push('Monitor body temperature and symptoms twice daily.');
  }

  if (selfCareTips.length === 0) {
    selfCareTips.push('Ensure adequate hydration with safe, boiled drinking water.');
    selfCareTips.push('Get adequate physical rest and maintain good hand hygiene.');
  }

  questionsForDoctor.push('What warning signs at home should prompt an immediate hospital return?');

  const summary = `Preliminary triage assessment for ${input.patientName} (${input.age} y/o). Symptoms of ${input.symptoms} lasting ${input.durationDays} day(s) have been categorized as ${triageLevel.toUpperCase()} priority. Please discuss findings with a qualified medical professional.`;

  return {
    assessmentSummary: summary,
    triageLevel,
    possibleConcerns,
    urgentWarningSigns,
    recommendedActions,
    selfCareTips,
    questionsForDoctor,
    disclaimerAcknowledged: true,
    aiProvider: 'clinical_rules_fallback',
    createdAt: new Date().toISOString(),
  };
}

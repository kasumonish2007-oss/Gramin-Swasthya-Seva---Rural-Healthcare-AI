import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  phone: string;
  passwordHash: string;
  role: 'patient' | 'admin' | 'doctor';
  village?: string;
  district?: string;
  state?: string;
  preferredLanguage: 'en' | 'hi' | 'te';
  consentGiven: boolean;
  createdAt: Date;
}

export const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['patient', 'admin', 'doctor'], default: 'patient' },
  village: { type: String, default: '' },
  district: { type: String, default: '' },
  state: { type: String, default: 'Telangana' },
  preferredLanguage: { type: String, enum: ['en', 'hi', 'te'], default: 'en' },
  consentGiven: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export interface IHealthAssessment extends Document {
  userId?: string;
  patientName: string;
  age: number;
  gender: string;
  isPregnant?: boolean;
  symptoms: string;
  durationDays: number;
  severity: 'mild' | 'moderate' | 'severe';
  feverPresent: boolean;
  preExistingConditions: string[];
  vitals?: {
    temperatureF?: number;
    bloodPressure?: string;
    pulseRate?: number;
  };
  environmentalRisk?: string;
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
  createdAt: Date;
}

export const HealthAssessmentSchema = new Schema<IHealthAssessment>({
  userId: { type: String, index: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  isPregnant: { type: Boolean, default: false },
  symptoms: { type: String, required: true },
  durationDays: { type: Number, default: 1 },
  severity: { type: String, default: 'moderate' },
  feverPresent: { type: Boolean, default: false },
  preExistingConditions: [{ type: String }],
  vitals: {
    temperatureF: Number,
    bloodPressure: String,
    pulseRate: Number,
  },
  environmentalRisk: String,
  assessmentSummary: { type: String, required: true },
  possibleConcerns: [
    {
      name: String,
      likelihood: String,
      description: String,
    },
  ],
  triageLevel: { type: String, enum: ['low', 'moderate', 'urgent'], default: 'moderate' },
  urgentWarningSigns: [{ type: String }],
  recommendedActions: [{ type: String }],
  selfCareTips: [{ type: String }],
  questionsForDoctor: [{ type: String }],
  disclaimerAcknowledged: { type: Boolean, default: true },
  aiProvider: { type: String, default: 'gemini' },
  createdAt: { type: Date, default: Date.now },
});

export interface IHospital extends Document {
  name: string;
  facilityType: 'PHC' | 'CHC' | 'District Hospital' | 'Sub-Centre' | 'Jan Aushadhi' | 'Clinic';
  state: string;
  district: string;
  taluk?: string;
  village?: string;
  pincode: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  emergencyPhone?: string;
  emergency24x7: boolean;
  beds: number;
  oxygenAvailable: boolean;
  ayushmanEmpanelled: boolean;
  services: string[];
  timings: string;
}

export const HospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  facilityType: { type: String, required: true, index: true },
  state: { type: String, required: true, index: true },
  district: { type: String, required: true, index: true },
  taluk: String,
  village: String,
  pincode: { type: String, index: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyPhone: String,
  emergency24x7: { type: Boolean, default: false },
  beds: { type: Number, default: 0 },
  oxygenAvailable: { type: Boolean, default: true },
  ayushmanEmpanelled: { type: Boolean, default: true },
  services: [{ type: String }],
  timings: { type: String, default: '9:00 AM - 5:00 PM' },
});

export interface IDoctor extends Document {
  name: string;
  speciality: string;
  qualification: string;
  hospitalName: string;
  hospitalId?: string;
  experienceYears: number;
  languages: string[];
  fee: number;
  teleconsultAvailable: boolean;
  availableDays: string[];
  timing: string;
  rating: number;
  avatarUrl?: string;
}

export const DoctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  speciality: { type: String, required: true },
  qualification: { type: String, required: true },
  hospitalName: { type: String, required: true },
  hospitalId: String,
  experienceYears: { type: Number, default: 5 },
  languages: [{ type: String }],
  fee: { type: Number, default: 0 },
  teleconsultAvailable: { type: Boolean, default: true },
  availableDays: [{ type: String }],
  timing: { type: String, default: '10:00 AM - 4:00 PM' },
  rating: { type: Number, default: 4.8 },
  avatarUrl: String,
});

export interface IAppointment extends Document {
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientVillage?: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality: string;
  hospitalName: string;
  date: string;
  timeSlot: string;
  consultationType: 'in-person' | 'remote-teleconsult';
  symptomsSummary: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  teleconsultMeetingId?: string;
  doctorNotes?: string;
  createdAt: Date;
}

export const AppointmentSchema = new Schema<IAppointment>({
  patientId: { type: String, required: true, index: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientVillage: String,
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  doctorSpeciality: { type: String, required: true },
  hospitalName: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  consultationType: { type: String, enum: ['in-person', 'remote-teleconsult'], default: 'in-person' },
  symptomsSummary: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  teleconsultMeetingId: String,
  doctorNotes: String,
  createdAt: { type: Date, default: Date.now },
});

export interface IHealthArticle extends Document {
  articleId: string;
  category: string;
  titleEn: string;
  titleHi: string;
  titleTe: string;
  summaryEn: string;
  summaryHi: string;
  summaryTe: string;
  contentEn: string;
  contentHi: string;
  contentTe: string;
  keyTips: string[];
  readTimeMinutes: number;
  tag: string;
}

export const HealthArticleSchema = new Schema<IHealthArticle>({
  articleId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  titleEn: { type: String, required: true },
  titleHi: { type: String, required: true },
  titleTe: { type: String, required: true },
  summaryEn: { type: String, required: true },
  summaryHi: { type: String, required: true },
  summaryTe: { type: String, required: true },
  contentEn: { type: String, required: true },
  contentHi: { type: String, required: true },
  contentTe: { type: String, required: true },
  keyTips: [{ type: String }],
  readTimeMinutes: { type: Number, default: 3 },
  tag: { type: String, default: 'General' },
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const HealthAssessmentModel = mongoose.models.HealthAssessment || mongoose.model<IHealthAssessment>('HealthAssessment', HealthAssessmentSchema);
export const HospitalModel = mongoose.models.Hospital || mongoose.model<IHospital>('Hospital', HospitalSchema);
export const DoctorModel = mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
export const AppointmentModel = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
export const HealthArticleModel = mongoose.models.HealthArticle || mongoose.model<IHealthArticle>('HealthArticle', HealthArticleSchema);

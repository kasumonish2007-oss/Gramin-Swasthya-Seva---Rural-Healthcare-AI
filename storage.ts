import bcrypt from 'bcryptjs';
import { INITIAL_HOSPITALS, INITIAL_DOCTORS, INITIAL_ARTICLES, SeedHospital, SeedDoctor, SeedArticle } from '../data/seedData.ts';

export interface StoredUser {
  _id: string;
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
  createdAt: string;
}

export interface StoredAssessment {
  _id: string;
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
  createdAt: string;
}

export interface StoredAppointment {
  _id: string;
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
  createdAt: string;
}

class ResilientStore {
  public users: StoredUser[] = [];
  public assessments: StoredAssessment[] = [];
  public hospitals: SeedHospital[] = [...INITIAL_HOSPITALS];
  public doctors: SeedDoctor[] = [...INITIAL_DOCTORS];
  public appointments: StoredAppointment[] = [];
  public articles: SeedArticle[] = [...INITIAL_ARTICLES];

  constructor() {
    this.seedInitialUsers();
    this.seedSampleAppointments();
  }

  private seedInitialUsers() {
    const salt = bcrypt.genSaltSync(10);
    // Demo patient
    this.users.push({
      _id: 'user-patient-1',
      name: 'Ravi Kumar',
      email: 'ravi.patient@ruralhealth.in',
      phone: '9876543210',
      passwordHash: bcrypt.hashSync('patient123', salt),
      role: 'patient',
      village: 'Shamshabad Rural',
      district: 'Ranga Reddy',
      state: 'Telangana',
      preferredLanguage: 'te',
      consentGiven: true,
      createdAt: new Date().toISOString(),
    });

    // Demo admin
    this.users.push({
      _id: 'user-admin-1',
      name: 'Dr. Anita Sharma (PHC Officer)',
      email: 'admin@ruralhealth.gov.in',
      phone: '9999888877',
      passwordHash: bcrypt.hashSync('admin123', salt),
      role: 'admin',
      village: 'District Health HQ',
      district: 'Ranga Reddy',
      state: 'Telangana',
      preferredLanguage: 'hi',
      consentGiven: true,
      createdAt: new Date().toISOString(),
    });
  }

  private seedSampleAppointments() {
    this.appointments.push({
      _id: 'apt-1',
      patientId: 'user-patient-1',
      patientName: 'Ravi Kumar',
      patientPhone: '9876543210',
      patientVillage: 'Shamshabad Rural',
      doctorId: 'doc-1',
      doctorName: 'Dr. Rameshwar Rao, MBBS, MD',
      doctorSpeciality: 'General Medicine & Rural Health',
      hospitalName: 'Shamshabad Community Health Centre (CHC)',
      date: '2026-10-16',
      timeSlot: '10:30 AM',
      consultationType: 'remote-teleconsult',
      symptomsSummary: 'Persistent fever for 3 days with joint stiffness and fatigue',
      status: 'confirmed',
      teleconsultMeetingId: 'GRAMIN-TELE-98124',
      doctorNotes: 'Advised to take temperature log and hydrate with boiled water.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    });

    this.appointments.push({
      _id: 'apt-2',
      patientId: 'user-patient-1',
      patientName: 'Ravi Kumar',
      patientPhone: '9876543210',
      patientVillage: 'Shamshabad Rural',
      doctorId: 'doc-2',
      doctorName: 'Dr. Sunita Lakshmi, MBBS, DGO',
      doctorSpeciality: 'Maternal & Women Health (Gynecology)',
      hospitalName: 'Shabad Primary Health Centre (PHC)',
      date: '2026-10-20',
      timeSlot: '11:00 AM',
      consultationType: 'in-person',
      symptomsSummary: 'Routine antenatal guidance for family member',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }
}

export const dbStore = new ResilientStore();

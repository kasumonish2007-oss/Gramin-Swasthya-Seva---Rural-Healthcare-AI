import { Router, Request, Response } from 'express';
import { generateHealthAssessment, HealthAssessmentInput } from '../services/aiHealthService.ts';
import { dbStore, StoredAssessment } from '../services/storage.ts';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'gramin-health-secret-key-2026-production';

// POST /api/health/assess
router.post('/assess', async (req: Request, res: Response) => {
  try {
    const {
      patientName,
      age,
      gender,
      isPregnant,
      symptoms,
      durationDays,
      severity,
      feverPresent,
      preExistingConditions,
      vitals,
      environmentalRisk,
    } = req.body;

    if (!patientName || !age || !gender || !symptoms) {
      return res.status(400).json({ error: 'Patient name, age, gender, and symptoms description are required.' });
    }

    const assessmentInput: HealthAssessmentInput = {
      patientName: String(patientName).trim(),
      age: Number(age) || 30,
      gender: String(gender),
      isPregnant: Boolean(isPregnant),
      symptoms: String(symptoms).trim(),
      durationDays: Number(durationDays) || 1,
      severity: ['mild', 'moderate', 'severe'].includes(severity) ? severity : 'moderate',
      feverPresent: Boolean(feverPresent),
      preExistingConditions: Array.isArray(preExistingConditions) ? preExistingConditions : [],
      vitals,
      environmentalRisk: environmentalRisk ? String(environmentalRisk) : undefined,
    };

    const assessmentResult = await generateHealthAssessment(assessmentInput);

    // Optional user attachment if authenticated
    let userId: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
        userId = decoded._id;
      } catch {
        // Continue unauthenticated
      }
    }

    const stored: StoredAssessment = {
      _id: `asm-${Date.now()}`,
      userId,
      patientName: assessmentInput.patientName,
      age: assessmentInput.age,
      gender: assessmentInput.gender,
      isPregnant: assessmentInput.isPregnant,
      symptoms: assessmentInput.symptoms,
      durationDays: assessmentInput.durationDays,
      severity: assessmentInput.severity,
      feverPresent: assessmentInput.feverPresent,
      preExistingConditions: assessmentInput.preExistingConditions || [],
      vitals: assessmentInput.vitals,
      environmentalRisk: assessmentInput.environmentalRisk,
      assessmentSummary: assessmentResult.assessmentSummary,
      possibleConcerns: assessmentResult.possibleConcerns,
      triageLevel: assessmentResult.triageLevel,
      urgentWarningSigns: assessmentResult.urgentWarningSigns,
      recommendedActions: assessmentResult.recommendedActions,
      selfCareTips: assessmentResult.selfCareTips,
      questionsForDoctor: assessmentResult.questionsForDoctor,
      disclaimerAcknowledged: true,
      aiProvider: assessmentResult.aiProvider,
      createdAt: new Date().toISOString(),
    };

    dbStore.assessments.unshift(stored);

    return res.json({
      success: true,
      assessment: stored,
      disclaimer: 'This assessment is preliminary for triage purposes and does NOT replace examination by a registered medical practitioner.',
    });
  } catch (error: any) {
    console.error('Assessment generation error:', error);
    return res.status(500).json({ error: 'Failed to process symptom assessment. Please try again or seek local emergency care if in distress.' });
  }
});

// GET /api/health/assessments/my
router.get('/assessments/my', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: string };
    const userAssessments = dbStore.assessments.filter((a) => a.userId === decoded._id);
    return res.json({ assessments: userAssessments });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

export default router;

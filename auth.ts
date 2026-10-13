import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbStore } from '../services/storage.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'gramin-health-secret-key-2026-production';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email?: string;
    phone: string;
    role: 'patient' | 'admin' | 'doctor';
  };
}

export function generateToken(payload: { _id: string; name: string; phone: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing or invalid Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      name: string;
      email?: string;
      phone: string;
      role: 'patient' | 'admin' | 'doctor';
    };

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Access restricted. Required role: ${allowedRoles.join(' or ')}` });
    }
    next();
  };
}

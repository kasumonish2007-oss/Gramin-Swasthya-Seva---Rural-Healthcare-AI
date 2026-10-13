import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStore, StoredUser } from '../services/storage.ts';
import { generateToken, authenticateUser, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role, village, district, state, preferredLanguage } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ error: 'Name, phone number, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check existing
    const existing = dbStore.users.find((u) => u.phone === phone || (email && u.email?.toLowerCase() === email.toLowerCase()));
    if (existing) {
      return res.status(409).json({ error: 'An account with this phone number or email already exists. Please log in.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: StoredUser = {
      _id: `user-${Date.now()}`,
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone.trim(),
      passwordHash,
      role: role === 'admin' ? 'admin' : 'patient',
      village: village || '',
      district: district || '',
      state: state || 'Telangana',
      preferredLanguage: ['en', 'hi', 'te'].includes(preferredLanguage) ? preferredLanguage : 'en',
      consentGiven: true,
      createdAt: new Date().toISOString(),
    };

    dbStore.users.push(newUser);

    const token = generateToken({
      _id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
    });

    const { passwordHash: _, ...userSafe } = newUser;
    return res.status(201).json({
      message: 'Registration successful! Welcome to Gramin Swasthya Seva.',
      token,
      user: userSafe,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body; // identifier can be phone or email

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Please provide your registered phone number/email and password.' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = dbStore.users.find((u) => u.phone.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId);

    if (!user) {
      return res.status(401).json({ error: 'Invalid phone/email or password.' });
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid phone/email or password.' });
    }

    const token = generateToken({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });

    const { passwordHash: _, ...userSafe } = user;
    return res.json({
      message: 'Login successful.',
      token,
      user: userSafe,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  return res.json({ message: 'Successfully logged out.' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req: Request, res: Response) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Please provide your registered phone number or email.' });
  }

  const cleanId = identifier.trim().toLowerCase();
  const user = dbStore.users.find((u) => u.phone.toLowerCase() === cleanId || u.email?.toLowerCase() === cleanId);

  if (!user) {
    return res.status(404).json({ error: 'No user registered with this phone number or email.' });
  }

  return res.json({
    message: 'Password reset OTP has been simulated for your registered number/email.',
    tempOtp: '741258',
    notice: 'In a production deployment with SMS gateway, this sends a 6-digit OTP via rural Telecommunications gateway.',
  });
});

// GET /api/users/profile
router.get('/profile', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = dbStore.users.find((u) => u._id === req.user?._id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  const { passwordHash: _, ...userSafe } = user;
  return res.json({ user: userSafe });
});

// PUT /api/users/profile
router.put('/profile', authenticateUser, (req: AuthRequest, res: Response) => {
  const user = dbStore.users.find((u) => u._id === req.user?._id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  const { name, village, district, state, preferredLanguage, consentGiven } = req.body;

  if (name) user.name = name.trim();
  if (village !== undefined) user.village = village.trim();
  if (district !== undefined) user.district = district.trim();
  if (state !== undefined) user.state = state.trim();
  if (preferredLanguage && ['en', 'hi', 'te'].includes(preferredLanguage)) {
    user.preferredLanguage = preferredLanguage;
  }
  if (consentGiven !== undefined) user.consentGiven = Boolean(consentGiven);

  const { passwordHash: _, ...userSafe } = user;
  return res.json({ message: 'Profile updated successfully.', user: userSafe });
});

export default router;

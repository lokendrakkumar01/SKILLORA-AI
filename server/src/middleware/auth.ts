import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'skillora_jwt_secret_2024_very_long_key_please_change';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const generateToken = (id: string, email: string): string => {
  return jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
};

import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    [key: string]: any;
  };
}

export function isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Hardcoded admin email addresses
  const adminEmails = ['jarviscamp@bellsouth.net'];
  
  if (req.user.role !== 'admin' && !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ 
      error: 'Unauthorized - Admin access only',
      userRole: req.user.role
    });
  }

  return next();
}

export function isAdminOrVault(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Hardcoded admin email addresses
  const adminEmails = ['jarviscamp@bellsouth.net'];
  
  if (req.user.role !== 'admin' && req.user.role !== 'vault' && !adminEmails.includes(req.user.email)) {
    return res.status(403).json({ 
      error: 'Unauthorized - Admin or Vault access only',
      userRole: req.user.role 
    });
  }

  return next();
}
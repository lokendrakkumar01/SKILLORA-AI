import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status < 500 ? err.message : 'Internal server error',
  });
};

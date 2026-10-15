import type { Request, Response } from 'express';

export function handleHealth(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    service: 'themealdb-service',
    timestamp: new Date().toISOString(),
  });
}

export default handleHealth;

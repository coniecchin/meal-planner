import { Router } from 'express';
import { handleHealth } from './health';
import { handleTheMealDBFilter } from './meals';

export const apiRouter = Router();

// Health check endpoints (supporting both health and heatlh typo)
apiRouter.get('/health', handleHealth);
apiRouter.get('/heatlh', handleHealth);

// TheMealDB endpoints
apiRouter.get('/meals', handleTheMealDBFilter);
apiRouter.get('/themealdb', handleTheMealDBFilter);

export default apiRouter;

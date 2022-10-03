import {Router} from 'express';

import categoryRouter from './categoryRouter.js';
import custumerRouter from './customerRouter.js';
import gamesRouter from './gamesRouter.js';
import rentalRouter from './rentalRouter.js';

const router = Router();

router.use(categoryRouter);
router.use(custumerRouter);
router.use(gamesRouter);
router.use(rentalRouter);

export default router;
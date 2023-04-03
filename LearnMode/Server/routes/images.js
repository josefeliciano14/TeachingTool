import express from 'express';

import { getQuestionImage } from '../controllers/images.js';

const router = express.Router();

router.get('/question/:name', getQuestionImage);

export default router;
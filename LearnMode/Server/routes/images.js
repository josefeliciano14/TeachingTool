import express from 'express';

import { getContentImage, getQuestionImage } from '../controllers/images.js';

const router = express.Router();

router.get('/question/:name', getQuestionImage);

export default router;
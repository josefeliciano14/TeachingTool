import express from 'express';

import {getContent} from '../controllers/content.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:name', getContent);

export default router;
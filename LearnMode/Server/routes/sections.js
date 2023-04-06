import express from 'express';

import {createSection, getSections} from '../controllers/sections.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getSections);
router.post('/', auth, createSection);

export default router;
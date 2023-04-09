import express from 'express';

import {createSection, getSections, getSection, removeStudent} from '../controllers/sections.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getSections);
router.get('/:sid', auth, getSection);
router.post('/', auth, createSection);
router.delete('/remove/:uid/:sid', auth, removeStudent);

export default router;
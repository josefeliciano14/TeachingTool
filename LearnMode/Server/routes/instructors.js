import express from 'express';

import auth from '../middleware/auth.js';
import { getInstructors, getInstructor } from '../controllers/instructors.js';

const router = express.Router();

router.get('/', auth, getInstructors);
router.get('/:iid/:sid', auth, getInstructor);

export default router;
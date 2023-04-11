import express from 'express';

import auth from '../middleware/auth.js';
import { getInstructors, getInstructor, updatePermissions, removeInstructor, addInstructor } from '../controllers/instructors.js';

const router = express.Router();

router.get('/', auth, getInstructors);
router.get('/:iid/:sid', auth, getInstructor);
router.post('/', auth, addInstructor);
router.put('/:iid/:sid', auth, updatePermissions);
router.delete('/:iid/:sid', auth, removeInstructor);

export default router;
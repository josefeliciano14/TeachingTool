import express from 'express';

import {getMyModules, createModule} from '../controllers/modules.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getMyModules)
router.post('/', auth, createModule)

export default router;
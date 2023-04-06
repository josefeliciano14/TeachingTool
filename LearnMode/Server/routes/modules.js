import express from 'express';

import {getMyModules, createModule, getModuleImage, getMyModulesLimit, getModule, searchModules} from '../controllers/modules.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getMyModules);
router.get('/limit/:limit', auth, getMyModulesLimit);
router.get('/:mid', auth, getModule);
router.post('/', auth, createModule);
router.get('/search/:query', searchModules);

router.get('/image/:mid', getModuleImage);

export default router;
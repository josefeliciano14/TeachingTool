import express from 'express';

import {getMyModules, createModule, getModuleImage, getMyModulesLimit, getModule, searchModules, getHomeModules, getEnrolledModules, getInstructingModules, deleteModule, getModuleEdit} from '../controllers/modules.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getMyModules);
router.get('/home', auth, getHomeModules);
router.get('/enrolled', auth, getEnrolledModules);
router.get('/instructing', auth, getInstructingModules);
router.get('/limit/:limit', auth, getMyModulesLimit);
router.get('/:mid', auth, getModule);
router.get('/edit/:mid', auth, getModuleEdit);
router.delete('/:mid', auth, deleteModule);
//router.get('/:mid/section/:sid', auth, getModuleSection);
router.post('/', auth, createModule);
router.get('/search/:query', searchModules);

router.get('/image/:mid', getModuleImage);

export default router;
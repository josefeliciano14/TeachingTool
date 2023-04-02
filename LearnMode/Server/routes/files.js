import express from 'express';

import {getFile, uploadFile} from '../controllers/dynamic.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFile);
router.post('/', uploadFile);

export default router;
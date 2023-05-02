import express from 'express';

import {signin, signup, getProfile, updateProfile, getProfilePicture, getRole} from '../controllers/users.js'

import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/profile/picture/:uid', getProfilePicture);
router.get('/role', auth, getRole);

export default router;
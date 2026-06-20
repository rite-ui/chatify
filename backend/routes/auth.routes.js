import express from 'express';
import {
    register,
    login,
    logout,
    getMe,
    verifyEmail,
    forgotPassword,
    resetPassword,
    updateProfile
} from '../controllers/authcontrollers.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login',login);
router.post('/logout',protect,logout);
router.get('/me',protect,getMe);
router.get('/verify-email/:token',verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token',resetPassword);
router.put('/update-profile',protect,updateProfile);

export default router;
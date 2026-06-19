import crypto from 'crypto';
import User from '../models/user.model.js';
import { sendTokenResponse, generateToken} from '../utils/jwt.js';
import {sendEmail} from '../utils/email.js';

// @POST /api/auth/register
export const register = async (req, res, next) => {
    try {
        const {username,email, password} = req.body;

        if(!username || !email || !password){
            return res.status(400).json({success:false, message:'All fields are required'});
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); //24

        const user = await User.create({
            username,
            email,
            password,
            verificationToken,
            verificationTokenExpiry,
            avatar: `https://api.dicebear.com/8.x/avataaars/svg?seed=${username}`,
        });

        await sendEmail({
            to: email,
            templateName: 'verification',
            data: [username, verificationToken, process.env.CLIENT_URL],
        });

        sendTokenResponse(user,201, res)
    } catch (error) {
        next(error);
    }
};

// @POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({email}).select('+password');
       if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        user.status = 'online';
        user.lastSeen = new Date();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @POST /api/auth/logout
export const logout = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user_id,{
            status: 'offline',
            lastSeen: new Date(),
        });

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

// @GET /api/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user.toPublicProfile() });
};

// @GET /api/auth/verify-email/:token
export const verifyEmail = async(req, res, next) => {
    try {
        const {token} =  req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
        }


        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        next(error);
    }
};

// @POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If this email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: email,
      templateName: 'passwordReset',
      data: [user.username, resetToken, process.env.CLIENT_URL],
    });

    res.status(200).json({ success: true, message: 'Password reset email sent.' });
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/reset-password/:token
export const resetPassword = async (req, res, next) => {
    try {
        const {token} = req.params;
        const {password} = req.body;

        if(!password || password.length < 6){
            return res.status(400).json({success: false, message:'password must be atleast 6 characters'})
        }

        const user = await User.findOne({
            resetPasswordToken : token,
            resetPasswordExpiry : {$gt: Date.now()},
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        sendTokenResponse(user,200,res);
    } catch (error) {
        next(error);
    }
};

// @PUT /api/auth/update-profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, user: user.toPublicProfile() });
  } catch (error) {
    next(error);
  }
};
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username must be less than 30 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Exclude password from query results by default
    },
    avatar: {
        type: String,
        default: '',
    },
    bio:{
        type: String,
        maxlength: [200, 'Bio must be less than 200 characters long'],
        default: '',
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'away'],
        default: 'offline'
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    varificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastSeen: {
        type: Date,
        default: Date.now,
    },
    friends: [{type: mongoose.Schema.Types.ObjectId,ref: 'User'}],
    friendRequests: [
        {
            from: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            createdAt: {type: Date, default: Date.now()}
        },
    ],
    },
    {timestamps: true}
);

// Hash password before saving
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (no sensitive data)
userSchema.methods.toPublicProfile = function() {
    return {
        _id: this._id,
        username: this.username,
        email: this.email,
        avatar: this.avatar,
        bio: this.bio,
        status: this.status,
        isVarified: this.isVarified,
        lastSeen: this.lastSeen,
        friends: this.friends,
    };
}

const User = mongoose.model('User', userSchema);

export default User;
    

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your full name']
    },
    telephone: {
        type: String,
        required: [true, 'Please add your telephone number']
    },
    email: {
        type: String,
        required: [true, 'Please add your email'],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add your password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    address: {
        type: String,
        required: [true, 'Please add your address'],
        trim: true, // Cutoff the space at the beginning & the end
        maxlength: [500, 'Address can not be more than 500 characters']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers [longitude, latitude]
            index: '2dsphere'
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    // Create salt by bcrypt
    const salt = await bcrypt.genSalt(10);
    // Hashing salt within our password
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken=function() {
    // Bring our data to encrypt with JWT
    return jwt.sign(
        {id: this._id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRE}
    );
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);
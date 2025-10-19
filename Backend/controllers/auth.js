const User = require('../models/User');

//@desc    Register user
//@route   POST /api/v1/auth/register
//@access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user 
        const user = await User.create({
            name,
            telephone,
            email,
            password,
            role,
            address,
            location: {
                type: 'Point',
                coordinates: [lon, lat] // Must always be 'lon' before 'lat'
            }
        });

        sendTokenResponse(user, 200, res); // Use this function to create token & send status
    } catch (err) {
        res.status(400).json({ success: false });
        console.log(err.stack);
    }
};

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
    // Validate email & password
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: 'Please provide an email and password'
        });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(400).json({
            success: false,
            msg: 'Invalid credentials'
        });
    }

    //Check if password is matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            msg: 'Invalid credentials'
        });
    }

    sendTokenResponse(user, 200, res); // Use this function to create token & send status
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Since it was a millsecond
        httpOnly: true
    };

    // If in 'production' mode
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};

//@desc     Get current Logged in user
//@route    POST /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    });
};
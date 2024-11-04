import UserModel from '../models/User.js';
import { createError } from '../utils/error.js';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { sendAdminVerificationEmail } from '../services/sendAdminVerificationEmail.js';
import TemporaryUserModel from '../models/TemporaryUserModel.js';

// Registration Controller
export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Create new temporary user instance
        const newUser = await TemporaryUserModel.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });

        // Send verification email to admin
        await sendAdminVerificationEmail(newUser);

        res.status(200).json({ message: "User has been created and is awaiting admin verification." });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return next(createError(400, "Username or Email already exists"));
        }
        next(createError(500, "Error creating user"));
    }
};

// User Verification Controller
export const verifyUser = async (req, res, next) => {
    const tempUserEmail = req.query.userEmail;

    if (!tempUserEmail) {
        return next(createError(400, "Temporary User email is required"));
    }

    try {
        const tempUser = await TemporaryUserModel.findOne({ where: { email: tempUserEmail } });

        if (!tempUser) {
            return next(createError(404, "User not found in temporary records"));
        }

        // Move data to the UserModel
        const verifiedUser = await UserModel.create({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            emailVerified: true,
        });

        // Optionally, delete the temporary user record after successful verification
        await TemporaryUserModel.destroy({ where: { email: tempUserEmail } });

        res.status(200).json({ message: 'User verified successfully', user: verifiedUser });
    } catch (error) {
        console.error('Error verifying user:', error);
        next(createError(500, "Could not verify user"));
    }
};

// Login Controller
export const login = async (req, res, next) => {
    try {
        // Find user by email
        const user = await UserModel.findOne({
            where: {
                email: req.body.email,
            },
        });  

        // Check if user exists
        if (!user) return next(createError(404, "User not found"));

        // Check password
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) return next(createError(401, "Wrong Password"));

        // Create payload for the JWT
        const payload = {
            id: user.userId,
            email: user.email,
        };

        // Generate the token
        const token = Jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '24h' });

        // Destructure user object, omitting password
        const { password, ...otherDetails } = user.dataValues;

        // Set the access_token cookie and return user details
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict"
        }).status(200).json({
            message: "Login successful",
            user: otherDetails,
            token: token
        });
    } catch (error) {
        next(createError(500, "Error logging in user"));
    }
};
export const checkUser = async (req, res, next) => {
    try {
        console.log("Request Params:", req.params); 
        const { id } = req.params;

        // Validate id format (optional)
        if (!id || typeof id !== 'string') {
            return next(createError(400, "Invalid user ID format"));
        }

        // Retrieve token from cookies or headers
        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
        console.log("Token:", token);

        // Check for token presence
        if (!token) {
            console.log("Token missing: Unauthorized access");
            return next(createError(401, "Unauthorized access"));
        }

        // Verify the token
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // Find user in the database by userId
        const user = await UserModel.findOne({ where: { userId: id } });
        if (!user) {
            console.log("User not found for ID:", id);
            return res.status(404).json({ message: "User not found" });
        }

        // User authenticated and exists
        res.status(200).json({ message: "User is authenticated and exists", user });
    } catch (error) {
        console.error("Error occurred:", error); // Log the error for debugging

        // Handle different token-related errors
        if (error instanceof Jwt.JsonWebTokenError) {
            console.log("Invalid token:", error);
            return next(createError(401, "Invalid token, please log in again"));
        }
        if (error instanceof Jwt.TokenExpiredError) {
            console.log("Token expired:", error);
            return next(createError(401, "Token has expired, please log in again"));
        }

        // Log unexpected errors
        console.log("Error verifying user:", error);
        return next(createError(500, "Error verifying user"));
    }
};

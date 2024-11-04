import express from 'express';
import bodyParser from 'body-parser';
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import pkg from 'mysql';
import UserModel from './models/User.js';
import multer from 'multer';
import path from 'path'
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary';

import photoSessionRoutes from './routes/photoSessionRoutes.js'

import cors from 'cors';
import dotenv from 'dotenv';
import { connect } from './config/db.js'; 

dotenv.config();
const { error } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware


// List specific allowed origins
// const allowedOrigins = ['https://visibledashboard.netlify.app', 'http://localhost:5173'];

// app.use(cors({
//     origin: function (origin, callback) {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin || origin === 'public') {
//             // Allow listed origins, public access, and requests with no origin (server-side requests)
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));

// // Preflight request handling
// app.options('*', cors());


// // Preflight request handling



// Allow all origins
app.use(cors({
    origin: true, // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Preflight request handling
app.options('*', cors());


  
app.use(bodyParser.json());

// dataBase conectivity
const initializeDatabase = async () => {
    try {
        await connect(); // Connect to the database
        await UserModel.sync({ force: false }); // Sync the UserModel (create table if it doesn't exist)
        console.log("User table has been created (if it didn't exist).");
    } catch (error) {
        console.error("Error during database initialization:", error.message);
    }
};

// Call the initialization function
initializeDatabase();


app.use(express.json())
app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/photoSession', photoSessionRoutes);
app.use('/images', express.static(path.resolve('public', 'images')));



app.use((error, req, res, next) => {
    const errorStatus = error.status || 500
    const errorMsg = error.message || "Somthing is wrong"
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMsg,
      stack: error.stack,
    })
  
    // return res.status(500).json("error find in page", Error)
  })
  

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

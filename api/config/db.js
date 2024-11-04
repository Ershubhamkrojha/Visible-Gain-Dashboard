// // databaseConnectivity.js
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// // Create a Sequelize instance
// const DatabaseConnectivity = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'mysql', // Specify the dialect you are using
// });

// // Test the connection
// const connect = async () => {
//     try {
//         await DatabaseConnectivity.authenticate(); // Use Sequelize's authenticate method
//         console.log("Connected to MySQL database");
//     } catch (error) {
//         console.error("Error connecting to MySQL database:", error.message);
//         throw error;
//     }
// };

// // Export the connect function and sequelize instance
// export { connect, DatabaseConnectivity };
// databaseConnectivity.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from '../models/User.js'; // Import your UserModel here

dotenv.config();

// Create a Sequelize instance
const DatabaseConnectivity = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql', // Specify the dialect you are using
});

// Test the connection
const connect = async () => {
    try {
        await DatabaseConnectivity.authenticate(); // Use Sequelize's authenticate method
        console.log("Connected to MySQL database");

        // Sync all models at once (create tables if they don't exist)
        await DatabaseConnectivity.sync({ force: false }); // Use `force: true` to drop the table first (only for development)
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Error connecting to MySQL database:", error.message);
        throw error;
    }
};

// Export the connect function and sequelize instance
export { connect, DatabaseConnectivity };

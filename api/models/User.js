// import the DB connection
import {DatabaseConnectivity} from "../config/db.js"; // Ensure you are using .js if needed

// import sequelize
import { DataTypes } from "sequelize";

// Define the User model
const UserModel = DatabaseConnectivity.define("users", {
    userId: {
        type: DataTypes.BIGINT,  // BIGINT data type for large integer IDs
        autoIncrement: true,      // Enable auto-increment
        primaryKey: true,         // Set as primary key
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,         // Username is required
        unique: true,             // Ensure usernames are unique
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,         // Email is required
        unique: true,             // Ensure emails are unique
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,         // Password is required
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,  // Column to track email verification status
        defaultValue: false,      // Set default value to false until verified
    },
    createdAt: {
        type: DataTypes.DATE,      // Use DATE for createdAt
        defaultValue: DataTypes.NOW, // Default value set to the current timestamp
        allowNull: false,          // Ensure createdAt is always set
    },
    updatedAt: {
        type: DataTypes.DATE,      // Use DATE for updatedAt
        defaultValue: DataTypes.NOW, // Default value set to current timestamp
        allowNull: false,          // Ensure updatedAt is always set
    },
}, {
    // Additional model options
    timestamps: true,             // Automatically adds createdAt and updatedAt fields
    updatedAt: 'updatedAt',       // Specify the updatedAt field name
});

// Export the User model
export default UserModel;

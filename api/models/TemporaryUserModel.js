// models/TemporaryUser.js
import { DatabaseConnectivity } from "../config/db.js"; // Ensure the correct path
import { DataTypes } from "sequelize";

const TemporaryUserModel = DatabaseConnectivity.define('TemporaryUser', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default to false until verified by admin
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

export default TemporaryUserModel;

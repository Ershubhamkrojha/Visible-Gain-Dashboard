// models/PhotoSessionSchema.js
import { DataTypes } from 'sequelize';
import { DatabaseConnectivity } from "../config/db.js";

const PhotoSessionSchema = DatabaseConnectivity.define("photo_sessions", {
    sessionId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING, // Store image path as string
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
}, {
    timestamps: true,
    updatedAt: 'updatedAt',
});

export default PhotoSessionSchema;

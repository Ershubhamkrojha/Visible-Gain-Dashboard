import User from "../models/User.js";

// Update User
export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await User.findByPk(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error); // Forward the error to the error handler
    }
};

// Delete User
export const deleteUser = async (req, res, next) => {
    try {
        // Find the user by primary key
        const user = await User.findByPk(req.params.id);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete the user
        await user.destroy();

        // Return a success message
        res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
        // Forward any error to the error handler
        next(error);
    }
};


// Get User
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error); // Forward the error to the error handler
    }
};

// Get All Users
export const getAllUser = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error); // Forward the error to the error handler
    }
};

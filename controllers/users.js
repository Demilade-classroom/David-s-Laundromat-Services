const { User } = require("../models");

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser =  await User.findByIdAndUpdate(
            userId, 
            req.body,
            { 
                new: true
            }
        ).select('-password -__v');
        if (!updatedUser) {
            return res.status(404).json({
                message: 'User does not exist or has already been deleted.'
            });
        }
        return res.status(200).json({
            message: 'User updated successfully', 
            user: updatedUser 
        });
    } catch (error) {
        console.log("error from user update >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndRemove(
            userId,
            {
                useFindAndModifiy: false
            }
        );
        if (!deletedUser) {
            return res.status(404).json({
                message: "User does not exist or has already been deleted"
            });
        }
        return res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log("error from user deletion >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("wash", "amount date").select("-password -__v");
        return res.status(200).json({
            message: `${users.length} ${users.length > 1 ? `Users`: `user`} found`,
            users
        });
    } catch (error) {
        console.log("error from users fetch >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.getAUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const foundUser = await User.findById(userId).populate("wash", "amount date").select('-password -__v');
        if (!foundUser) {
            return res.status(404).json({
                message: 'No valid entry found for the provided id'
            });
        }
        return res.status(200).json({
            user: foundUser
        });
    } catch (error) {
        console.log("error from getting a user >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

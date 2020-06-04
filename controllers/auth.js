const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/config");
const { User } = require("../models");

exports.userSignUp = async (req, res) => {
    const { name, password, email, resumptionDate, phoneNumber, homeAddress } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(409).json({
            message: "User already exists."
        });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name, 
            password: hashedPassword, 
            email, 
            resumptionDate, 
            phoneNumber, 
            homeAddress            
        });
        const savedUser = await user.save();
        return res.status(201).json({
            message: "User(staff) signed up successfully",
            result: savedUser
        });
    } catch (error) {
        console.log('error from user sign up >>>>>', error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.userSignIn = async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (!userExists || userExists.length < 1) {
        return res.status(400).json({
            message: "Invalid login credentials"
        });
    }
    try {
        const comparedPassword = await bcrypt.compare(password, userExists.password);
        if (!comparedPassword) {
            return res.status(401).json({
                message: "Invalid login credentials"
            });
        }
        const token = jwt.sign(
            {
                email: userExists.email,
                userId: userExists._id
            }, 
            JWT_SECRET, 
            {
                expiresIn: '24h'
            }
        );
        return res.status(200).json({
            message: "User logged in..",
            token
        });
    } catch (error) {
        console.log('error from user sign in >>>>>', error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

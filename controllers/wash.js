const { Wash, Customer, User } = require('../models');

exports.createAWashRecord = async (req, res) => {
    try {
        const { quantity, date, amount, payment, customer, user } = req.body;
        if(!customer && !user ) {
            return res.status(400).json({ message: 'You must fill the required fields!!' });
        }
        const wash = new Wash({
            ...req.body
        });
        const savedWash = await wash.save(); 
        const foundUser = await User.findByIdAndUpdate(
            user, 
            { 
                $push: {
                    wash: savedWash._id 
                } 
            },
            { 
                new: true 
            }
        );
        if (!foundUser) {
            return res.status(400).json({ message: 'User id is invalid' });
        }
        const foundCustomer = await Customer.findByIdAndUpdate(
            customer,
            { 
                $push: { 
                    wash: savedWash._id
                } 
            },
            { 
                new: true
            }
        );
        if (!foundCustomer) {
            return res.status(400).json({ message: 'Customer id is invalid' });
        }
        return res.json({ 
            message: 'saved',
            washrecord: savedWash
        });
    } catch (error) {
        console.log("error from wash creation >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.getAllWashRecords = (req, res) => {
    Wash
        .find()
        .populate("user", "name email")
        .populate("customer", "name email")
        .populate("payment", "paymentType date")
        .select("-__v -createdAt -updatedAt")
        .then( results => {
            return res.status(200).json({
                message: `${results.length} ${results.length > 1 ? `results`: `result`} found`,
                results
            })
        })
        .catch( err => {
            console.log("error from getting all wash  >>>>>", error);
            return res.status(500).json({
                message: "Something went wrong. Try again."
            });
        });
};

exports.getAWashRecord = (req, res) => {

    Wash.findById(req.params.washId)
    .populate("user", "name email")
    .populate("customer", "name email")
    .populate("payment", "paymentType date")
    .select("-__v -createdAt -updatedAt")
    .then( result => {
        if(!result) {
            return res.status(404).json({
                message: 'Wash record not found.'
            });
        }
        return res.status(200).json({
            wash: result
        });
    })
    .catch( err => {
        console.log("error from getting a wash record >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    })
};

exports.deleteAWashRecord = async (req, res) => {
    try {
        const deletedWash = await Wash.findByIdAndRemove(req.params.washId);
        if (!deletedWash) {
            return res.status(404).json({
                message: 'Wash  record does not exist or has already been deleted'
            });
        }
        return res.status(200).json({
            message: 'Wash record deleted successfully.'
        });
    } catch (error) {
        console.log("error from wash record deletion >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};
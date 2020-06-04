const { Customer } = require("../models");

exports.addCustomer = async (req, res) => {
    const { name, email, registrationDate, phoneNumber, homeAddress } = req.body;
    try {
        const customerExists = await Customer.findOne({ email });
        if (customerExists) {
            return res.status(401).json({
                message: "There's a record for this customer already!"
            });
        }
        const customer = new Customer({
            name, 
            email, 
            registrationDate, 
            phoneNumber, 
            homeAddress
        });
        const savedCustomer = await customer.save();
        return res.status(201).json({
            message: "Customer added successfully",
            customer: savedCustomer
        });
    } catch (error) {
        console.log("error from customer sign up >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customerFound = await Customer.findByIdAndUpdate(
            req.params.customerId,
            req.body,
            {
                new: true
            }
        );
        if (!customerFound) {
            return res.status(404).json({
                message: "Customer does not exist or has already been deleted"
            });
        }
        return res.status(200).json({
            message: "Customer updated successfully",
            customer: customerFound
        });
    } catch (error) {
        console.log("error from customer update >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndRemove(req.params.customerId);
        if (!deletedCustomer) {
            return res.status(404).json({
                message: "Customer does not exist or has already been deleted"
            });
        }
        return res.status(200).json({
            message: "Customer deleted successfully"
        });
    } catch (error) {
        console.log("error from customer deletion >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate("wash", "amount date").select("-__v");
        return res.status(200).json({
            message: `${customers.length} ${customers.length > 1 ? `Customers`: `Customer`} found`,
            data: customers
        });
    } catch (error) {
        console.log("error from all customers fetch >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customerDoc = await Customer.findById(customerId).select("-__v");
        if (!customerDoc) {
            return res.status(404).json({
                message: 'No valid entry found for the provided id'
            });
        }
        return res.status(200).json({
            message: "Customer found..",
            customer: customerDoc
        });
    } catch (error) {
        console.log("error from a customer fetch >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

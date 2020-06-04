const { Payment, Wash } = require('../models');

exports.enterAPaymentRecord = async (req, res) => {
    try {
        const { wash, date, paymentType } = req.body;
        const payment = new Payment({
            ...req.body
        });
        const savedPayment = await payment.save();
        await Wash.findByIdAndUpdate(
            wash,
            { $push: { payment: savedPayment._id }},
            { new: true }
        );
        return res.status(201).json({
            message: "payment saved",
            paymentrecord: savedPayment
        });
    } catch (error) {
        console.log("error from a entering payment >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.getAllPaymentRecords = async (req, res) => {
    try {
        const payments = await Payment.find().populate("wash", "amount quantity user customer date").select("-__v -updatedAt");
        return res.status(200).json({
            message: `${payments.length} ${payments.length > 1 ? `Payments`: `Payment`} recorded`,
            payments
        });
    } catch (error) {
        console.log("error from getting all payment records >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.getAPaymentRecord = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const payment = await Payment.findById(paymentId).populate("wash", "amount quantity user customer date").select("-__v -updatedAt");
        if (!payment) {
            return res.status(404).json({
                message: 'Payment record not found.'
            });
        }
        return res.status(200).json({
            payment
        });
    } catch (error) {
        console.log("error from getting a payment record >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};

exports.deleteAPaymentRecord = async (req, res) => {
    try {
        const { paymentId } = req.params;
        const removedPayment = await Payment.findByIdAndRemove(paymentId);
        if (!removedPayment) {
            return res.status(404).json({
                message: "Payment record does not exist or has already been deleted."
            });
        }
        return res.status(200).json({
            message: "Payment record deleted successfully"
        });
    } catch (error) {
        console.log("error from payment deletion >>>>>", error);
        return res.status(500).json({
            message: "Something went wrong. Try again."
        });
    }
};
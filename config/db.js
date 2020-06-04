const mongoose = require("mongoose");
const { MONGOURI } = require("./config");

const dbConnect = () => {
    mongoose
    .connect(MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(() => console.log("💻 Database Connected sucessfully.."))
    .catch(err => console.log('error from database connection >>>>>', err));
};

module.exports = dbConnect;

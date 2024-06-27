const mongoose = require("mongoose");
require("dotenv").config();

const URI = process.env.MONGODB_URI;
const localURI = 'mongodb://localhost:27017/progryss_crm';

const connectDb = async () =>{
    try {
        await mongoose.connect(localURI);
        console.log('connect to db');
    } catch (error) {
        console.error('db connect failed');
        process.exit(0)
    }
}

module.exports = connectDb;
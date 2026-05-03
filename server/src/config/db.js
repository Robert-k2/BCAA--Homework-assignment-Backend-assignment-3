const mongoose = require("mongoose");//import mongoose

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);//shows error message in the console 
    process.exit(1);
  }
};// function to connect to the data dase 

module.exports = connectDB; //exports the connect function 



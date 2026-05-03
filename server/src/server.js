require("dotenv").config();//load environment variables from the .env file into process.env
console.log("MONGO_URI:", process.env.MONGO_URI);// print the MongoDB URI to confirm it is loaded correctly

const app = require("./app");// import the Express application configuration

const connectDB = require("./config/db");// import the database connection function


const PORT = process.env.PORT || 5000;// set the server port (use .env value or default to 5000)

connectDB();// call the function to connect to MongoDB before starting the server

app.listen(PORT, () => {// start the Express server and listen on port 5000

  console.log(`Server running on port ${PORT}`);// logs that serve is running 
});



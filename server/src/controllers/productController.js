const Product = require("../models/Product");//import the product model to interate with the products collection 
// CREATE PRODUCT
exports.createProduct = async (req, res) => {//define controller function for product creation 
  try {
    const product = await Product.create(req.body);
    res.status(201).json({// sent HTTP status 201 if successful 
      success: true,
      data: product
    });
  } catch (error) { //catch any errors 
    res.status(400).json({ message: error.message });
  }
};

//GET ALL PRODUCTS

exports.getAllProducts = async (req, res) => {//function to retrieve  all products 
  try {
    const products = await Product.find();//fetch all product documents from the database 

    res.status(200).json({ //Send HTTP status 200
      success: true,// shows successful operation
      data: products // returns list of products 
    });
  } catch (error) { //catch any server/database errors 
    res.status(500).json({ message: error.message }); //send HTTP 400 with error message 
  }
};


const express = require("express");//import express framework 
const router = express.Router();//creates router instance to define route handlers 

router.get("/", (req, res) => {//define a get request for the base route 
  res.json({ message: "inventory logs working" });//sends a JSON response confirming the route works 
});

module.exports = router;//exports the router to be used in app.js 
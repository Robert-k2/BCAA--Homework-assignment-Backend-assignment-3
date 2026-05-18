const asyncHandler = (fn) => (req, res, next) =>//wrapper funtion that takes a sync function 
  Promise.resolve(fn(req, res, next)).catch(next);//excutes async function and ensures it returns a Promise

module.exports = asyncHandler;//exports asyncHandler function to be used in controllers 
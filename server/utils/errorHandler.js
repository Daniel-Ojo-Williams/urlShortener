export default (error, req, res, next) => {
  let statusCode = error.statusCode || 500
  res.status(statusCode).json({status:error.status, message: error.message});
  next();
};

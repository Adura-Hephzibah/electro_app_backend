const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendProdError(err, res);
  }
};

function sendDevError(err, res) {
  const { statusCode, isOperational } = err 
  res.status(err.statusCode).json({
    status: err.status,
    error: { statusCode, isOperational },
    message: err.message,
  });
  console.error(err); 
}

function sendProdError(err, res) {
  if (isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
    
    console.error(err);
}

module.exports = {
    errorHandler,
}
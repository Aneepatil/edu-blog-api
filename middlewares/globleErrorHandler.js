export const globleErrorHandler=(error, req, res, next) => {
    const stack = error.stack;
    const message = error.message;
    const status = error.status ? error.status : "Failed";
    const statusCode = error?.statusCode ? error.statusCode : 500;
  
    // Send the message
  
    res.status(statusCode).json({ message,stack,status });
  }

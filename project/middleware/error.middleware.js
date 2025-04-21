export const errorHandler = (err, req, res, next) => {
  // Log the error for server-side debugging
  console.error(err.stack);

  // Default error status and message
  let status = err.status || 500;
  let message = err.message || 'Something went wrong on the server';

  // Custom error responses based on error type
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Authentication required';
  } else if (err.name === 'ForbiddenError') {
    status = 403;
    message = 'Access denied';
  }

  // In production, never expose stack traces or internal error details
  const environment = process.env.NODE_ENV || 'development';
  const responseData = {
    success: false,
    message,
    // Only include error details in development
    ...(environment === 'development' && { details: err.details || err.message })
  };

  res.status(status).json(responseData);
};
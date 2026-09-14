export function errorHandler(err, req, res, next) {
  console.error('[ServerError]', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    success: false,
    error: {
      message,
      status,
      timestamp: new Date().toISOString()
    }
  });
}

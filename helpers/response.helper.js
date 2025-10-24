exports.success = (message, data = null, status = 200) => ({
    status,
    succeeded: true,
    message,
    ...(data && { data }),
  });
  
  exports.error = (message, status = 400) => ({
    status,
    succeeded: false,
    message,
  });

  exports.handleResponse = (res, result) => {
    return res.status(result.status).json(result);
  };
const  success = (message, data = null, status = 200) => ({
    status,
    succeeded: true,
    message,
    ...(data && { data }),
  });
  
  const  error = (message, status = 400) => ({
    status,
    succeeded: false,
    message,
  });

  const  handleResponse = (res, result) => {
    return res.status(result.status).json(result);
  };

  module.exports={
    success,
    handleResponse,
    error
  }
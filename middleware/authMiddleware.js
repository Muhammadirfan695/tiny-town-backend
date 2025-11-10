const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { error } = require('../helpers/response.helper');


const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        succeeded: false,
        message: "Not Authorized"
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({
            succeeded: false,
            message: "Token Expired",
          });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(401).json({
            succeeded: false,
            message: 'Invalid Token',
          });
        } else if (err.name === "NotBeforeError") {
          return res.status(401).json({
            succeeded: false,
            message: "Token Not Active",
          });
        } else {
          return res.status(401).json({
            succeeded: false,
            message: "Not Authorized or Expired Token"
          });
        }
      }
      console.log("decodedToken", decodedToken)

      req.userId = decodedToken.id;
      req.userRole = decodedToken.role;
      next();
    });
  } catch (error) {
    console.error("JWT Middleware Error:", error);
    res.status(500).json({
      succeeded: false,
      message: `Server Error: ${error}`,
    });
  }
});


const authorize = (...allowedRoles) =>
  expressAsyncHandler(async (req, res, next) => {
    let token;
    try {
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return res.status(401).json({
          succeeded: false,
          message: "Not Authorized"
        });
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(401).json({
              succeeded: false,
              message: "Token Expired",
            });
          } else if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
              succeeded: false,
              message: "Invalid Token"
            });
          } else {
            return res.status(401).json({
              succeeded: false,
              message: "Not Authorized or Expire Token"
            });
          }
        }

        req.userId = decodedToken.id;
        req.userRole = decodedToken.role;

        if (allowedRoles.length && !allowedRoles.includes(req.userRole)) {
          return res.status(403).json({
            succeeded: false,
            message: "Permission Denied"
          });
        }

        next();
      }
      );
    }

    catch (error) {
      console.error("Authorization Middleware Error:", error);
      res.status(500).json({
        succeeded: false,
        message: `Server Error: ${error}`,
      });
    }
  });

const apiKeyAuth = (req, res, next) => {

  const regularKey = process.env.X_API_KEY;
  const adminKey = process.env.X_API_ADMIN_KEY;

  const reqApiKey = req.headers["x-api-key"];
  const reqAdminKey = req.headers["x-api-admin-key"];


  if (req.originalUrl.startsWith("/api/admin")) {
    if (!reqAdminKey || reqAdminKey !== adminKey) {
      return res.status(401).json({
        succeeded: false,
        message: "Admin API KEY is Missing or Invalid"
      });
    }
    return next();
  }
u
  if (!reqApiKey || reqApiKey !== regularKey) {
    return res.status(401).json({
      succeeded: false,
      message: "API KEY is Missing or Invalid"
    });
  }

  next();
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log("req.body",req.body)
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    const errResponse = error(formattedErrors, 400);
    return res.status(errResponse.status).json(errResponse);
  }

  next();
};
const ERROR_LIST = {

  GET_SUCCESSFULLY: 'Record List Fetched Successfully',
  INVALID_DATA: 'INVALID RECORD DATA',
  UPDATE: 'Record Updated Successfully',
  NOT_FOUND: 'Record Not Found',
  ALL_FIELD_REQUIRED: 'Fill All Fields',
  ALREADY_EXIST: "Already exists",
  INTERNAL_ERROR: 'An internal error occurred',

}

module.exports = { validateRequest, ERROR_LIST, protect, authorize, apiKeyAuth };

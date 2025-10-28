const jwt = require('jsonwebtoken');
const expressAsyncHandler = require('express-async-handler');


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

    // ✅ Verify token
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
      // ✅ Attach decoded data to req
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


// const authorize = (...allowedRoles) =>
//   expressAsyncHandler(async (req, res, next) => {
//     let token;
//     try {
//       // ✅ Extract Bearer token
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith("Bearer")
//       ) {
//         token = req.headers.authorization.split(" ")[1];
//       }

//       if (!token) {
//         return res.status(401).json({
//           succeeded: false,
//           message: "Not Authorized"
//         });
//       }

//       // ✅ Verify token
//       jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//         if (err) {
//           if (err.name === "TokenExpiredError") {
//             return res.status(401).json({
//               succeeded: false,
//               message: "Token Expired",
//             });
//           } else if (err.name === "JsonWebTokenError") {
//             return res.status(401).json({
//               succeeded: false,
//               message: "Invalid Token"
//             });
//           } else {
//             return res.status(401).json({
//               succeeded: false,
//               message: "Not Authorized or Expire Token"
//             });
//           }
//         }
        

//         // ✅ Attach decoded data
//         req.userId = decodedToken.id;
//         req.userRole = decodedToken.role;

//         // ✅ Role check
//         if (allowedRoles.length && !allowedRoles.includes(req.userRole)) {
//           return res.status(403).json({
//             succeeded: false,
//             message: "Permission Denied"
//           });
//         }

//         next();
//       }
//     );
//     } 
    
//     catch (error) {
//       console.error("Authorization Middleware Error:", error);
//       res.status(500).json({
//         succeeded: false,
//         message: `Server Error: ${error}`,
//       });
//     }
//   });
const authorize = (...allowedRoles) => // e.g., authorize('Admin')
  expressAsyncHandler(async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // --- THIS IS THE CORRECT, SIMPLIFIED LOGIC ---

        // 1. Attach user data to the request for later use
        req.userId = decodedToken.id;
        req.userRole = decodedToken.role; // This will be the string "Admin"

        // 2. Perform ONE clear role check
        // Check if the list of allowed roles includes the user's role
        if (allowedRoles.length && !allowedRoles.includes(req.userRole)) {
          // If not, deny permission
          return res.status(403).json({
            succeeded: false,
            message: "Permission Denied: You do not have the required role.",
          });
        }

        // 3. If the check passes, proceed to the next function (the controller)
        next();
        
      } catch (error) {
        // This will catch any errors from jwt.verify (e.g., expired or invalid token)
        return res.status(401).json({
          succeeded: false,
          message: "Not authorized, token failed.",
        });
      }
    }

    if (!token) {
      return res.status(401).json({
        succeeded: false,
        message: "Not authorized, no token provided.",
      });
    }
  });

const apiKeyAuth = (req, res, next) => {
    const regularKey = process.env.X_API_KEY;
    const adminKey = process.env.X_API_ADMIN_KEY;

    // Check karein ke request admin route ke liye hai ya nahi
    if (req.originalUrl.startsWith("/api/admin")) {
        // Admin route ke liye, X-API-ADMIN-KEY header ko check karein
        const reqAdminKey = req.headers["x-api-admin-key"]; // small letters mein check karein
        if (!reqAdminKey || reqAdminKey !== adminKey) {
            return res.status(401).json({
                succeeded: false,
                message: "Admin API KEY is Missing or Invalid"
            });
        }
    } else {
        // Regular routes ke liye, X-API-KEY header ko check karein
        const reqApiKey = req.headers["x-api-key"]; // small letters mein check karein
        if (!reqApiKey || reqApiKey !== regularKey) {
            return res.status(401).json({
                succeeded: false,
                message: "API KEY is Missing or Invalid"
            });
        }
    }
    
    next();
};
// const apiKeyAuth = (req, res, next) => {

//   const regularKey = process.env.X_API_KEY;
//   const adminKey = process.env.X_API_ADMIN_KEY;

//   const reqApiKey = req.headers["x-api-key"];
//   const reqAdminKey = req.headers["x-api-admin-key"];


//   if (req.originalUrl.startsWith("/api/admin")) {
//     if (!reqAdminKey || reqAdminKey !== adminKey) {
//       return res.status(401).json({
//         succeeded: false,
//         message: "Admin API KEY is Missing or Invalid"
//       });
//     }
//     return next();
//   }

//   // ✅ All other routes
//   if (!reqApiKey || reqApiKey !== regularKey) {
//     return res.status(401).json({
//       succeeded: false,
//       message: "API KEY is Missing or Invalid"
//     });
//   }

//   next();
// };
const ERROR_LIST = {

  GET_SUCCESSFULLY: 'Record List Fetched Successfully',
  INVALID_DATA: 'INVALID RECORD DATA',
  UPDATE: 'Record Updated Successfully',
  NOT_FOUND: 'Record Not Found',
  ALL_FIELD_REQUIRED: 'Fill All Fields',
  ALREADY_EXIST: "Already exists",
  INTERNAL_ERROR: 'An internal error occurred',

}

module.exports = { ERROR_LIST,  protect, authorize, apiKeyAuth };

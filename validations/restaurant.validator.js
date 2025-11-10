const { body, validationResult } = require("express-validator");

const createRestaurantValidationRules = () => {
  return [

    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .isString()
      .withMessage("Name must be a string."),


    body("description")
      .optional()
      .trim()
      .isString()
      .withMessage("Description must be a string."),


    body("address")
      .trim()
      .notEmpty()
      .withMessage("Address is required."),

    body("phone_number")
      .optional()
      .trim()
      .custom((value) => {
        const phoneRegex = /^\+?(\d{1,4})?[\s\-\.]?\(?\d{1,4}\)?[\s\-\.]?\d{1,4}[\s\-\.]?\d{1,9}$/;
        if (!phoneRegex.test(value)) {
          throw new Error("Must be a valid phone number.");
        }
        const digitsCount = value.replace(/\D/g, "").length;
        if (digitsCount < 10 || digitsCount > 15) {
          throw new Error("Must contain a valid number of digits (10–15).");
        }
        return true;
      }),


    body("contact_email")
      .optional()
      .isEmail()
      .withMessage("Must be a valid email address.")
      .normalizeEmail(),


    body("cuisine_type")
      .optional()
      .trim()
      .isString()
      .withMessage("Cuisine type must be a string."),


    body("country")
      .optional()
      .trim()
      .isString()
      .withMessage("Country must be a string."),


    body("city")
      .optional()
      .trim()
      .isString()
      .withMessage("City must be a string."),

    body("latitude")
      .optional()
      .custom((value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < -90 || num > 90) {
          throw new Error("Latitude must be a number between -90 and 90.");
        }
        return true;
      }),

    body("longitude")
      .optional()
      .custom((value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < -180 || num > 180) {
          throw new Error("Longitude must be a number between -180 and 180.");
        }
        return true;
      }),

    body("tags")
      .optional()
      .custom((value) => {
        if (Array.isArray(value)) {
          if (!value.every((tag) => typeof tag === "string")) {
            throw new Error("Each tag must be a string.");
          }
        } else if (typeof value === "string") {
          const tags = value
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
          if (!tags.length) {
            throw new Error("Tags must not be empty.");
          }
        } else {
          throw new Error("Tags must be an array or a comma-separated string.");
        }
        return true;
      }),

    body("owner_id")
      .optional({ checkFalsy: true, nullable: true })
      .isUUID()
      .withMessage("Owner ID must be a valid UUID."),

    body("manager_id")
      .optional({ checkFalsy: true, nullable: true })
      .isUUID()
      .withMessage("Manager ID must be a valid UUID."),
  ];
};
 
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(422).json({
    succeeded: false,
    message: "Validation failed",
    errors: extractedErrors,
  });
};

module.exports = {
  createRestaurantValidationRules,
  validate,
};

const { body, validationResult } = require("express-validator");
const { error } = require("../helpers/response.helper");

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

    body("address").trim().notEmpty().withMessage("Address is required."),

    body("phone_number")
      .optional()
      .trim()
      .isMobilePhone("any", { strictMode: false })
      .withMessage("Must be a valid phone number."),

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

    // body("service_model")
    //   .optional()
    //   .isJSON()
    //   .withMessage(
    //     'Service model must be a valid JSON array string (e.g., \'["dine-in", "takeaway"]\').'
    //   ),

  ];
};
// 
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

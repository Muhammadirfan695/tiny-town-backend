const { body,  param } = require("express-validator");
const { error } = require("../helpers/response.helper");



const createDishValidator = [
    body("name")
        .notEmpty()
        .withMessage("Dish name is required.")
        .isString()
        .withMessage("Dish name must be a string."),
    body("price")
        .notEmpty()
        .withMessage("Price is required.")
        .isFloat({ gt: 0 })
        .withMessage("Price must be a positive number."),
    // body("menuIds")
    //     .isArray({ min: 1 })
    //     .withMessage("At least one menu ID is required."),
    body("quantity")
        .optional()
        .isString()
        .withMessage("Quantity must be a string (e.g., '2 person' or '800g')."),
    body("validity_start")
        .optional()
        .isISO8601()
        .withMessage("Validity start must be a valid date."),
    body("validity_end")
        .optional()
        .isISO8601()
        .withMessage("Validity end must be a valid date."),
    body()
        .custom((value, { req }) => {
            const { validity_start, validity_end } = req.body;

            if (validity_start && validity_end) {
                const start = new Date(validity_start);
                const end = new Date(validity_end);

                if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                    throw new Error("Invalid date format for validity_start or validity_end.");
                }

                if (start > end) {
                    throw new Error("Validity start date must be before or equal to end date.");
                }
            }

            return true;
        }),
    body("published")
        .optional()
        .isBoolean()
        .withMessage("Published must be true or false."),
    body().custom((_, { req }) => {
        if (!req.files || req.files.length === 0) {
            return true; // No attachments → fine
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
        for (const file of req.files) {
            if (!allowedTypes.includes(file.mimetype)) {
                throw new Error(
                    `Invalid file type for ${file.originalname}. Only JPEG, PNG, JPG, and WEBP are allowed.`
                );
            }
        }
        return true;
    }),
];
const getDishValidator = [
    param("id")
      .notEmpty()
      .withMessage("Dish ID is required")
      .isUUID()
      .withMessage("Dish ID must be a valid UUID"),
  ];

  const updateDishValidator = [
    body("id")
      .notEmpty()
      .withMessage("Dish ID is required")
      .isUUID()
      .withMessage("Dish ID must be a valid UUID"),
    body("name")
      .optional()
      .isString()
      .withMessage("Dish name must be a string"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("price")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Price must be a positive number"),
    body("quantity")
      .optional()
      .isString()
      .withMessage("Quantity must be a string"),
    body("validity_start")
      .optional()
      .isISO8601()
      .withMessage("Validity start must be a valid date"),
    body("validity_end")
      .optional()
      .isISO8601()
      .withMessage("Validity end must be a valid date"),
    body()
      .custom((value, { req }) => {
        const { validity_start, validity_end } = req.body;
        if (validity_start && validity_end) {
          const start = new Date(validity_start);
          const end = new Date(validity_end);
          if (start > end) {
            throw new Error("Validity start date must be before or equal to end date");
          }
        }
        return true;
      }),
    body("published")
      .optional()
      .isBoolean()
      .withMessage("Published must be true or false"),
    body("menuIds")
      .optional()
      .isArray()
      .withMessage("menuIds must be an array of UUIDs"),
    body("existingAttachmentIds")
      .optional()
      .isArray()
      .withMessage("existingAttachmentIds must be an array of UUIDs"),
  ];

module.exports = {
    createDishValidator,
    getDishValidator,
    updateDishValidator

}
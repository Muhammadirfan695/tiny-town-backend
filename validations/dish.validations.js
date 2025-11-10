const { body, param } = require("express-validator");

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
    body("restaurant_id")
        .notEmpty()
        .isUUID()
        .withMessage("Restaurant ID must be a valid UUID"),
    body("quantity")
        .optional()
        .isString()
        .withMessage("Quantity must be a string (e.g., '2 person' or '800g')."),
        body("validity_start")
        .optional({ checkFalsy: true })
        .custom((value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error("Start date must be a valid date.");
            }
            return true;
        }),

    body("validity_end")
        .optional({ checkFalsy: true })
        .custom((value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error("End date must be a valid date.");
            }
            return true;
        }),

    body().custom((_, { req }) => {
        const { validity_start, validity_end } = req.body;
        if (validity_start && validity_end) {
            const start = new Date(validity_start);
            const end = new Date(validity_end);
            if (start > end) {
                throw new Error("Start date cannot be after end date.");
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
            return true; 
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
    body("restaurant_id")
        .optional()
        .isUUID()
        .withMessage("Restaurant ID must be a valid UUID"),
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
        .optional({ checkFalsy: true })
        .custom((value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error("Start date must be a valid date.");
            }
            return true;
        }),

    body("validity_end")
        .optional({ checkFalsy: true })
        .custom((value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error("End date must be a valid date.");
            }
            return true;
        }),

    body().custom((_, { req }) => {
        const { validity_start, validity_end } = req.body;
        if (validity_start && validity_end) {
            const start = new Date(validity_start);
            const end = new Date(validity_end);
            if (start > end) {
                throw new Error("Start date cannot be after end date.");
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

];


const setMenuToDishValidator = [
    body("menuId")
      .notEmpty().withMessage("Menu ID is required")
      .isUUID().withMessage("Menu ID must be a valid UUID"),
  
    body("dishIds")
      .isArray({ min: 1 }).withMessage("dishIds must be a non-empty array"),
  
    body("dishIds.*")
      .isUUID().withMessage("Each dish ID must be a valid UUID"),
  ];

module.exports = {
    createDishValidator,
    getDishValidator,
    updateDishValidator,
    setMenuToDishValidator

}
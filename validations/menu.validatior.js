const { body, param } = require("express-validator");


const createMenuValidator = [
    body("restaurant_id")
        .notEmpty().withMessage("Restaurant ID is required")
        .isUUID().withMessage("Restaurant ID must be a valid UUID"),

    body("name")
        .notEmpty().withMessage("Menu name is required")
        .isString().withMessage("Menu name must be a string")
        .isLength({ min: 2 }).withMessage("Menu name must be at least 2 characters long"),

    body("description")
        .optional()
        .isString().withMessage("Description must be a string"),

    // body("timingStart")
    //     .notEmpty().withMessage("Timing start is required")
    //     .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    //     .withMessage("Timing start must be a valid time (HH:mm or HH:mm:ss)"),

    // body("timingEnd")
    //     .notEmpty().withMessage("Timing end is required")
    //     .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    //     .withMessage("Timing end must be a valid time (HH:mm or HH:mm:ss)")
    //     .custom((timingEnd, { req }) => {
    //         const timingStart = req.body.timingStart;
    //         if (!timingStart) return true;

    //         const [hStart, mStart] = timingStart.split(":").map(Number);
    //         const [hEnd, mEnd] = timingEnd.split(":").map(Number);
    //         const startTotal = hStart * 60 + mStart;
    //         const endTotal = hEnd * 60 + mEnd;

    //         if (endTotal <= startTotal) {
    //             throw new Error("Timing end must be after timing start");
    //         }
    //         return true;
    //     }),

    body("status")
        .optional()
        .isBoolean().withMessage("Status must be true or false"),
];

const updateMenuValidator = [
    body("id")
        .notEmpty()
        .withMessage("Menu ID is required")
        .isUUID()
        .withMessage("Menu ID must be a valid UUID"),

    body("name")
        .optional()
        .isString()
        .withMessage("Menu name must be a string")
        .trim(),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .trim(),

    body("restaurant_id")
        .optional()
        .isUUID()
        .withMessage("Restaurant ID must be a valid UUID"),

    // body("timingStart")
    //     .notEmpty().withMessage("Timing start is required")
    //     .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    //     .withMessage("Timing start must be a valid time (HH:mm or HH:mm:ss)"),

    // body("timingEnd")
    //     .notEmpty().withMessage("Timing end is required")
    //     .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
    //     .withMessage("Timing end must be a valid time (HH:mm or HH:mm:ss)")
    //     .custom((timingEnd, { req }) => {
    //         const timingStart = req.body.timingStart;
    //         if (!timingStart) return true; 

    //         const [hStart, mStart] = timingStart.split(":").map(Number);
    //         const [hEnd, mEnd] = timingEnd.split(":").map(Number);
    //         const startTotal = hStart * 60 + mStart;
    //         const endTotal = hEnd * 60 + mEnd;

    //         if (endTotal <= startTotal) {
    //             throw new Error("Timing end must be after timing start");
    //         }
    //         return true;
    //     }),

    body("status")
        .optional()
        .isBoolean().withMessage("Status must be true or false"),
];


const getMenuByIdValidator = [
    param("id")
        .notEmpty().withMessage("Menu ID is required")
        .isUUID().withMessage("Menu ID must be a valid UUID"),
];
module.exports = {
    createMenuValidator,
    updateMenuValidator,
    getMenuByIdValidator
}
const { body } = require("express-validator");

const createNewsletterValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required.")
        .isLength({ min: 3, max: 200 })
        .withMessage("Title must be between 3 and 200 characters."),

    body("content")
        .optional()
        .isString()
        .withMessage("Content must be a valid string."),

    body("type")
        .optional()
        .isIn(["manual", "weekly"])
        .withMessage("Type must be either 'manual' or 'weekly'."),

        body("restaurantIds")
        .optional()
        .custom((value) => {
            let ids = [];
            if (Array.isArray(value)) {
                ids = value;
            } else if (typeof value === "string") {
                ids = value.split(",").map((id) => id.trim()).filter(Boolean);
            } else {
                throw new Error("restaurantIds must be an array or comma-separated string.");
            }

            ids.forEach((id) => {
                if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
                    throw new Error(`Invalid restaurant ID: ${id}`);
                }
            });
            return true;
        }),

    body("recipientEmails")
        .optional()
        .custom((value) => {
            let emails = [];
            if (Array.isArray(value)) {
                emails = value;
            } else if (typeof value === "string") {
                emails = value.split(",").map((email) => email.trim()).filter(Boolean);
            } else {
                throw new Error("recipientEmails must be an array or comma-separated string.");
            }

            emails.forEach((email) => {
                const trimmed = email.trim().toLowerCase();
                if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
                    throw new Error(`Invalid email address: ${email}`);
                }
            });
            return true;
        }),
    body("image")
        .optional()
        .custom((value, { req }) => {
            if (req.file && !req.file.mimetype.startsWith("image/")) {
                throw new Error("Uploaded file must be an image.");
            }
            return true;
        }),
];


module.exports = {
    createNewsletterValidation
}
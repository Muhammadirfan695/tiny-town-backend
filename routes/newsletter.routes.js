
const express = require("express");
const { apiKeyAuth, validateRequest, authorize } = require("../middleware/authMiddleware");

const { upload } = require("../utils/uploadImage");
const { createNewsletterValidation } = require("../validations/newsletter.validations");
const { createNewsletter, updateNewsletter, getAllNewsletter, getNewsletterById, deleteNewsletterById, readyNewsletter } = require("../controllers/newsletter.controller");

const router = express.Router();

router.post(
    "/newsletter",
    upload.array("files"),
    apiKeyAuth,
    authorize("Admin"),
    createNewsletterValidation,
    validateRequest,
    createNewsletter
);
router.patch(
    "/newsletter",
    upload.array("files"),
    apiKeyAuth,
    authorize("Admin"),
    createNewsletterValidation,
    validateRequest,
    updateNewsletter
);
router.get(
    "/newsletter",
    apiKeyAuth,
    authorize("Admin"),
    getAllNewsletter
);
router.get(
    "/newsletter/:id",
    apiKeyAuth,
    authorize("Admin"),
    getNewsletterById
);
router.delete(
    "/newsletter/:id",
    apiKeyAuth,
    authorize("Admin"),
    deleteNewsletterById
);

router.patch(
    "/newsletter/:id/status",
    apiKeyAuth,
    authorize("Admin"),
    readyNewsletter
);
module.exports = router;



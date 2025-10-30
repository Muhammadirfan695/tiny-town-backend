const express = require('express');
const { createDishValidator, getDishValidator, updateDishValidator } = require('../validations/dish.validations');
const { createDish, getDish, getAllDishes, updateDish, deleteDish } = require('../controllers/dish.controller');
const { apiKeyAuth, validateRequest } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadImage');
const router = express.Router();

router.post("/dish",
    apiKeyAuth,
    upload.array("attachments"),
    createDishValidator,
    validateRequest,
    createDish);
router.get("/dish/:id", apiKeyAuth, getDishValidator, validateRequest, getDish);
router.get("/dish", apiKeyAuth, getAllDishes);
router.patch("/dish",
    apiKeyAuth,
    upload.array("attachments"),
    updateDishValidator,
    validateRequest,
    updateDish);

router.delete("/dish/:id", apiKeyAuth, getDishValidator, validateRequest, deleteDish);
module.exports = router;
const express = require('express');
const { createDishValidator, getDishValidator, updateDishValidator, setMenuToDishValidator } = require('../validations/dish.validations');
const { createDish, getDish, getAllDishes, updateDish, deleteDish, setMenuToDish, removeDishFromMenu } = require('../controllers/dish.controller');
const { apiKeyAuth, validateRequest, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../utils/uploadImage');
const router = express.Router();

router.post("/dish",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    upload.array("attachments"),
    createDishValidator,
    validateRequest,
    createDish);
router.get("/dish/:id", apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner', 'User'), getDishValidator, validateRequest, getDish);
router.get("/dish", apiKeyAuth, authorize('Admin', 'Manager', 'Owner', 'User'), getAllDishes);
router.patch("/dish",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    upload.array("attachments"),
    updateDishValidator,
    validateRequest,
    updateDish);
router.post("/set-menus",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    setMenuToDishValidator,
    validateRequest,
    setMenuToDish);
router.post("/remove-menus",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    setMenuToDishValidator,
    validateRequest,
    removeDishFromMenu);
router.delete("/dish/:id", apiKeyAuth, authorize('Admin', 'Manager', 'Owner'), getDishValidator, validateRequest, deleteDish);
module.exports = router;
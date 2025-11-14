const express = require("express");
const { apiKeyAuth, validateRequest, authorize } = require("../middleware/authMiddleware");
const { createMenu, getAllMenus, updateMenu, menuById, deleteMenu } = require("../controllers/menu.controller");
const { createMenuValidator, updateMenuValidator, getMenuByIdValidator } = require("../validations/menu.validatior");
const { upload } = require("../utils/uploadImage");

const router = express.Router();

router.post("/menu",
    apiKeyAuth,
    upload.fields([{ name: "header_image", maxCount: 1 }]),
    createMenuValidator,
    validateRequest,
    authorize('Admin', 'Manager', 'Owner'),
    createMenu);
router.get("/menu",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner', 'User'),
    getAllMenus);

router.patch("/menu",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    upload.fields([{ name: "header_image", maxCount: 1 }]),
    updateMenuValidator,
    validateRequest,
    updateMenu);
router.get("/menu/:id",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner', 'User'),
    getMenuByIdValidator,
    validateRequest,
    menuById);
router.delete("/menu/:id",
    apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    getMenuByIdValidator,
    validateRequest,
    deleteMenu);
module.exports = router;
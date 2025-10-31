const express = require("express");
const { apiKeyAuth, validateRequest } = require("../middleware/authMiddleware");
const { createMenu, getAllMenus, updateMenu, menuById, deleteMenu } = require("../controllers/menu.controller");
const { createMenuValidator, updateMenuValidator, getMenuByIdValidator } = require("../validations/menu.validatior");
const { upload } = require("../utils/uploadImage");

const router = express.Router();

router.post("/menu",
    apiKeyAuth,
    upload.fields([{ name: "header_image", maxCount: 1 }]),
    createMenuValidator,
    validateRequest,
    createMenu);
router.get("/menu",
    apiKeyAuth,
    getAllMenus);

router.patch("/menu",
    apiKeyAuth,
    upload.fields([{ name: "header_image", maxCount: 1 }]),
    updateMenuValidator,
    validateRequest,
    updateMenu);
router.get("/menu/:id",
    apiKeyAuth,
    getMenuByIdValidator,
    validateRequest,
    menuById);
router.delete("/menu/:id",
    apiKeyAuth,
    getMenuByIdValidator,
    validateRequest,
    deleteMenu);
module.exports = router;
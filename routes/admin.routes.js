const express = require("express");
const { apiKeyAuth, authorize } = require("../middleware/authMiddleware");
const { createUser, getUserById, UpdateUser, getAllUsers, deleteUser, restoreUser } = require("../controllers/admin.controller");
const { upload } = require("../utils/uploadImage");
const restaurantRoutes = require('./restaurant.routes');
const menuRoutes = require('./menu.routes')
const { createRestaurantValidationRules, validate } = require("../validations/restaurant.validator");
const { createRestaurant, deleteRestaurant } = require("../controllers/restaurant.controller");

const router = express.Router();

router.post('/users', apiKeyAuth, authorize("Admin"), createUser);
router.get('/users', apiKeyAuth, authorize("Admin"), getAllUsers);
router.patch('/user', upload.single("file"), apiKeyAuth, authorize("Admin"), UpdateUser);
router.get('/user/:id', apiKeyAuth, authorize("Admin"), getUserById);
router.delete('/user/:id', apiKeyAuth, authorize("Admin"), deleteUser);
router.post('/user/:id', apiKeyAuth, authorize("Admin"), restoreUser);

router.use('/', restaurantRoutes);
router.use('/', menuRoutes)

router.post(
    '/restaurant',
    authorize('Admin'),
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'header_image', maxCount: 1 }
    ]),
    apiKeyAuth,
    createRestaurantValidationRules(),
    validate,
    createRestaurant
);
router.delete('/restaurant/:id', apiKeyAuth, authorize('Admin'), deleteRestaurant);
module.exports = router;
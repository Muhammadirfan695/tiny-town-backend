const express = require("express");
const { apiKeyAuth, authorize } = require("../middleware/authMiddleware");
const { createUser, getUserById, UpdateUser, getAllUsers, deleteUser, restoreUser } = require("../controllers/admin.controller");
const { upload } = require("../utils/uploadImage");
const restaurantRoutes = require('./restaurant.routes'); 

const router = express.Router();

router.post('/users', apiKeyAuth, authorize("Admin"), createUser);
router.get('/users', apiKeyAuth, authorize("Admin"), getAllUsers);
router.patch('/user', upload.single("file"), apiKeyAuth, authorize("Admin"), UpdateUser);
router.get('/user/:id', apiKeyAuth, authorize("Admin"), getUserById);
router.delete('/user/:id', apiKeyAuth, authorize("Admin"), deleteUser);
router.post('/user/:id', apiKeyAuth, authorize("Admin"), restoreUser);

router.use('/restaurants', restaurantRoutes); 
module.exports = router;
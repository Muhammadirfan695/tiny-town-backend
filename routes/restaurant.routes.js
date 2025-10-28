
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authMiddleware');
const {  createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant 

} = require('../controllers/restaurant.controller');
const { upload } = require('../utils/uploadImage');
const { createRestaurantValidationRules, validate } = require('../middleware/restaurant.validator');
router.post(
    '/', 
    authorize('Admin'), 
    upload.fields([ 
        { name: 'logo', maxCount: 1 },
        { name: 'header_image', maxCount: 1 }
    ]), 
    createRestaurantValidationRules(), 
    validate,
    createRestaurant
);

router.get('/', authorize('Admin', 'Manager', 'Owner'), getAllRestaurants);

router.get('/:id', authorize('Admin', 'Manager', 'Owner'), getRestaurantById);

router.patch(
    '/:id', 
    authorize('Admin', 'Manager', 'Owner'),
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'header_image', maxCount: 1 }
    ]),
    updateRestaurant
);

router.delete('/:id', authorize('Admin'), deleteRestaurant);

module.exports = router;
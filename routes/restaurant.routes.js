
const express = require('express');
const router = express.Router();
const { authorize, apiKeyAuth } = require('../middleware/authMiddleware');
const { createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant

} = require('../controllers/restaurant.controller');
const { upload } = require('../utils/uploadImage');


router.get('/', apiKeyAuth, authorize('Admin', 'Manager', 'Owner'), getAllRestaurants);

router.get('/:id', apiKeyAuth, authorize('Admin', 'Manager', 'Owner'), getRestaurantById);

router.patch(
    '/:id', apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'header_image', maxCount: 1 }
    ]),
    updateRestaurant
);



module.exports = router;
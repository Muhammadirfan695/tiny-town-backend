
const express = require('express');
const router = express.Router();
const { authorize, apiKeyAuth } = require('../middleware/authMiddleware');
const { createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    getUserFavourites,
    removeFromFavourites,
    addToFavourites

} = require('../controllers/restaurant.controller');
const { upload } = require('../utils/uploadImage');


router.get('/restaurant', apiKeyAuth, authorize('Admin', 'Manager', 'Owner'), getAllRestaurants);

router.get('/restaurant/:id', apiKeyAuth, authorize('Admin', 'Manager', 'Owner'), getRestaurantById);

router.patch(
    '/restaurant', apiKeyAuth,
    authorize('Admin', 'Manager', 'Owner'),
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'header_image', maxCount: 1 }
    ]),
    updateRestaurant
);


router.post("/add-favourites",  authorize('User'), addToFavourites);
router.delete("/remove-favourites/:restaurant_id",  authorize('User'), removeFromFavourites);
router.get("/favourites",  authorize('User'), getUserFavourites );
module.exports = router;
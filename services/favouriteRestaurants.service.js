const { error, success } = require("../helpers/response.helper");
const { FavouriteRestaurant, Restaurant } = require("../models");



const addToFavouritesService = async (user, restaurant_id) => {
  try {
    if (user.role !== "User") return error("Only users can add favourites", 403);
    if (!restaurant_id) return error("Restaurant ID is required", 400);

    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) return error("Restaurant not found", 404);

    const existing = await FavouriteRestaurant.findOne({
      where: { user_id: user.id, restaurant_id },
    });
    if (existing) return error("Restaurant already in favourites", 400);

    const favourite = await FavouriteRestaurant.create({
      user_id: user.id,
      restaurant_id,
    });

    return success("Restaurant added to favourites", favourite);
  } catch (err) {
    console.error("Error in addToFavouritesService:", err);
    return error("Failed to add restaurant to favourites", 500);
  }
};


const removeFromFavouritesService = async (user, restaurant_id) => {
  try {
    if (user.role !== "User") return error("Only users can remove favourites", 403);

    const favourite = await FavouriteRestaurant.findOne({
      where: { user_id: user.id, restaurant_id },
    });
    if (!favourite) return error("Favourite not found", 404);

    await favourite.destroy();
    return success("Restaurant removed from favourites");
  } catch (err) {
    console.error("Error in removeFromFavouritesService:", err);
    return error("Failed to remove restaurant from favourites", 500);
  }
};

/**
 * Get all user's favourite restaurants
 */
const getUserFavouritesService = async (userId) => {
  try {
    const favourites = await FavouriteRestaurant.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
        },
      ],
    });

    return success("User favourites fetched successfully", favourites);
  } catch (err) {
    console.error("Error in getUserFavouritesService:", err);
    return error("Failed to fetch favourites", 500);
  }
};

module.exports = {
  addToFavouritesService,
  removeFromFavouritesService,
  getUserFavouritesService,
};

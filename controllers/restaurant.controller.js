const asyncHandler = require("express-async-handler");
const { handleResponse } = require("../helpers/response.helper");
const restaurantService = require("../services/restaurant.service");
const { addToFavouritesService, removeFromFavouritesService, getUserFavouritesService } = require("../services/favouriteRestaurants.service");

const createRestaurant = asyncHandler(async (req, res) => {
  const result = await restaurantService.createRestaurantService(
    req.body,
    req.files
  );
  handleResponse(res, result);
});

const getAllRestaurants = asyncHandler(async (req, res) => {
  const { userId, userRole } = req
  const result = await restaurantService.getAllRestaurantsService(req.query,userId, userRole);
  handleResponse(res, result);
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, userRole } = req
  const result = await restaurantService.findRestaurantByIdService(id,userId, userRole);
  handleResponse(res, result);
});

const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.body;
  const result = await restaurantService.updateRestaurantService(
    id,
    req.body,
    req.files,
    req.userRole
  );
  handleResponse(res, result);
});

const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await restaurantService.deleteRestaurantService(id);
  handleResponse(res, result);
});


const addToFavourites = async (req, res) => {
  const result = await addToFavouritesService({
    id: req.userId,
    role: req.userRole
  }, req.body.restaurant_id);
  handleResponse(res, result);
};

const removeFromFavourites = async (req, res) => {
  const result = await removeFromFavouritesService({
    id: req.userId,
    role: req.userRole
  }, req.params.restaurant_id);
  handleResponse(res, result);
};
const getUserFavourites = async (req, res) => {
  const result = await getUserFavouritesService(req.userId);
  handleResponse(res, result);
};
module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  addToFavourites,
  removeFromFavourites,
  getUserFavourites
};

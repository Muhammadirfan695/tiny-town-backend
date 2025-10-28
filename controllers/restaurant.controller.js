const asyncHandler = require("express-async-handler");
const { handleResponse } = require("../helpers/response.helper");
const restaurantService = require("../services/restaurant.service");

const createRestaurant = asyncHandler(async (req, res) => {
  const result = await restaurantService.createRestaurantService(
    req.body,
    req.files
  );
  handleResponse(res, result);
});

const getAllRestaurants = asyncHandler(async (req, res) => {
  const result = await restaurantService.getAllRestaurantsService(req.query);
  handleResponse(res, result);
});

const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await restaurantService.findRestaurantByIdService(id);
  handleResponse(res, result);
});

const updateRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;
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
module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};

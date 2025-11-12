
const asyncHandler = require('express-async-handler');
const { handleResponse, error, success } = require('../helpers/response.helper');
const { createMenuService, getAllMenusService, updateMenuService, findMenuById, deleteMenuService } = require('../services/menu.service');
const { MenuRestaurantStats } = require('../models');

const createMenu = asyncHandler(async (req, res) => {
    const {
        restaurant_id, name, description, timingStart, timingEnd, status
    } = req.body;
    const result = await createMenuService({
        restaurant_id, name, description, timingStart, timingEnd, status
    }, req.files);
    handleResponse(res, result);
});
const getAllMenus = asyncHandler(async (req, res) => {
    const result = await getAllMenusService(req.query);
    handleResponse(res, result);
});

const updateMenu = asyncHandler(async (req, res) => {

    const {
        id,
        restaurant_id,
        name,
        description,
        timingStart,
        timingEnd,
        status
    } = req.body;

    const result = await updateMenuService(

        { id, restaurant_id, name, description, timingStart, timingEnd, status },
        req.files
    );

    handleResponse(res, result);
});
const menuById = asyncHandler(async (req, res) => {
    const {
        id
    } = req.params;
    const result = await findMenuById(id);

    if (!result) {
        return res.status(404).json(error("Menu not found", 404));
    }
 
    const type = "menu";
    const model_id = id;

    const existingStat = await MenuRestaurantStats.findOne({
      where: { model_id,  type },
    });

    if (existingStat) {
      await existingStat.increment("detail", { by: 1 });
    } else {
      await MenuRestaurantStats.create({
        model_id,
        type,
        detail: 1,
      });
    }
    return res.status(200).json(success("Menu Fetched Successfully", result, 200));

});

const deleteMenu = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteMenuService(id);
    return res.status(result.statusCode || 200).json(result);
  });

module.exports = {
    createMenu,
    getAllMenus,
    updateMenu,
    menuById,
    deleteMenu
}
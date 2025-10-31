const asyncHandler = require('express-async-handler');

const { createDishService, findDishById, getAllDishesService, updateDishService, deleteDishService, setDishMenusService } = require('../services/dish.service');

const { sequelize } = require('../models');
const { handleResponse, error, success } = require('../helpers/response.helper');


const createDish = asyncHandler(async (req, res) => {

    const {
        name,
        description,
        price,
        quantity,
        validity_start,
        validity_end,
        published,
        menuIds,
    } = req.body;
    const result = await createDishService({
        name,
        description,
        price,
        quantity,
        validity_start,
        validity_end,
        published,
        menuIds,
    }, req.files);
    handleResponse(res, result);


});

const getDish = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            id,
        } = req.params;
        const dish = await findDishById(id, t);
        await t.commit();

        res.status(201).json({
            success: true,
            message: "Dish fetch successfully.",
            data: dish,
        });
    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }
        console.error("Error creating dish:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dish",
            error: error.message,
        });
    }
});

const getAllDishes = asyncHandler(async (req, res) => {
    const { page, limit, name, minPrice, maxPrice, validityDate, published, quantity, menuIds } = req.query;


    let menusArray = undefined;
    if (menuIds) {
        menusArray = menuIds.split(",");
    }

    const filters = {
        name,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        validityDate,
        published: published !== undefined ? published === "true" : undefined,
        quantity,
        menuIds: menusArray,
    };

    const pagination = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
    };

    const result = await getAllDishesService(filters, pagination);

    handleResponse(res, result)
});

const updateDish = asyncHandler(async (req, res) => {
    const {
        id,
        name,
        description,
        price,
        quantity,
        validity_start,
        validity_end,
        published,
        menuIds,
        existingAttachmentIds = [],
    } = req.body;

    const result = await updateDishService({
        id,
        name,
        description,
        price,
        quantity,
        validity_start,
        validity_end,
        published,
        menuIds,
        existingAttachmentIds
    }, req.files);
    handleResponse(res, result)
});


const deleteDish = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await deleteDishService(id);
    handleResponse(res, result)
});


const setMenuToDish = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { dishId, menuIds } = req.body;


        const dish = await findDishById(dishId, t)
        if (!dish) {
            await t.rollback();
            return error('Dish Not Found', 404)
        }

        const { valid, missingIds } = await validateMenusExistService(menuIds, t);
        if (!valid) {
            await t.rollback();
            return error(`The following menu IDs do not exist: ${missingIds.join(", ")}`, 404)
        }

        await setDishMenusService(dish, menuIds, t);
        await t.commit();
        return success("Menus assigned to dish successfully",
            { dishId, menuIds }, 200)

    } catch (err) {
        if (!t.finished) await t.rollback();
        console.error(error);
        return error("Failed to assign menus to dish", 500)

    }
});

module.exports = {
    createDish,
    getDish,
    getAllDishes,
    updateDish, deleteDish,
    setMenuToDish
}
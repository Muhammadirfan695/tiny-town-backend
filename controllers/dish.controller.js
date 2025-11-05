const asyncHandler = require('express-async-handler');

const { createDishService, findDishById, getAllDishesService, updateDishService, deleteDishService, setDishMenusService } = require('../services/dish.service');

const { sequelize, Dish } = require('../models');
const { handleResponse, error, success } = require('../helpers/response.helper');
const { validateMenusExistService } = require('../services/menu.service');


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
        restaurant_id
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
        restaurant_id
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
    const { page, limit, name, minPrice, maxPrice, validityDate, published, quantity, menuIds, restaurantId, notInMenuIds, excludeRestaurantId } = req.query;


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
        restaurantId,
        notInMenuIds,
        excludeRestaurantId
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


const setMenuToDishs = asyncHandler(async (req, res) => {
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


const setMenuToDish = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { dishIds, menuId } = req.body;

        console.log(dishIds, "ddddd", menuId);

        if (!Array.isArray(dishIds) || !dishIds.length) {
            await t.rollback();
            return handleResponse(res, error("dishIds must be a non-empty array", 400));
        }

        if (!menuId || typeof menuId !== "string") {
            await t.rollback();
            return handleResponse(res, error("menuId must be a valid string", 400));
        }

        const dishes = await Dish.findAll({
            where: { id: dishIds },
            transaction: t,
        });

        const foundDishIds = dishes.map((d) => d.id);
        const missingDishIds = dishIds.filter((id) => !foundDishIds.includes(id));

        if (missingDishIds.length > 0) {
            await t.rollback();
            return handleResponse(
                res,
                error(`The following dish IDs do not exist: ${missingDishIds.join(", ")}`, 404)
            );
        }

        const { valid, missingIds } = await validateMenusExistService([menuId], t);
        if (!valid) {
            await t.rollback();
            return handleResponse(res, error(`Menu not found: ${missingIds.join(", ")}`, 404));
        }

        for (const dish of dishes) {
            await setDishMenusService(dish, [menuId], t);
        }

        await t.commit();
        return handleResponse(
            res,
            success("Dishes assigned to menu successfully", { dishIds, menuId }, 200)
        );
    } catch (err) {
        if (!t.finished) await t.rollback();
        console.error("Error assigning dishes to menu:", err);
        return handleResponse(res, error("Failed to assign dishes to menu", 500));
    }
});

const removeDishFromMenu = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { dishIds, menuId } = req.body;
  
      console.log(dishIds, "removing from menu:", menuId);
  
      // 🔹 Validate dishIds
      if (!Array.isArray(dishIds) || !dishIds.length) {
        await t.rollback();
        return handleResponse(res, error("dishIds must be a non-empty array", 400));
      }
  
      // 🔹 Validate menuId
      if (!menuId || typeof menuId !== "string") {
        await t.rollback();
        return handleResponse(res, error("menuId must be a valid string", 400));
      }
  
      // 🔹 Check if dishes exist
      const dishes = await Dish.findAll({
        where: { id: dishIds },
        transaction: t,
      });
  
      const foundDishIds = dishes.map((d) => d.id);
      const missingDishIds = dishIds.filter((id) => !foundDishIds.includes(id));
  
      if (missingDishIds.length > 0) {
        await t.rollback();
        return handleResponse(
          res,
          error(`The following dish IDs do not exist: ${missingDishIds.join(", ")}`, 404)
        );
      }
  
      // 🔹 Check if menu exists
      const { valid, missingIds } = await validateMenusExistService([menuId], t);
      if (!valid) {
        await t.rollback();
        return handleResponse(res, error(`Menu not found: ${missingIds.join(", ")}`, 404));
      }
  
      // 🔹 Remove association (Dish ↔ Menu)
      for (const dish of dishes) {
        await dish.removeMenu(menuId, { transaction: t }); // <-- Removes link from join table
      }
  
      await t.commit();
      return handleResponse(
        res,
        success("Dishes removed from menu successfully", { dishIds, menuId }, 200)
      );
    } catch (err) {
      if (!t.finished) await t.rollback();
      console.error("Error removing dishes from menu:", err);
      return handleResponse(res, error("Failed to remove dishes from menu", 500));
    }
  });
  

module.exports = {
    createDish,
    getDish,
    getAllDishes,
    updateDish, deleteDish,
    setMenuToDish,
    removeDishFromMenu
}
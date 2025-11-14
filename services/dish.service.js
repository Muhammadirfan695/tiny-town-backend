const { Op } = require("sequelize");
const { Dish, Menu, Attachment, sequelize, Restaurant } = require("../models");
const { error, success } = require("../helpers/response.helper");
const { createAttachment, deleteAttachment, findAllAttachments } = require("./attachment.service");
const { validateMenusExistService } = require("./menu.service");
const { findRestaurantByIdService } = require("./restaurant.service");

const setDishMenusService = async (dish, menuIds, transaction) => {
  if (Array.isArray(menuIds) && menuIds.length > 0) {
    await dish.setMenus(menuIds, { transaction });
  }
};

const createDishService = async (data, files = null,userRole, userId) => {
  const t = await sequelize.transaction();
  
  try {
    let {
      name,
      description,
      price,
      quantity,
      validity_start,
      validity_end,
      published,
      menuIds,
      restaurant_id, tags
    } = data;
    if (menuIds && menuIds.length > 0) {
      const { valid, missingIds } = await validateMenusExistService(menuIds, t,userRole, userId);
      if (!valid) {
        await t.rollback();
        return error(`The following menu IDs do not exist: ${missingIds.join(", ")}`, 400)
      }
    }
    const restaurant = await findRestaurantByIdService(restaurant_id)
    if (!restaurant) {
      await t.rollback();
      return error('No Restaurant Found', 404)
    }
    if (tags) {
      if (typeof tags === "string") {
        tags = tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      } else if (!Array.isArray(tags)) {
        return error("Tags must be an array or comma-separated string", 400);
      }
    }
    const dish = await Dish.create({
      name,
      description,
      price,
      quantity,
      validity_start,
      validity_end,
      restaurant_id,
      published: published ?? false,
      tags: tags?.length ? tags : null,
    }, t)

    if (menuIds && menuIds.length > 0) {
      await setDishMenusService(dish, menuIds, t);
    }

    if (files && files.length > 0) {

      for (const file of files) {
        await createAttachment(
          dish.id,
          "Dish",
          "photo",
          file.path,
          file.filename,
          t
        );
      }
    }
    await t.commit();
    const createdDish = await findDishById(dish.id);

    return success("Dish created successfully.", createdDish, 200)

  } catch (err) {
    if (!t.finished) {
      await t.rollback();
    }
    console.error("Error creating dish:", err);
    return error("Failed to create dish", 500)

  }
};

const findDishById = async (id, transaction = null, userId = null, userRole = null) => {
  let DishModel = Dish;
  if (userRole === "Owner") {
    DishModel = Dish.scope({ method: ["byOwner", userId] });
  } else if (userRole === "Manager") {
    DishModel = Dish.scope({ method: ["byManager", userId] });
  }

  return await DishModel.findByPk(id, {
    include: [
      {
        model: Menu,
        as: "menus",
        through: { attributes: [] },
      },
      {
        model: Restaurant,
        as: "restaurant",
      },
      {
        model: Attachment,
        as: "attachments",
      },
    ],
    transaction,
  });
};


const deleteDishService = async (id, userId, userRole) => {
  const t = await sequelize.transaction();
  try {

    const dish = await findDishById(id, t, userId, userRole);
    if (!dish) {
      if (!t.finished) await t.rollback();
      return error("No Dish Found", 404)
    }

    const attachments = await findAllAttachments(dish.id, "Dish", t);
    for (const attachment of attachments) {
      await deleteAttachment(attachment, t);
    }

    await dish.destroy({ transaction: t });

    await t.commit();
    return success("Dish deleted successfully", id, 200)

  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error("Error deleting dish:", err);
    return error("Failed to delete dish", 500)

  }
}


const getAllDishesService = async (filters = {}, pagination = {}, userId, userRole) => {
  let {
    name,
    minPrice,
    maxPrice,
    validityDate,
    published,
    quantity,
    menuIds,
    restaurantId,
    excludeRestaurantId,
    notInMenuIds,
  } = filters;

  const { page = 1, limit = 10 } = pagination;
  const offset = (page - 1) * limit;

  const where = {};

  if (typeof menuIds === "string")
    menuIds = menuIds.split(",").map((id) => id.trim());
  if (typeof notInMenuIds === "string")
    notInMenuIds = notInMenuIds.split(",").map((id) => id.trim());

  if (restaurantId) where.restaurant_id = restaurantId;
  if (excludeRestaurantId)
    where.restaurant_id = { [Op.ne]: excludeRestaurantId };
  if (name) where.name = { [Op.iLike]: `%${name}%` };
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price[Op.gte] = minPrice;
    if (maxPrice !== undefined) where.price[Op.lte] = maxPrice;
  }
  if (validityDate) {
    const date = new Date(validityDate);
    where[Op.and] = [
      { validity_start: { [Op.lte]: date } },
      { validity_end: { [Op.gte]: date } },
    ];
  }
  if (published !== undefined) where.published = published;
  if (quantity !== undefined) where.quantity = quantity;

  const include = [
    { model: Attachment, as: "attachments" },
    { model: Restaurant, as: "restaurant" },
  ];

  if ((userRole === "Owner" || userRole === "Manager") && menuIds?.length) {
    const allowedMenus = await Menu.findAll({
      attributes: ["id"],
      where: { id: menuIds },
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["id"],
          where: {
            ...(userRole === "Owner" ? { owner_id: userId } : {}),
            ...(userRole === "Manager" ? { manager_id: userId } : {}),
          },
        },
      ],
    });

    const allowedMenuIds = allowedMenus.map((m) => m.id);


    if (!allowedMenuIds.length) {
      return success("Dishes fetched successfully", {
        data: {
          dishes: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      });
    }


    menuIds = allowedMenuIds;
  }
  if (menuIds?.length) {
    include.push({
      model: Menu,
      as: "menus",
      through: { attributes: [] },
      where: { id: { [Op.in]: menuIds } },
      required: true,
    });
  }

  else if (notInMenuIds?.length) {
    const notInCondition = sequelize.literal(`
      NOT EXISTS (
        SELECT 1 FROM "MenuDish" AS md
        WHERE md."dish_id" = "Dish"."id"
        AND md."menu_id" IN ('${notInMenuIds.join("','")}')
      )
    `);
    where[Op.and] = [...(where[Op.and] || []), notInCondition];

    include.push({
      model: Menu,
      as: "menus",
      through: { attributes: [] },
      required: false,
    });
  }

  else {
    include.push({
      model: Menu,
      as: "menus",
      through: { attributes: [] },
      required: false,
    });
  }

  let DishModel = Dish; 
  if (userRole) {
    if (userRole === "Owner") {
      DishModel = Dish.scope({ method: ["byOwner", userId] });
    } else if (userRole === "Manager") {
      DishModel = Dish.scope({ method: ["byManager", userId] });
    }
  }

  const { rows, count } = await DishModel.findAndCountAll({
    where,
    include,
    limit,
    offset,
    distinct: true,
    order: [["createdAt", "DESC"]],
  });

  return success(
    "Dishes fetched successfully",
    {
      data: {
        dishes: rows,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    },
    200
  );
};



const updateDishService = async (data, files = null, userId, userRole) => {
  const t = await sequelize.transaction();
  try {
    let {
      id,
      name,
      description,
      price,
      quantity,
      validity_start,
      validity_end,
      published,
      menuIds, restaurant_id,
      existingAttachmentIds = [],
      tags
    } = data;

    const dish = await findDishById(id, t, userId, userRole);

    if (!dish) {
      await t.rollback();
      return error('Dish not found', 404)
    }
    tags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags.split(",").map(t => t.trim()).filter(t => t)
        : [];


    await dish.update(
      { name, description, price, quantity, tags, validity_start, validity_end, published, restaurant_id },
      { transaction: t }
    );


    if (menuIds && menuIds.length > 0) {
      await setDishMenusService(dish, menuIds, t);
    }


    const currentAttachments = await findAllAttachments(dish.id, "Dish", t)

    for (const attachment of currentAttachments) {
      if (!existingAttachmentIds.includes(attachment.id)) {
        await deleteAttachment(attachment, t);
      }
    }


    if (files && files.length > 0) {
      for (const file of files) {
        await createAttachment(
          dish.id,
          "Dish",
          "photo",
          file.path,
          file.filename,
          t
        );
      }
    }

    await t.commit();

    const updatedDish = await findDishById(dish.id);
    return success("Dish updated successfully", updatedDish, 200)

  } catch (err) {
    if (!t.finished) await t.rollback();
    console.error("Error updating dish:", err);
    return error("Failed to update dish", 500)

  }
};



module.exports = {
  createDishService,
  findDishById,
  updateDishService,
  deleteDishService,
  setDishMenusService,
  getAllDishesService
}
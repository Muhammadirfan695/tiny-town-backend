const { Op } = require("sequelize");
const { error, success } = require("../helpers/response.helper");
const { Menu, sequelize, Restaurant, MenuRestaurantStats } = require("../models");
const { createAttachment, deleteAttachment, findOneAttachment } = require("./attachment.service");
const { findRestaurantByIdService } = require("./restaurant.service");
const { generateMenuQRCodes } = require("./qrCode.service");
const fs = require("fs");
const path = require("path");


const findAllMenus = async (transaction = null) => {
  return await Menu.findAll({ transaction });
};

const validateMenusExistService = async (menuIds, transaction = null) => {
  const existingMenus = await Menu.findAll({
    where: { id: menuIds },
    attributes: ["id"],
    transaction,
  });

  const existingIds = existingMenus.map(m => m.id);
  const missingIds = menuIds.filter(id => !existingIds.includes(id));

  return { valid: missingIds.length === 0, missingIds };
};
const findMenuById = async (id, transaction = null) => {
  return await Menu.findByPk(id, {
    include: [
      {
        model: Restaurant,
        as: "restaurant",
        attributes: ["id", "name", "address"],
      },
      { association: "attachments" },
    ],
    transaction,
  });
};


const createMenuService = async (data, files = null) => {
  const transaction = await sequelize.transaction();
  try {
    const { restaurant_id, name, description, timingStart, timingEnd, status } = data

    const restaurant = await findRestaurantByIdService(restaurant_id)
    if (!restaurant) {
      await transaction.rollback();
      return error('No Restaurant Found', 404)
    }

    const menu = await Menu.create(
      {
        name,
        restaurant_id,
        description,
        timingStart,
        timingEnd,
        status: status ?? false,
      },
      { transaction }
    );



    if (files?.header_image?.[0]) {
      const file = files.header_image[0];
      await createAttachment(
        menu.id,
        "Menu",
        "header_image",
        file.path,
        file.filename,
        transaction
      );
    }


    const qrFiles = await generateMenuQRCodes(restaurant_id, menu.id);


    await menu.update(
      { qr_normal: qrFiles.normal, qr_light: qrFiles.light },
      { transaction }
    );
    await transaction.commit();

    return success("Menu created successfully", menu, 200)
  } catch (err) {
    await transaction.rollback();
    console.error("Error creating menu:", err);
    return error("Failed to create menu", 500)
  }
};
const getAllMenusService = async (query) => {
  try {
    const {
      name,
      status,
      timingStart,
      timingEnd,
      restaurant_id,
      page = 1,
      limit = 10,
    } = query;

    const where = {};

    if (name) {
      where.name = { [Op.iLike]: `%${name}%` };
    }

    if (status !== undefined) {
      where.status = status === "true" || status === true;
    }

    if (timingStart && timingEnd) {
      where.timingStart = { [Op.gte]: timingStart };
      where.timingEnd = { [Op.lte]: timingEnd };
    } else if (timingStart) {
      where.timingStart = { [Op.gte]: timingStart };
    } else if (timingEnd) {
      where.timingEnd = { [Op.lte]: timingEnd };
    }

    if (restaurant_id) {
      where.restaurant_id = restaurant_id;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Menu.findAndCountAll({
      where,
      include: [
        {
          model: Restaurant,
          as: "restaurant",
          attributes: ["id", "name", "address"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset,
    });
    if (rows && rows.length > 0) {
      const type = "menu";

      for (const menu of rows) {
        const model_id = menu.id;

        const existingStat = await MenuRestaurantStats.findOne({
          where: { model_id,  type },
        });

        if (existingStat) {
          await existingStat.increment("list", { by: 1 });
        } else {
          await MenuRestaurantStats.create({
            model_id,
            type,
            list: 1,
          });
        }
      }
    }
    return success("Menus fetched successfully", {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching menus:", err);
    return error("Failed to fetch menus", 500);
  }
};

const updateMenuService = async (data, files = null) => {
  const transaction = await sequelize.transaction();

  try {
    const menu = await findMenuById(data.id, transaction)


    if (!menu) {
      await transaction.rollback();
      return error("Menu not found", 404);
    }

    if (data.restaurant_id) {
      const restaurant = await findRestaurantByIdService(data.restaurant_id);
      if (!restaurant) {
        await transaction.rollback();
        return error("Restaurant not found", 404);
      }
    }

    await menu.update(
      {
        name: data.name ?? menu.name,
        restaurant_id: data.restaurant_id ?? menu.restaurant_id,
        description: data.description ?? menu.description,
        timingStart: data.timingStart ?? menu.timingStart,
        timingEnd: data.timingEnd ?? menu.timingEnd,
        status: data.status ?? menu.status,
      },
      { transaction }
    );


    if (files?.header_image?.[0]) {
      const file = files.header_image[0];

      const existingAttachment = await findOneAttachment(
        menu.id,
        "Menu",
        "header_image",
        transaction
      );

      if (existingAttachment) {
        await deleteAttachment(existingAttachment, transaction);
      }

      await createAttachment(
        menu.id,
        "Menu",
        "header_image",
        file.path,
        file.filename,
        transaction
      );
    }

    await transaction.commit();
    return success("Menu updated successfully", menu, 200);
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating menu:", err);
    return error("Failed to update menu", 500);
  }
};

const deleteMenuService = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    const menu = await findMenuById(id, transaction);
    if (!menu) {
      await transaction.rollback();
      return error("Menu not found", 404);
    }

    const existingAttachment = await findOneAttachment(
      menu.id,
      "Menu",
      "header_image",
      transaction
    );

    if (existingAttachment) {
      await deleteAttachment(existingAttachment, transaction);
    }
    const qrPaths = [menu.qr_normal, menu.qr_light].filter(Boolean);

    for (const qrPath of qrPaths) {
      const absolutePath = path.join(__dirname, "..", qrPath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`🗑️ Deleted QR code file: ${absolutePath}`);
      } else {
        console.warn(`⚠️ QR code not found: ${absolutePath}`);
      }
    }
    await menu.destroy({ transaction });

    await transaction.commit();
    return success("Menu deleted successfully", id, 200);
  } catch (err) {
    await transaction.rollback();
    console.error("Error deleting menu:", err);
    return error("Failed to delete menu", 500);
  }
};


module.exports = {
  findAllMenus,
  findMenuById,
  validateMenusExistService,
  createMenuService,
  getAllMenusService,
  updateMenuService,
  deleteMenuService
};
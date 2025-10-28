const { Op } = require("sequelize");
const { Restaurant, User, sequelize } = require("../models");
const { success, error } = require("../helpers/response.helper");
const { createAttachment } = require("./attachment.service");

const createRestaurantService = async (data, files) => {
  const transaction = await sequelize.transaction();
  try {
    const { owner_id, manager_id, ...restaurantData } = data;

    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner) return error("Owner not found", 404);
    }
    if (manager_id) {
      const manager = await User.findByPk(manager_id);
      if (!manager) return error("Manager not found", 404);
    }

    const newRestaurant = await Restaurant.create(
      { owner_id, manager_id, ...restaurantData },
      { transaction }
    );

    if (files?.logo) {
      const file = files.logo[0];
      await createAttachment(
        newRestaurant.id,
        "Restaurant",
        "logo",
        file.path,
        file.filename,
        transaction
      );
    }
    if (files?.header_image) {
      const file = files.header_image[0];
      await createAttachment(
        newRestaurant.id,
        "Restaurant",
        "header_image",
        file.path,
        file.filename,
        transaction
      );
    }

    await transaction.commit();
    const finalRestaurant = await Restaurant.findByPk(newRestaurant.id, {
      include: ["Owner", "Manager", "attachments"],
    });
    return success("Restaurant created successfully", finalRestaurant);
  } catch (err) {
    await transaction.rollback();
    console.error("Error in createRestaurantService:", err);
    return error("Failed to create restaurant", 500);
  }
};


const getAllRestaurantsService = async (query) => {
    try {
        const { page = 1, limit = 10, search } = query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } },
                { cuisine_type: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const { count, rows } = await Restaurant.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: "Owner", attributes: ["id", "firstName", "lastName", "email"] },
                { model: User, as: "Manager", attributes: ["id", "firstName", "lastName", "email"] },
                { association: "attachments", attributes: ["attachment_type", "image_path"] }
            ],
            limit: parseInt(limit), 
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            distinct: true 
        });

        return success("Restaurants fetched successfully", {
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: rows
        });

    } catch (err) {
        console.error("Error in getAllRestaurantsService:", err);
        return error("Failed to fetch restaurants", 500);
    }
};

const findRestaurantByIdService = async (id) => {
  try {
    const restaurant = await Restaurant.findByPk(id, {
      include: [
        {
          model: User,
          as: "Owner",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: User,
          as: "Manager",
          attributes: ["id", "firstName", "lastName"],
        },
        { association: "attachments" },
      ],
    });
    if (!restaurant) {
      return error("Restaurant not found", 404);
    }
    return success("Restaurant fetched successfully", restaurant);
  } catch (err) {
    console.error("Error in findRestaurantByIdService:", err);
    return error("Failed to fetch restaurant details", 500);
  }
};

const updateRestaurantService = async (id, data, files, userRole) => {
  const transaction = await sequelize.transaction();
  try {
    const restaurant = await Restaurant.findByPk(id, { transaction });
    if (!restaurant) {
      await transaction.rollback();
      return error("Restaurant not found", 404);
    }

    if ((data.owner_id || data.manager_id) && userRole !== "Admin") {
      await transaction.rollback();
      return error(
        "Forbidden: Only an Admin can change the owner or manager.",
        403
      );
    }

    if (data.service_model && typeof data.service_model === "string") {
      try {
        data.service_model = JSON.parse(data.service_model);
      } catch (e) {}
    }

    await restaurant.update(data, { transaction });

    if (files?.logo) {
      const oldLogo = await findOneAttachment(
        id,
        "Restaurant",
        "logo",
        transaction
      );
      if (oldLogo) await deleteAttachment(oldLogo, transaction);
      await createAttachment(
        id,
        "Restaurant",
        "logo",
        files.logo[0].path,
        files.logo[0].filename,
        transaction
      );
    }
    if (files?.header_image) {
      const oldHeader = await findOneAttachment(
        id,
        "Restaurant",
        "header_image",
        transaction
      );
      if (oldHeader) await deleteAttachment(oldHeader, transaction);
      await createAttachment(
        id,
        "Restaurant",
        "header_image",
        files.header_image[0].path,
        files.header_image[0].filename,
        transaction
      );
    }

    await transaction.commit();
    return findRestaurantByIdService(id);
  } catch (err) {
    await transaction.rollback();
    console.error("Error in updateRestaurantService:", err);
    return error("Failed to update restaurant", 500);
  }
};

const deleteRestaurantService = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    const restaurant = await Restaurant.findByPk(id, { transaction });
    if (!restaurant) {
      await transaction.rollback();
      return error("Restaurant not found", 404);
    }

    const attachments = await findAllAttachments(id, "Restaurant", transaction);
    for (const attachment of attachments) {
      await deleteAttachment(attachment, transaction);
    }

    await restaurant.destroy({ transaction });

    await transaction.commit();
    return success("Restaurant deleted successfully");
  } catch (err) {
    await transaction.rollback();
    console.error("Error in deleteRestaurantService:", err);
    return error("Failed to delete restaurant", 500);
  }
};

module.exports = {
  createRestaurantService,
  getAllRestaurantsService,
  findRestaurantByIdService,
  updateRestaurantService,
  deleteRestaurantService,
};

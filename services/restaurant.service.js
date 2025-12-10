const { Op } = require("sequelize");
const { Restaurant, User, sequelize, MenuRestaurantStats } = require("../models");
const { success, error } = require("../helpers/response.helper");
const { createAttachment, deleteAttachment, findAllAttachments, findOneAttachment } = require("./attachment.service");
const { generateRestaurantQRCodes } = require("./qrCode.service");
const fs = require("fs");
const path = require("path");


const createRestaurantService = async (data, files) => {
  const transaction = await sequelize.transaction();
  try {
    let { owner_id,
      manager_id,
      country,
      city,
      latitude,
      longitude,
      total_weekly_hours,
      website,
      postal_code,
      hours,
      tags, ...restaurantData } = data;
    if (owner_id) {
      const owner = await User.findByPk(owner_id);
      if (!owner) return error("Owner not found", 404);

      const existingOwnerRestaurant = await Restaurant.findOne({
        where: { owner_id },
      });
      if (existingOwnerRestaurant) {
        return error("This owner already has a restaurant assigned", 400);
      }
    }


    if (manager_id) {
      const manager = await User.findByPk(manager_id);
      if (!manager) return error("Manager not found", 404);
    }

    if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
      return error("Invalid latitude value", 400);
    }
    if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
      return error("Invalid longitude value", 400);
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
    
    if (hours) {
      if (typeof hours === "string") {
        try {
          hours = JSON.parse(hours);
        } catch {
          return error("Hours must be a valid JSON object", 400);
        }
      }
      if (typeof hours !== "object" || Array.isArray(hours)) {
        return error("Hours must be a JSON object with days and open/close times", 400);
      }

      const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
      const normalizedHours = {};

      days.forEach(day => {
        let dayInfo = hours[day] || {};

        dayInfo.isClosed = dayInfo.isClosed ?? false;

        if (dayInfo.isClosed) {
          dayInfo.open = null;
          dayInfo.close = null;
        }

        normalizedHours[day] = {
          open: dayInfo.open || null,
          close: dayInfo.close || null,
          isClosed: dayInfo.isClosed
        };
      });

      hours = normalizedHours;
    }
    
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
    const newRestaurant = await Restaurant.create(
      {
        ...restaurantData,
        owner_id: owner_id ? owner_id : null,
        manager_id: manager_id ? manager_id : null,
        country,
        city,
        total_weekly_hours: total_weekly_hours || null,
        website,
        postal_code,
        hours: hours || null,
        latitude: !isNaN(parsedLatitude) ? parsedLatitude : null,
        longitude: !isNaN(parsedLongitude) ? parsedLongitude : null,
        tags: tags?.length ? tags : null,
      },
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

    const qrFiles = await generateRestaurantQRCodes(newRestaurant.id);



    await newRestaurant.update(
      { qr_normal: qrFiles.normal, qr_light: qrFiles.light },
      { transaction }
    );

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


const getAllRestaurantsService = async (query, userId, userRole) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      owner_id,
      manager_id,
      cuisine,
      country,
      city,
      tags,
      lat,
      lng,
      maxDistance = 10,
      openToday, } = query;
    const offset = (page - 1) * limit;
    let RestaurantModel = Restaurant;


    if (userRole) {
      if (userRole === "Owner") {
        RestaurantModel = Restaurant.scope({ method: ["byOwner", userId] });
      } else if (userRole === "Manager") {
        RestaurantModel = Restaurant.scope({ method: ["byManager", userId] });
      }

    }
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
        { cuisine_type: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (owner_id) {
      whereClause.owner_id = owner_id;
    }

    if (manager_id) {
      whereClause.manager_id = manager_id;
    }
    if (cuisine) whereClause.cuisine_type = { [Op.iLike]: `%${cuisine}%` };
    if (country) whereClause.country = { [Op.iLike]: `%${country}%` };
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };
    if (tags) {
      const tagArray = tags.split(",");
      whereClause.tags = { [Op.overlap]: tagArray };
    }
    // if (openToday === "true") {
    //   const now = new Date();
    //   const currentTime = now.toTimeString().slice(0, 5);
    //   whereClause.opening_hours = { [Op.lte]: currentTime };
    //   whereClause.closing_hours = { [Op.gte]: currentTime };
    // }

    let filterByOpenToday = false;
    let todayKey = null;

    if (openToday === "true") {
      filterByOpenToday = true;

      const today = new Date();
      const weekdays = [
        "sunday", "monday", "tuesday", "wednesday",
        "thursday", "friday", "saturday"
      ];
      todayKey = weekdays[today.getDay()];
    }

    let restaurants, count;

    if (lat && lng) {
      const distanceFormula = literal(`
        6371 * acos(
          cos(radians(${lat}))
          * cos(radians("latitude"))
          * cos(radians("longitude") - radians(${lng}))
          + sin(radians(${lat})) * sin(radians("latitude"))
        )
      `);
      const result = await RestaurantModel.findAndCountAll({
        attributes: {
          include: [[distanceFormula, "distance"]],
        },
        where: whereClause,
        having: literal(`distance <= ${maxDistance}`),
        order: [[literal("distance"), "ASC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),

        include: [
          {
            model: User,
            as: "Owner",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: User,
            as: "Manager",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            association: "attachments",
            attributes: ["attachment_type", "image_path"],
          },
        ],
        distinct: true,
      });
      count = result.count.length || result.count;
      restaurants = result.rows;
    } else {

      const result = await RestaurantModel.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["createdAt", "DESC"]],
        distinct: true,
        include: [
          {
            model: User,
            as: "Owner",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: User,
            as: "Manager",
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            association: "attachments",
            attributes: ["attachment_type", "image_path"],
          },
        ],
      });

      count = result.count;
      restaurants = result.rows;
    }
    if (restaurants && restaurants.length > 0) {
      const type = "restaurant";


      for (const restaurant of restaurants) {
        const model_id = restaurant.id;

        const existingStat = await MenuRestaurantStats.findOne({
          where: { model_id, type },
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



    return success("Restaurants fetched successfully", {
      data: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        restaurants: restaurants,
      },
    });
  } catch (err) {
    console.error("Error in getAllRestaurantsService:", err);
    return error("Failed to fetch restaurants", 500);
  }
};

const findRestaurantByIdService = async (id, userId, userRole) => {
  try {
    let RestaurantModel = Restaurant;
    if (userRole) {
      if (userRole === "Owner") {
        RestaurantModel = Restaurant.scope({ method: ["byOwner", userId] });
      } else if (userRole === "Manager") {
        RestaurantModel = Restaurant.scope({ method: ["byManager", userId] });
      }
    }
    const restaurant = await RestaurantModel.findByPk(id, {
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

    const type = "restaurant";
    const model_id = restaurant.id;

    const existingStat = await MenuRestaurantStats.findOne({
      where: { model_id, type },
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
    return success("Restaurant fetched successfully", restaurant);
  } catch (err) {
    console.error("Error in findRestaurantByIdService:", err);
    return error("Failed to fetch restaurant details", 500);
  }
};

const updateRestaurantService = async (id, data, files, userRole, userId) => {
  const transaction = await sequelize.transaction();
  try {
    let RestaurantModel = Restaurant;
    if (userRole) {
      if (userRole === "Owner") {
        RestaurantModel = Restaurant.scope({ method: ["byOwner", userId] });
      } else if (userRole === "Manager") {
        console.log("hereeee",userId)
        RestaurantModel = Restaurant.scope({ method: ["byManager", userId] });
      }
    }

    const restaurant = await RestaurantModel.findByPk(id, { transaction });
    console.log("dogobasy@mailinator.com",restaurant)
    if (!restaurant) {
      await transaction.rollback();
      return error("Restaurant not found", 404);
    }

    ["owner_id", "manager_id"].forEach((key) => {
      if (data[key] === "" || data[key] === "null" || data[key] === null) {
        data[key] = null;
      }
    });

    if (
      (data.owner_id !== undefined && data.owner_id !== restaurant.owner_id) ||
      (data.manager_id !== undefined && data.manager_id !== restaurant.manager_id)
    ) {
      if (userRole !== "Admin") {
        await transaction.rollback();
        return error(
          "Forbidden: Only an Admin can change the owner or manager.",
          403
        );
      }
    }
    
    if (data.owner_id && userRole === "Admin") {
      const newOwner = await User.findByPk(data.owner_id);
      if (!newOwner) {
        await transaction.rollback();
        return error("Owner not found", 404);
      }

      const existingOwnerRestaurant = await Restaurant.findOne({
        where: { owner_id: data.owner_id },
        transaction,
      });

      if (existingOwnerRestaurant && existingOwnerRestaurant.id !== id) {
        await transaction.rollback();
        return error("This owner already has a restaurant assigned.", 400);
      }
    }

    if (data.manager_id && userRole === "Admin") {
      const newManager = await User.findByPk(data.manager_id);
      if (!newManager) {
        await transaction.rollback();
        return error("Manager not found", 404);
      }
    }

    const { latitude, longitude } = data;
    // if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
    //   await transaction.rollback();
    //   return error("Invalid latitude value", 400);
    // }

    // if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
    //   await transaction.rollback();
    //   return error("Invalid longitude value", 400);
    // }

    if (data.tags) {
      if (typeof data.tags === "string") {
        data.tags = data.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      } else if (!Array.isArray(data.tags)) {
        await transaction.rollback();
        return error("Tags must be an array or comma-separated string", 400);
      }
    }

    if (data.service_model && typeof data.service_model === "string") {
      try {
        data.service_model = JSON.parse(data.service_model);
      } catch (e) {
        await transaction.rollback();
        return error("Invalid JSON format for service_model", 400);
      }
    }

    if (data.hours) {
      try {
        if (typeof data.hours === "string") {
          data.hours = JSON.parse(data.hours);
        }

        if (typeof data.hours !== "object" || Array.isArray(data.hours)) {
          await transaction.rollback();
          return error("Invalid hours format: must be an object", 400);
        }

        for (const [day, schedule] of Object.entries(data.hours)) {
          if (
            !schedule ||
            typeof schedule !== "object" ||
            !schedule.open ||
            !schedule.close
          ) {
            await transaction.rollback();
            return error(
              `Invalid hours format for '${day}'. Format must be: { open: 'HH:MM', close: 'HH:MM' }`,
              400
            );
          }
        }
      } catch (err) {
        await transaction.rollback();
        return error("Invalid JSON format for hours", 400);
      }
    } else {
      data.hours = null;
    }
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);
    await restaurant.update(
      {
        ...data,
        hours: data.hours || null,
        latitude: !isNaN(parsedLatitude) ? parsedLatitude : null,
        longitude: !isNaN(parsedLongitude) ? parsedLongitude : null,
        tags: data.tags?.length ? data.tags : null,
        total_weekly_hours: data.total_weekly_hours || null,
        postal_code: data.postal_code || null,
        website: data.website || null,
      },
      { transaction }
    );

    if (files?.logo) {
      const oldLogo = await findOneAttachment(id, "Restaurant", "logo", transaction);
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
      const oldHeader = await findOneAttachment(id, "Restaurant", "header_image", transaction);
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

    const updatedRestaurant = await Restaurant.findByPk(id, {
      include: ["Owner", "Manager", "attachments"],
    });

    return success("Restaurant updated successfully", updatedRestaurant);
  } catch (err) {
    await transaction.rollback();
    console.error("Error in updateRestaurantService:", err);
    return error("Failed to update restaurant", 500);
  }
};


const deleteRestaurantService = async (id, userId, userRole) => {
  const transaction = await sequelize.transaction();
  try {
    let RestaurantModel = Restaurant;
    if (userRole) {
      if (userRole === "Owner") {
        RestaurantModel = Restaurant.scope({ method: ["byOwner", userId] });
      } else if (userRole === "Manager") {
        RestaurantModel = Restaurant.scope({ method: ["byManager", userId] });
      }
    }
    const restaurant = await RestaurantModel.findByPk(id, { transaction });
    if (!restaurant) {
      await transaction.rollback();
      return error("Restaurant not found", 404);
    }

    const attachments = await findAllAttachments(id, "Restaurant", transaction);
    for (const attachment of attachments) {
      await deleteAttachment(attachment, transaction);
    }
    const qrPaths = [restaurant.qr_normal, restaurant.qr_light].filter(Boolean);

    for (const qrPath of qrPaths) {
      const absolutePath = path.join(__dirname, "..", qrPath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`🗑️ Deleted QR code file: ${absolutePath}`);
      } else {
        console.warn(`⚠️ QR code not found: ${absolutePath}`);
      }
    }
    await restaurant.destroy({ transaction });

    await transaction.commit();
    return success("Restaurant deleted successfully", id, 200);
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

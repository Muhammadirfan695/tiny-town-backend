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

const createDishService = async (data, files = null) => {
    const t = await sequelize.transaction();
    try {
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
        } = data;
        if (menuIds && menuIds.length > 0) {
            const { valid, missingIds } = await validateMenusExistService(menuIds, t);
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
        const dish = await Dish.create({
            name,
            description,
            price,
            quantity,
            validity_start,
            validity_end,
            restaurant_id,
            published: published ?? false,
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

const findDishById = async (id, transaction = null) => {
    return await Dish.findByPk(id,
        {
            include: [
                {
                    model: Menu,
                    through: { attributes: [] }
                },
                {
                    model: Restaurant,
                    as: "restaurant",
                },
                {
                    model: Attachment,
                    as: "attachments"
                },
            ], transaction
        });
};



const deleteDishService = async (id) => {
    const t = await sequelize.transaction();
    try {

        const dish = await findDishById(id);
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
        return success("Dish deleted successfully", null, 200)

    } catch (err) {
        if (!t.finished) await t.rollback();
        console.error("Error deleting dish:", err);
        return error("Failed to delete dish", 500)

    }
}







const getAllDishesService = async (filters = {}, pagination = {}) => {
    const {
        name,
        minPrice,
        maxPrice,
        validityDate,
        published,
        quantity,
        menuIds,
        restaurantId,
    } = filters;

    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    const where = {};
    if (restaurantId) where.restaurant_id = restaurantId;
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (minPrice !== undefined) where.price = { ...(where.price || {}), [Op.gte]: minPrice };
    if (maxPrice !== undefined) where.price = { ...(where.price || {}), [Op.lte]: maxPrice };
    if (validityDate) {
        const date = new Date(validityDate);
        where.validity_start = { [Op.lte]: date };
        where.validity_end = { [Op.gte]: date };
    }
    if (published !== undefined) where.published = published;
    if (quantity) where.quantity = quantity;

    const include = [
        { model: Attachment, as: "attachments" },
        { model: Restaurant, as: "restaurant" },
        {
            model: Menu,
            through: { attributes: [] }, // join table
            ...(menuIds?.length > 0 && { where: { id: { [Op.in]: menuIds } } }),
        }
    ];

    

    // 🧮 Separate count (avoid heavy joins)
    const total = await Dish.count({ where });

    // 📄 Fetch paginated data
    const rows = await Dish.findAll({
        where,
        include,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
    });

    return success(
        "Dishes Fetched Successfully",
        {
            data: {
                dishes: rows,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        },
        200
    );
};

const updateDishService = async (data, files = null) => {
    const t = await sequelize.transaction();
    try {
        const {
            id,
            name,
            description,
            price,
            quantity,
            validity_start,
            validity_end,
            published,
            menuIds, restaurant_id,
            existingAttachmentIds = [], // Array of IDs to keep
        } = data;

        const dish = await findDishById(id, t);

        if (!dish) {
            await t.rollback();
            return error('Dish not found', 404)
        }


        await dish.update(
            { name, description, price, quantity, validity_start, validity_end, published, restaurant_id },
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
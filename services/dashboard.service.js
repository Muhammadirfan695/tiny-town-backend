const { Op } = require("sequelize");
const { User, UserRole, Role, Restaurant, Menu, Dish } = require("../models");
const { success, error } = require("../helpers/response.helper");


const statsForAdmin = async () => {
    const [totalUsers, totalManagers, totalOwners, totalRestaurants, totalMenus, totalDishes] =
        await Promise.all([
            User.count(),
            User.count({
                include: [{
                    model: Role,
                    as: "Roles",
                    where: { name: "Manager" },
                    attributes: []
                }],
            }),
            User.count({
               
                include: [{
                    model: Role,
                    as: "Roles",
                    where: { name: "Owner" },
                    attributes: []
                }],
            }),
           
            Restaurant.count(),
            Menu.count(),
            Dish.count(),
        ]);

    return {
        totalUsers,
        totalManagers,
        totalOwners,
        totalRestaurants,
        totalMenus,
        totalDishes,
    };
};


const statsForManager = async (userId) => {
    const restaurants = await Restaurant.findAll({
        where: { manager_id: userId },
        attributes: ["id"],
    });

    if (!restaurants.length)
        return { totalRestaurants: 0, totalMenus: 0, totalDishes: 0 };

    const restaurantIds = restaurants.map((r) => r.id);

    const [totalMenus, totalDishes] = await Promise.all([
        Menu.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
        Dish.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
    ]);

    return {
        totalRestaurants: restaurants.length,
        totalMenus,
        totalDishes,
    };
};


const statsForOwner = async (userId) => {
    const restaurants = await Restaurant.findAll({
        where: { owner_id: userId },
        attributes: ["id"],
    });

    if (!restaurants.length)
        return { totalRestaurants: 0, totalMenus: 0, totalDishes: 0 };

    const restaurantIds = restaurants.map((r) => r.id);

    const [totalMenus, totalDishes] = await Promise.all([
        Menu.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
        Dish.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
    ]);

    return {
        totalRestaurants: restaurants.length,
        totalMenus,
        totalDishes,
    };
};


const dashboardStatsService = async (userId, userRole) => {
    try {
        let data;
        console.log("list----", userRole)
        switch (userRole) {
            case "Admin":
                data = await statsForAdmin();
                break;
            case "Manager":
                data = await statsForManager(userId);
                break;
            case "Owner":
                data = await statsForOwner(userId);
                break;
            default:
                return error("Access Denied or Invalid Role.", 403);
        }

        return success("Dashboard statistics fetched successfully.", data);
    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        return error("Failed to fetch dashboard statistics.", 500,);
    }
};

module.exports = {
    dashboardStatsService,
    statsForAdmin,
    statsForManager,
    statsForOwner,
};

const { Op, fn, col, literal } = require("sequelize");
const { User, UserRole, Role, Restaurant, Menu, Dish, MenuRestaurantStats, sequelize } = require("../models");
const { success, error } = require("../helpers/response.helper");


const statsForAdmin = async () => {
  const [totalUsers, totalManagers, totalOwners, totalRestaurants, totalMenus, totalDishes,
    totalRestaurantsListCount, totalRestaurantsDetailCount,
    totalMenuListCount, totalMenuDetailCount
  ] =
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

      MenuRestaurantStats.findAll({
        where: { type: "restaurant" },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("list")), "totalList"]
        ],
        raw: true
      }),

      MenuRestaurantStats.findAll({
        where: { type: "restaurant" },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("detail")), "totalDetail"]
        ],
        raw: true
      }),


      MenuRestaurantStats.findAll({
        where: { type: "menu" },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("list")), "totalList"]
        ],
        raw: true
      }),

      MenuRestaurantStats.findAll({
        where: { type: "menu" },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("detail")), "totalDetail"]
        ],
        raw: true
      })
    ]);
  const now = new Date();
  const months = [];
  const current = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const name = d.toLocaleString('default', { month: 'short' });
    months.push({ key, name });
  }

  const monthlyStats = await MenuRestaurantStats.findAll({
    attributes: [
      [fn("to_char", col("createdAt"), "YYYY-MM"), "month"],
      "type",
      [fn("SUM", col("list")), "totalList"],
      [fn("SUM", col("detail")), "totalDetail"],
    ],
    group: ["month", "type"],
    order: [[literal(`"month"`), "ASC"]],
    raw: true,
  });

  const monthlyMap = {};
  monthlyStats.forEach(item => {
    const { month, type, totalList, totalDetail } = item;
    if (!monthlyMap[month]) monthlyMap[month] = {};
    monthlyMap[month][type] = {
      list: Number(totalList) || 0,
      detail: Number(totalDetail) || 0
    };
  });


  const monthlyData = months.map(({ key, name }) => ({
    month: name,
    restaurantList: monthlyMap[key]?.restaurant?.list || 0,
    menuDetail: monthlyMap[key]?.menu?.detail || 0,
  }));
  return {
    totalUsers,
    totalManagers,
    totalOwners,
    totalRestaurants,
    totalMenus,
    totalDishes,
    totalRestaurantsListCount, totalRestaurantsDetailCount,
    totalMenuListCount, totalMenuDetailCount,
    monthlyData
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

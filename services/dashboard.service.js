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


  const restaurantMonthlyStats = await MenuRestaurantStats.findAll({
    attributes: [
      "model_id",
      [fn("to_char", col("MenuRestaurantStats.createdAt"), "Mon"), "month"],
      [fn("SUM", col("list")), "totalList"],
      [fn("SUM", col("detail")), "totalDetail"],
    ],
    where: { type: "restaurant" },
    include: [
      {
        model: Restaurant,
        as: "restaurant",
        attributes: ["id", "name"],
      },
    ],
    group: ["model_id", "month", "restaurant.id", "restaurant.name"],
    order: [[literal(`"month"`), "ASC"]],
    raw: true,
    nest: true,
  });


  const menuMonthlyStats = await MenuRestaurantStats.findAll({
    attributes: [
      "model_id",
      [fn("to_char", col("MenuRestaurantStats.createdAt"), "Mon"), "month"],
      [fn("SUM", col("list")), "totalList"],
      [fn("SUM", col("detail")), "totalDetail"],
    ],
    where: { type: "menu" },
    include: [
      {
        model: Menu,
        as: "menu",
        attributes: ["id", "name"],
      },
    ],
    group: ["model_id", "month", "menu.id", "menu.name"],
    order: [[literal(`"month"`), "ASC"]],
    raw: true,
    nest: true,
  });


  const buildMonthlyData = (stats, months, keyName) => {
    const dataMap = {};

    stats.forEach(item => {
      const name = keyName === "restaurant" ? item.restaurant.name : item.menu.name;
      if (!dataMap[name]) dataMap[name] = {};

      dataMap[name][item.month] = {
        list: Number(item.totalList) || 0,
        detail: Number(item.totalDetail) || 0,
      };
    });


    const result = {};
    Object.keys(dataMap).forEach(name => {
      result[name] = months.map(({ name: monthName }) => ({
        month: monthName,
        list: dataMap[name][monthName]?.list || 0,
        detail: dataMap[name][monthName]?.detail || 0,
      }));
    });

    return result;
  };

  const restaurantMonthlyData = buildMonthlyData(restaurantMonthlyStats, months, "restaurant");
  const menuMonthlyData = buildMonthlyData(menuMonthlyStats, months, "menu");
  return {
    totalUsers,
    totalManagers,
    totalOwners,
    totalRestaurants,
    totalMenus,
    totalDishes,
    totalRestaurantsListCount, totalRestaurantsDetailCount,
    totalMenuListCount, totalMenuDetailCount,
    restaurantMonthlyData,
    menuMonthlyData
  };
};



const statsForManager = async (userId) => {
  const restaurants = await Restaurant.findAll({
    where: { manager_id: userId },
    attributes: ["id", "name"],
    raw: true,
  });

  if (!restaurants.length) {
    return {
      totalRestaurants: 0,
      totalMenus: 0,
      totalDishes: 0,
      restaurantMonthlyData: {},
      menuMonthlyData: {},
    };
  }

  const restaurantIds = restaurants.map((r) => r.id);

  const [totalMenus, totalDishes] = await Promise.all([
    Menu.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
    Dish.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
  ]);

  const months = [];
  const current = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const name = d.toLocaleString("default", { month: "short" });
    months.push({ key, name });
  }

  const restaurantMonthlyStats = await MenuRestaurantStats.findAll({
    attributes: [
      "model_id",
      [fn("to_char", col("createdAt"), "YYYY-MM"), "month"],
      [fn("SUM", col("list")), "totalList"],
      [fn("SUM", col("detail")), "totalDetail"],
    ],
    where: { type: "restaurant", model_id: { [Op.in]: restaurantIds } },
    group: ["model_id", "month"],
    order: [[literal(`"month"`), "ASC"]],
    raw: true,
  });

  const menuRecords = await Menu.findAll({
    where: { restaurant_id: { [Op.in]: restaurantIds } },
    attributes: ["id", "name"],
    raw: true,
  });
  const menuIds = menuRecords.map((m) => m.id);
  const menuIdToNameMap = {};
  menuRecords.forEach((m) => (menuIdToNameMap[m.id] = m.name));

  const menuMonthlyStats = await MenuRestaurantStats.findAll({
    attributes: [
      "model_id",
      [fn("to_char", col("createdAt"), "YYYY-MM"), "month"],
      [fn("SUM", col("list")), "totalList"],
      [fn("SUM", col("detail")), "totalDetail"],
    ],
    where: { type: "menu", model_id: { [Op.in]: menuIds } },
    group: ["model_id", "month"],
    order: [[literal(`"month"`), "ASC"]],
    raw: true,
  });

  const restaurantMonthlyMap = {};
  restaurants.forEach((r) => {
    restaurantMonthlyMap[r.name] = {};
    months.forEach(({ key }) => {
      restaurantMonthlyMap[r.name][key] = { list: 0, detail: 0 };
    });
  });
  restaurantMonthlyStats.forEach((item) => {
    const restaurant = restaurants.find((r) => r.id === item.model_id);
    if (!restaurant) return;
    restaurantMonthlyMap[restaurant.name][item.month] = {
      list: Number(item.totalList) || 0,
      detail: Number(item.totalDetail) || 0,
    };
  });

  const menuMonthlyMap = {};
  menuIds.forEach((id) => {
    const name = menuIdToNameMap[id];
    menuMonthlyMap[name] = {};
    months.forEach(({ key }) => {
      menuMonthlyMap[name][key] = { list: 0, detail: 0 };
    });
  });
  menuMonthlyStats.forEach((item) => {
    const name = menuIdToNameMap[item.model_id];
    if (!name) return;
    menuMonthlyMap[name][item.month] = {
      list: Number(item.totalList) || 0,
      detail: Number(item.totalDetail) || 0,
    };
  });

  const restaurantMonthlyData = {};
  Object.keys(restaurantMonthlyMap).forEach((name) => {
    restaurantMonthlyData[name] = months.map(({ key, name: monthName }) => ({
      month: monthName,
      list: restaurantMonthlyMap[name][key].list,
      detail: restaurantMonthlyMap[name][key].detail,
    }));
  });

  const menuMonthlyData = {};
  Object.keys(menuMonthlyMap).forEach((name) => {
    menuMonthlyData[name] = months.map(({ key, name: monthName }) => ({
      month: monthName,
      list: menuMonthlyMap[name][key].list,
      detail: menuMonthlyMap[name][key].detail,
    }));
  });

  return {
    totalRestaurants: restaurants.length,
    totalMenus,
    totalDishes,
    restaurantMonthlyData,
    menuMonthlyData,
  };
};

const statsForOwner = async (userId) => {
  const restaurants = await Restaurant.findAll({
    where: { owner_id: userId },
    attributes: ["id", "name"],
    raw: true,
  });

  if (!restaurants.length) {
    return {
      totalRestaurants: 0,
      totalMenus: 0,
      totalDishes: 0,
      restaurantMonthlyData: {},
      menuMonthlyData: {},
    };
  }

  const restaurantIds = restaurants.map((r) => r.id);

  const [totalMenus, totalDishes] = await Promise.all([
    Menu.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
    Dish.count({ where: { restaurant_id: { [Op.in]: restaurantIds } } }),
  ]);


  const months = [];
  const current = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const name = d.toLocaleString("default", { month: "short" });
    months.push({ key, name });
  }

  const restaurantMonthlyStats = await MenuRestaurantStats.findAll({
    attributes: [
      "model_id",
      [fn("to_char", col("createdAt"), "YYYY-MM"), "month"],
      [fn("SUM", col("list")), "totalList"],
      [fn("SUM", col("detail")), "totalDetail"],
    ],
    where: { type: "restaurant", model_id: { [Op.in]: restaurantIds } },
    group: ["model_id", "month"],
    order: [[literal(`"month"`), "ASC"]],
    raw: true,
  });


  const menuRecords = await Menu.findAll({
    where: { restaurant_id: { [Op.in]: restaurantIds } },
    attributes: ["id", "name"],
    raw: true,
  });
  const menuIds = menuRecords.map((m) => m.id);
  const menuIdToNameMap = {};
  menuRecords.forEach((m) => (menuIdToNameMap[m.id] = m.name));


  const menuMonthlyStats = await MenuRestaurantStats.findAll({
    attributes: [
      "model_id",
      [fn("to_char", col("createdAt"), "YYYY-MM"), "month"],
      [fn("SUM", col("list")), "totalList"],
      [fn("SUM", col("detail")), "totalDetail"],
    ],
    where: { type: "menu", model_id: { [Op.in]: menuIds } },
    group: ["model_id", "month"],
    order: [[literal(`"month"`), "ASC"]],
    raw: true,
  });

  const restaurantMonthlyMap = {};
  restaurants.forEach((r) => {
    restaurantMonthlyMap[r.name] = {};
    months.forEach(({ key }) => {
      restaurantMonthlyMap[r.name][key] = { list: 0, detail: 0 };
    });
  });
  restaurantMonthlyStats.forEach((item) => {
    const restaurant = restaurants.find((r) => r.id === item.model_id);
    if (!restaurant) return;
    restaurantMonthlyMap[restaurant.name][item.month] = {
      list: Number(item.totalList) || 0,
      detail: Number(item.totalDetail) || 0,
    };
  });

  const menuMonthlyMap = {};
  menuIds.forEach((id) => {
    const name = menuIdToNameMap[id];
    menuMonthlyMap[name] = {};
    months.forEach(({ key }) => {
      menuMonthlyMap[name][key] = { list: 0, detail: 0 };
    });
  });
  menuMonthlyStats.forEach((item) => {
    const name = menuIdToNameMap[item.model_id];
    if (!name) return;
    menuMonthlyMap[name][item.month] = {
      list: Number(item.totalList) || 0,
      detail: Number(item.totalDetail) || 0,
    };
  });

  const restaurantMonthlyData = {};
  Object.keys(restaurantMonthlyMap).forEach((name) => {
    restaurantMonthlyData[name] = months.map(({ key, name: monthName }) => ({
      month: monthName,
      list: restaurantMonthlyMap[name][key].list,
      detail: restaurantMonthlyMap[name][key].detail,
    }));
  });

  const menuMonthlyData = {};
  Object.keys(menuMonthlyMap).forEach((name) => {
    menuMonthlyData[name] = months.map(({ key, name: monthName }) => ({
      month: monthName,
      list: menuMonthlyMap[name][key].list,
      detail: menuMonthlyMap[name][key].detail,
    }));
  });
  return {
    totalRestaurants: restaurants.length,
    totalMenus,
    totalDishes,
    restaurantMonthlyData,
    menuMonthlyData,
  };
};



const dashboardStatsService = async (userId, userRole) => {
  try {
    let data;
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

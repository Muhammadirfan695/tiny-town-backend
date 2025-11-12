const { sequelize } = require("../config/db");

const User = require("./user.model");
const Role = require("./role.model");
const Country = require("./countryModel");
const City = require('./cityModel');
const UserRole = require("./userRole.model");
const Attachment = require("./attachment.model");
const Restaurant = require("./restaurant.model");
const ManagerRestaurant = require("./managerRestaurant.model");
const Dish = require("./dish.model");
const Menu = require("./menu.model");
const MenuDish = require("./menuDish.model");
const FavouriteRestaurant = require("./favouriteRestaurant.model");
const MenuRestaurantStats = require('./menuRestaurantStats.model');
const Newsletter = require('./newsletter.model');
const NewsletterRecipient = require('./newsLetterRecipients.model');
const NewsletterRestaurants = require('./newsletterRestaurant.model');

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "Roles",
});

User.hasMany(FavouriteRestaurant, {
  foreignKey: "user_id",
  as: "favouriteRestaurants",
  onDelete: "CASCADE",
})

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  as: "Users",
});


Attachment.belongsTo(User, {
  foreignKey: "model_id",
  constraints: false,
  as: "userAttachment",
  scope: { model_type: "User" },
});

User.hasMany(Attachment, {
  foreignKey: "model_id",
  constraints: false,
  scope: { model_type: "User" },
  as: "attachments",
});

User.hasMany(Restaurant, { foreignKey: 'owner_id', as: 'OwnedRestaurants' });
Restaurant.belongsTo(User, { as: 'Owner', foreignKey: 'owner_id' });

User.hasMany(Restaurant, { foreignKey: 'manager_id', as: 'ManagedRestaurants' });
Restaurant.belongsTo(User, { as: 'Manager', foreignKey: 'manager_id' })
Restaurant.hasMany(Attachment, {
  foreignKey: "model_id",
  constraints: false,
  scope: { model_type: "Restaurant" },
  as: "attachments",
});


Restaurant.hasMany(Dish, {
  foreignKey: "restaurant_id",
  as: "dishes",
  onDelete: "CASCADE",
});
Restaurant.hasMany(FavouriteRestaurant, {
  foreignKey: "restaurant_id",
  as: "favouritedBy",
  onDelete: "CASCADE",
});

Dish.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});


Restaurant.hasMany(Menu, {
  foreignKey: "restaurant_id",
  as: "menus",
  onDelete: "CASCADE",
});


Menu.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
});

Menu.hasMany(Attachment, {
  foreignKey: "model_id",
  constraints: false,
  scope: { model_type: "Menu" },
  as: 'attachments'
})
Attachment.belongsTo(Menu, {
  foreignKey: "model_id",
  constraints: false,
  as: "menuAttachment",
  scope: { model_type: "Menu" },
});
Dish.hasMany(Attachment, {
  foreignKey: "model_id",
  constraints: false,
  scope: { model_type: "Dish" },
  as: 'attachments'
})
Attachment.belongsTo(Dish, {
  foreignKey: "model_id",
  constraints: false,
  as: "dishAttachment",
  scope: { model_type: "Dish" },
});

Menu.belongsToMany(Dish, {
  through: MenuDish,
  foreignKey: "menu_id",
  otherKey: "dish_id",
  as: "dishes"
});

Dish.belongsToMany(Menu, {
  through: MenuDish,
  foreignKey: "dish_id",
  otherKey: "menu_id",
  as: "menus",
});

FavouriteRestaurant.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
  onDelete: "CASCADE",
})

FavouriteRestaurant.belongsTo(Restaurant, {
  foreignKey: "restaurant_id",
  as: "restaurant",
  onDelete: "CASCADE",
})

MenuRestaurantStats.belongsTo(Restaurant, {
  foreignKey: 'model_id',
  constraints: false,
  as: 'restaurant'
});

MenuRestaurantStats.belongsTo(Menu, {
  foreignKey: 'model_id',
  constraints: false,
  as: 'menu'
});

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Country,
  City,
  Attachment,
  Restaurant,
  Dish,
  Menu,
  MenuDish,
  FavouriteRestaurant,
  MenuRestaurantStats,
  Newsletter,
  NewsletterRecipient
  // ManagerRestaurant 
};

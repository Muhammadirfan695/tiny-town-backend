"use strict";
const { Role } = require("../models");

module.exports = {
  up: async () => {
    const count = await Role.count();
    if (count > 0) {
      console.log("⚠️ Roles already exist — skipping.");
      return;
    }

    await Role.bulkCreate([
      { name: "Admin" },
      { name: "Manager" },
      { name: "Owner" },
      { name: "User" },
    ]);
  },

  down: async () => {
    await Role.destroy({ where: {} });
  },
};

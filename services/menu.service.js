const { Menu } = require("../models");

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
    return await Menu.findByPk(id, { transaction });
  };
  
  module.exports = {
    findAllMenus,
    findMenuById,
    validateMenusExistService
  };
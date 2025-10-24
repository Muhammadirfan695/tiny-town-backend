
const { success } = require("../helpers/response.helper");
const { Country, City } = require("../models");

const getAllCountries = async () => {
  try {
    const countries = await Country.findAll({
      attributes: ['id', 'name'],
      order: [
        ['name', 'ASC'],
      ],
    });
    return success(
      "Countries List Fetched Successfully", countries);
  } catch (error) {
    throw error;
  }
};


const getCitiesByCountryId = async (countryId) => {
  try {
    if (!countryId) {
        return error('Country Id Is Required', 404);
    
    }

    const cities = await City.findAll({
      where: { country_id: countryId },
      attributes: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    return success("Cities List Fetched Successfully", cities);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCountries,
  getCitiesByCountryId
};
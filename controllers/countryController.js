
const asyncHandler = require('express-async-handler');
const { handleResponse } = require('../helpers/response.helper');
const { getAllCountries } = require('../services/countryAndCity.service');


const getCountriesList = asyncHandler(async (req, res) => {
    const lang = req.lang || "en";

    const result = await getAllCountries(lang)

    handleResponse(res, result);
});


module.exports = {
    getCountriesList
}
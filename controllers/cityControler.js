
const asyncHandler = require('express-async-handler');
const { handleResponse } = require('../helpers/response.helper');
const { getCitiesByCountryId } = require('../services/countryAndCity.service');


const getCitiesByCountry = asyncHandler(async (req, res) => {
    const lang = req.lang || "en";
    const { countryId } = req.params;
    const result = await getCitiesByCountryId(countryId,lang)

    handleResponse(res, result);
});


module.exports = {
    getCitiesByCountry
}
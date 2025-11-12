
const asyncHandler = require("express-async-handler");
const { dashboardStatsService } = require("../services/dashboard.service");
const { error, handleResponse } = require("../helpers/response.helper");



const getDashboardStats = asyncHandler(async (req, res) => {
    try {
        const result = await dashboardStatsService(req.userId, req.userRole);
        handleResponse(res, result);
    } catch (err) {
        handleResponse(res, error("Dashboard Stats Error:", 400));
    }   
});


module.exports = {
    getDashboardStats
}
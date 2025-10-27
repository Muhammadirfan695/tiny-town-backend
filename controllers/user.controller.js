const asyncHandler = require('express-async-handler');
const { handleResponse, error, success } = require('../helpers/response.helper');
const { updateUserProfileService, findUserById } = require('../services/user.service');



const updateProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.userId;
        if (!id) return handleResponse(res, error("User ID missing from token", 401));

        const { firstName, lastName, email, roles } = req.body;

        const result = await updateUserProfileService(
            { id, firstName, lastName, email, roles },
            req.file
        );

        handleResponse(res, result);
    } catch (err) {
        console.error("updateProfile error:", err);
        handleResponse(res, error("Failed to update profile", 400));
    }
});

const getProfile = asyncHandler(async (req, res) => {
    try {
        const id = req.userId;
        if (!id) return handleResponse(res, error("User ID missing from token", 401));

        const user = await findUserById(id);

        if (!user) {
            return handleResponse(res, error("User not found", 404));
        }

        return handleResponse(res, success("Profile fetched successfully", { data: user }));
    } catch (err) {
        console.error("getProfile error:", err);
        handleResponse(res, error("Failed to get profile", 400));
    }
});

module.exports = {
    updateProfile,
    getProfile,
   
}
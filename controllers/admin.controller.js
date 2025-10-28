
const asyncHandler = require('express-async-handler');
const { handleResponse, error, success } = require('../helpers/response.helper');
const { createUserService } = require('../services/auth.service');
const { findUserById, updateUserService, getAllUsersService, deleteUserService, restoreUserService } = require('../services/user.service');


const createUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, role } = req.body;

    const result = await createUserService({ firstName, lastName, email, role });
    handleResponse(res, result);
});


const getUserById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
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
const UpdateUser = asyncHandler(async (req, res) => {
    try {
        const { id, firstName, lastName, email, roles } = req.body;
        if (!id) return handleResponse(res, error("User ID missing from token", 401));



        const result = await updateUserService(
            { id, firstName, lastName, email, roles },
            req.file
        );

        handleResponse(res, result);
    } catch (err) {
        console.error("updateProfile error:", err);
        handleResponse(res, error("Failed to update profile", 400));
    }
})


const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const result = await getAllUsersService(req.query);
        handleResponse(res, result);
    } catch (err) {
        console.error("getAllUsers controller error:", err);
        handleResponse(res, error("Failed to fetch users", 400));
    }
});

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { hardDelete } = req.query;

        if (!id) {
            return handleResponse(res, error("User ID is required", 400));
        }
        const hardDeleteFlag = hardDelete === "true" || hardDelete === true;

        const result = await deleteUserService(id, { hardDelete: hardDeleteFlag });
        handleResponse(res, result);
    } catch (err) {
        console.error("deleteUser error:", err);
        handleResponse(res, error("Failed to delete user", 400));
    }
});


const restoreUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return handleResponse(res, error("User ID is required", 400));
        }


        const result = await restoreUserService(id);
        handleResponse(res, result);
    } catch (err) {
        console.error("deleteUser error:", err);
        handleResponse(res, error("Failed to Restore user", 400));
    }
});

module.exports = {
    createUser,
    UpdateUser,
    getUserById,
    getAllUsers,
    deleteUser,
    restoreUser
}
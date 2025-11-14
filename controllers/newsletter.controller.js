
const asyncHandler = require('express-async-handler');
const { handleResponse, error, success, } = require('../helpers/response.helper');
const { createNewsletterService, updateNewsletterService, getAllNewslettersService, findNewsletterById, deleteNewsletterService, changeNewsletterStatusService } = require('../services/newsletter.service');


const createNewsletter = asyncHandler(async (req, res) => {
    const files = req.files || [];
    const result = await createNewsletterService(req.body, files);
    handleResponse(res, result);
});
const updateNewsletter = asyncHandler(async (req, res) => {
    const files = req.files || [];
    const result = await updateNewsletterService(req.body, files)
    handleResponse(res, result);
})
const getAllNewsletter = asyncHandler(async (req, res) => {
    const result = await getAllNewslettersService(req.query)
    handleResponse(res, result);
})
const getNewsletterById = asyncHandler(async (req, res) => {
    const {
        id
    } = req.params;
    const result = await findNewsletterById(id)
    if (!result) {
        return res.status(404).json(error("Newsletter not found", 404));
    }
    return res.status(200).json(success("Newsletter Fetched Successfully", result, 200));
})
const deleteNewsletterById = asyncHandler(async (req, res) => {
    const {
        id
    } = req.params;
    const result = await deleteNewsletterService(id)
    if (!result) {
        return res.status(404).json(error("Newsletter not found", 404));
    }
    return res.status(200).json(success("Newsletter Fetched Successfully", result, 200));
})

const readyNewsletter = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await changeNewsletterStatusService(id, status)
    handleResponse(res, result);
})
module.exports = {
    createNewsletter,
    updateNewsletter,
    getAllNewsletter,
    getNewsletterById,
    deleteNewsletterById
}
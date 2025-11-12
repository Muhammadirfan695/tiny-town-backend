
const asyncHandler = require('express-async-handler');
const { handleResponse, error, success, } = require('../helpers/response.helper');
const { createNewsletterService, updateNewsletterService, getAllNewslettersService, findNewsletterById, deleteNewsletterService } = require('../services/newsletter.service');


const createNewsletter = asyncHandler(async (req, res) => {
    const result = await createNewsletterService(req.body, req.file);
    handleResponse(res, result);
});
const updateNewsletter = asyncHandler(async (req, res) => {
    const result = await updateNewsletterService(req.body, req.file)
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
module.exports = {
    createNewsletter,
    updateNewsletter,
    getAllNewsletter,
    getNewsletterById,
    deleteNewsletterById
}
const { Attachment } = require("../models");
const fs = require("fs");
const path = require("path");


const findAllAttachments = async (model_id, model_type, transaction = null) => {
    return await Attachment.findAll({
        where: { model_id: model_id, model_type: model_type },
        transaction,
    });
}

const findOneAttachment = async (model_id, model_type, attachment_type, transaction = null) => {
    return await Attachment.findOne({
        where: {
            model_id: model_id,
            model_type: model_type,
            attachment_type: attachment_type,
        },
        transaction,
    });
}

const createAttachment = async (model_id, model_type, attachment_type, image_path, image_name, transaction = null) => {
 
    return await Attachment.create(
        {
            model_id: model_id,
            model_type: model_type,
            attachment_type: attachment_type,
            image_path: image_path,
            image_name: image_name,
        },
        { transaction }
    );
}


const deleteAttachment = async (attachment, transaction = null) => {
    if (!attachment) return;

    try {
        const oldPath = path.join(__dirname, "..", attachment.image_path);
        if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }

        await attachment.destroy({ transaction });
    } catch (err) {
        console.error("Error deleting attachment:", err);
        throw err;
    }
};


module.exports = {
    findOneAttachment,
    createAttachment,
    deleteAttachment,
    findAllAttachments
}
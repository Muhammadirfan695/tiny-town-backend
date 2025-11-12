const { success, error } = require("../helpers/response.helper");
const { Newsletter, NewsletterRecipient, User, sequelize, Restaurant, Attachment } = require("../models");
const { createAttachment, findOneAttachment, deleteAttachment } = require("./attachment.service");

const findNewsletterById = async (id, transaction = null) => {
    return await Newsletter.findByPk(id, {
        include: [
            {
                model: Restaurant,
                as: "restaurants",
                attributes: ["id", "name"],
                through: { attributes: [] },
            },
            {
                model: Attachment,
                as: "attachments",
            },
        ], transaction,
    });
};

const createNewsletterService = async (data, file) => {
    const transaction = await sequelize.transaction();
    try {
        let { title, content, type = 'manual', restaurantIds = [], recipientEmails = [] } = data;

        if (typeof restaurantIds === "string") {
            restaurantIds = restaurantIds.split(",").map(id => id.trim()).filter(Boolean);
        }
        if (typeof recipientEmails === "string") {
            recipientEmails = recipientEmails.split(",").map(email => email.trim()).filter(Boolean);
        }

        const newsletter = await Newsletter.create(
            { title, content, type },
            { transaction }
        );
        if (restaurantIds.length) {
            await newsletter.setRestaurants(restaurantIds, { transaction });
        }

        if (recipientEmails.length) {
            const normalizedEmails = recipientEmails.map(email => email.trim().toLowerCase());

            const users = await User.findAll({
                where: { email: normalizedEmails },
                attributes: ['id', 'email'],
            });

            const recipientsData = normalizedEmails.map(email => {
                const user = users.find(u => u.email.toLowerCase() === email);
                return {
                    newsletter_id: newsletter.id,
                    user_id: user ? user.id : null,
                    email,
                    status: 'pending',
                };
            });

            await NewsletterRecipient.bulkCreate(recipientsData, { transaction });
        }
        if (file) {
            await createAttachment(
                newsletter.id,
                "Newsletter",
                "newsPromo",
                file.path,
                file.filename,
                transaction
            );
        }
        await transaction.commit();
        return success("NewsLetter Created Successfully", newsletter, 200);




    } catch (err) {
        await transaction.rollback();
        return error(err, 404);
    }
};


const updateNewsletterService = async (data, file) => {
    const transaction = await sequelize.transaction();
    try {
        let { id, title, content, type, status, restaurantIds = [], recipientEmails = [], removeImage } = data;
        const newsletter = await findNewsletterById(id, transaction)
        if (typeof restaurantIds === "string") {
            restaurantIds = restaurantIds.split(",").map(id => id.trim()).filter(Boolean);
        }
        if (typeof recipientEmails === "string") {
            recipientEmails = recipientEmails.split(",").map(email => email.trim()).filter(Boolean);
        }

        if (!newsletter) {
            await transaction.rollback();
            return error("Newsletter not found", 404);
        }

        if (file) {
            const existingAttachment = await findOneAttachment(
                newsletter.id,
                "Newsletter",
                "newsPromo",
                transaction
            );

            if (existingAttachment) {
                await deleteAttachment(existingAttachment, transaction);
            }

            await createAttachment(
                newsletter.id,
                "Newsletter",
                "newsPromo",
                file.path,
                file.filename,
                transaction
            );
        } else if (removeImage === true || removeImage === "true") {

            const existingAttachment = await findOneAttachment(
                newsletter.id,
                "Newsletter",
                "newsPromo",
                transaction
            );
            if (existingAttachment) {
                await deleteAttachment(existingAttachment, transaction);
            }
        }

        if (title) newsletter.title = title;
        if (content) newsletter.content = content;
        if (type) newsletter.type = type;
        if (status) newsletter.status = status;
        await newsletter.save({ transaction });


        if (restaurantIds && restaurantIds.length) {
            await newsletter.setRestaurants(restaurantIds, { transaction });
        } else {
            await newsletter.setRestaurants([], { transaction });
        }


        if (recipientEmails && recipientEmails.length) {
            const normalizedEmails = recipientEmails.map((e) =>
                e.trim().toLowerCase()
            );

            const existingRecipients = await NewsletterRecipient.findAll({
                where: { newsletter_id: newsletter.id },
                attributes: ["id", "email"],
                transaction,
            });

            const existingEmails = existingRecipients.map((r) => r.email);

            const emailsToAdd = normalizedEmails.filter(
                (email) => !existingEmails.includes(email)
            );

            const emailsToRemove = existingEmails.filter(
                (email) => !normalizedEmails.includes(email)
            );

            if (emailsToRemove.length) {
                await NewsletterRecipient.destroy({
                    where: {
                        newsletter_id: newsletter.id,
                        email: emailsToRemove,
                    },
                    transaction,
                });
            }

            if (emailsToAdd.length) {
                const users = await User.findAll({
                    where: { email: emailsToAdd },
                    attributes: ["id", "email"],
                    transaction,
                });

                const newRecipients = emailsToAdd.map((email) => {
                    const user = users.find((u) => u.email === email);
                    return {
                        newsletter_id: newsletter.id,
                        user_id: user ? user.id : null,
                        email,
                        status: "pending",
                    };
                });

                await NewsletterRecipient.bulkCreate(newRecipients, { transaction });
            }
        }

        await transaction.commit();
        return success("NewsLetter Updated Successfully", newsletter, 200);
    } catch (err) {
        await transaction.rollback();
        return error(err, 404);
    }
};

const getAllNewslettersService = async (query) => {
    try {
        let {
            page = 1,
            limit = 10,
            title,
            status,
            type,
            sortBy = "createdAt",
            order = "DESC",
        } = query;

        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (title) whereClause.title = { [Op.iLike]: `%${title}%` };
        if (status) whereClause.status = status;
        if (type) whereClause.type = type;

        const { count, rows } = await Newsletter.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: Restaurant,
                    as: "restaurants",
                    attributes: ["id", "name"],
                    through: { attributes: [] },
                },
                {
                    model: Attachment,
                    as: "attachments",
                },
            ],
            order: [[sortBy, order.toUpperCase()]],
            offset,
            limit,
            distinct: true,
        });

        return success("Newsletter fetched successfully", {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
            newsletters: rows,
        })
    } catch (err) {
        return error(err, 400);
    }
};

const deleteNewsletterService = async (newsletterId) => {
    const transaction = await sequelize.transaction();
    try {
        const newsletter = await Newsletter.findByPk(newsletterId, { transaction });

        if (!newsletter) {
            await transaction.rollback();
            return { status: 404, message: "Newsletter not found" };
        }
        
        const attachment = await findOneAttachment(newsletter.id, "Newsletter", "newsPromo", transaction);
        if (attachment) {
            await deleteAttachment(attachment, transaction);
        }

        
        await NewsletterRecipient.destroy({
            where: { newsletter_id: newsletter.id },
            transaction,
        });
        
        await newsletter.setRestaurants([], { transaction });

        await newsletter.destroy({ transaction });

        await transaction.commit();
        return success("Newsletter deleted successfully", null, 200);
    } catch (err) {
        await transaction.rollback();
        return error(err.message || "Something went wrong", 500);
    }
};



module.exports = {
    createNewsletterService,
    updateNewsletterService,
    getAllNewslettersService,
    deleteNewsletterService,
    findNewsletterById
}
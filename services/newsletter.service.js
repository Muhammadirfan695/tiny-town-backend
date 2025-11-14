const { success, error } = require("../helpers/response.helper");
const { Newsletter, NewsletterRecipient, User, sequelize, Restaurant, Attachment } = require("../models");
const sendEmailToRecipient = require("../queue/emailQueue");
const { createAttachment, findOneAttachment, deleteAttachment, findAllAttachments } = require("./attachment.service");

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




const createNewsletterService = async (data, files = []) => {
    const transaction = await sequelize.transaction();
    try {
        let { title, content, type = 'manual', restaurantId = null, recipientEmails = [] } = data;

        restaurantId = restaurantId ? String(restaurantId).trim() : null;

        if (typeof recipientEmails === "string") {
            recipientEmails = recipientEmails.split(",").map(email => email.trim()).filter(Boolean);
        }

        const newsletter = await Newsletter.create(
            { title, content, type, restaurant_id: restaurantId },
            { transaction }
        );

        let recipients = [];
        if (recipientEmails.length) {
            const normalizedEmails = recipientEmails.map(email => email.toLowerCase().trim());

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
                    restaurant_id: restaurantId
                };
            });

            recipients = await NewsletterRecipient.bulkCreate(recipientsData, { transaction });
        }

        let newsletterAttachments = [];
        if (files.length > 0) {
            for (const file of files) {
                await createAttachment(
                    newsletter.id,
                    "Newsletter",
                    "newsPromo",
                    file.path,
                    file.filename,
                    transaction
                );
            }

            newsletterAttachments = await findAllAttachments(newsletter.id, "Newsletter", transaction);
        }

        await transaction.commit();

      

        return success("Newsletter Created Successfully", newsletter, 200);

    } catch (err) {
        await transaction.rollback();
        return error(err, 404);
    }
};




const updateNewsletterService = async (data, files = []) => {
    const transaction = await sequelize.transaction();
    try {
        let {
            id,
            title,
            content,
            type,
            restaurantId = null,
            recipientEmails = [],
            removeAttachmentIds = []
        } = data;

        restaurantId = restaurantId ? String(restaurantId).trim() : null;

        if (typeof recipientEmails === "string") {
            recipientEmails = recipientEmails.split(",").map(email => email.trim()).filter(Boolean);
        }

        const newsletter = await Newsletter.findByPk(id, { transaction });

        if (!newsletter) {
            await transaction.rollback();
            return error("Newsletter not found", 404);
        }

        if (newsletter.status !== "draft") {
            await transaction.rollback();
            return error("Only draft newsletters can be updated", 400);
        }

        const previousRestaurantId = newsletter.restaurant_id;
        const restaurantChanged = restaurantId && restaurantId !== previousRestaurantId;
        const coreChanged = (title && title !== newsletter.title)
            || (content && content !== newsletter.content)
            || restaurantChanged;

        if (removeAttachmentIds && removeAttachmentIds.length > 0) {
            const attachmentsToRemove = await Attachment.findAll({
                where: {
                    id: removeAttachmentIds,
                    model_id: newsletter.id,
                    model_type: "Newsletter"
                },
                transaction
            });

            for (const attachment of attachmentsToRemove) {
                await deleteAttachment(attachment, transaction);
            }
        }

        if (files.length > 0) {
            for (const file of files) {
                await createAttachment(
                    newsletter.id,
                    "Newsletter",
                    "newsPromo",
                    file.path,
                    file.filename,
                    transaction
                );
            }
        }

        if (title) newsletter.title = title;
        if (content) newsletter.content = content;
        if (type) newsletter.type = type;
        if (restaurantId) newsletter.restaurant_id = restaurantId;

        await newsletter.save({ transaction });

        let newRecipients = [];

        if (restaurantChanged) {
            await NewsletterRecipient.update(
                { restaurant_id: restaurantId },
                {
                    where: { newsletter_id: newsletter.id },
                    transaction
                }
            );
        }

        if (recipientEmails && recipientEmails.length) {
            const normalizedEmails = recipientEmails.map(e => e.toLowerCase().trim());

            const existingRecipients = await NewsletterRecipient.findAll({
                where: { newsletter_id: newsletter.id },
                attributes: ["id", "email", "user_id", "restaurant_id"],
                transaction,
            });

            const existingEmails = existingRecipients.map(r => r.email.toLowerCase());

            const emailsToAdd = normalizedEmails.filter(email => !existingEmails.includes(email));

            if (emailsToAdd.length) {
                const users = await User.findAll({
                    where: { email: emailsToAdd },
                    attributes: ["id", "email"],
                    transaction,
                });

                newRecipients = emailsToAdd.map(email => {
                    const user = users.find(u => u.email.toLowerCase() === email);
                    return {
                        newsletter_id: newsletter.id,
                        user_id: user ? user.id : null,
                        email,
                        status: "pending",
                        restaurant_id: restaurantId
                    };
                });

                await NewsletterRecipient.bulkCreate(newRecipients, { transaction });
            }
        }

        await transaction.commit();

        return success("Newsletter Updated Successfully", newsletter, 200);

    } catch (err) {
        await transaction.rollback();
        return error(err, 404);
    }
};


const changeNewsletterStatusService = async (newsletterId, newStatus) => {
    const transaction = await sequelize.transaction();
    try {
        const newsletter = await Newsletter.findByPk(newsletterId, { transaction });

        if (!newsletter) {
            await transaction.rollback();
            return error("Newsletter not found", 404);
        }

        if (newsletter.status !== "draft" && newStatus === "ready") {
            await transaction.rollback();
            return error("Only draft newsletters can be moved to Published", 400);
        }

        newsletter.status = newStatus;
        await newsletter.save({ transaction });
        await transaction.commit();

        if (newStatus === "ready") {
            const recipients = await NewsletterRecipient.findAll({
                where: { newsletter_id: newsletter.id },
            });

            const attachments = await findAllAttachments(newsletter.id, "Newsletter");
            const newsletterImages = attachments.map(att => ({
                url: att.path,
                filename: att.filename
            }));

            if (recipients.length > 0) {
                await Promise.all(recipients.map(n =>
                    sendEmailToRecipient.add(
                        "sendRecipientEmail",
                        {
                            recipient: {
                                id: n.id,
                                email: n.email,
                                user_id: n.user_id,
                                restaurant_id: n.restaurant_id
                            },
                            newsletter: {
                                id: newsletter.id,
                                title: newsletter.title,
                                content: newsletter.content,
                                image: newsletterImages,
                                restaurant_id: newsletter.restaurant_id
                            }
                        },
                        {
                            attempts: 3,
                            backoff: {
                                type: 'exponential',
                                delay: 10000,
                            }
                        }
                    )
                ));
            }
        }

        return success("Newsletter status updated successfully", newsletter, 200);

    } catch (err) {
        await transaction.rollback();
        return error(err, 500);
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
    findNewsletterById,
    changeNewsletterStatusService
}
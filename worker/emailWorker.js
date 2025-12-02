const { Worker } = require("bullmq");
const Redis = require("ioredis");

const { sendEmail } = require("../utils/sendEmail");
const { NewsletterRecipient } = require("../models");

const MAX_RETRIES = 3;

const connection = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});


const worker = new Worker(
    "sendEmailToRecipient",
    async (job) => {
        const { recipient, newsletter } = job.data;
        try {
            await sendNewsletter(recipient, newsletter);

            await NewsletterRecipient.update(
                { status: "sent" },
                { where: { id: recipient.id } }
            );

        } catch (err) {
            console.error("Email failed for", recipient.email, err);
            await NewsletterRecipient.update(
                { status: "failed" },
                { where: { id: recipient.id } }
            );

            throw err;
        }
    },
    { connection }
);


worker.on("completed", (job) => console.log(`✅ Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`❌ Job ${job.id} failed`, err));

console.log("🎯 Email worker started");

const sendNewsletter = async (recipient, newsletter) => {
    const restaurant = newsletter.restaurant;

    let menusHtml = "";
    if (restaurant && restaurant.Menus) {
        menusHtml = restaurant.Menus.map(menu => `
            <h3>${menu.name}</h3>
            ${menu.description ? `<p>${menu.description}</p>` : ""}
            <ul>
                ${menu.Dishes.map(dish => `
                    <li>
                        <strong>${dish.name}</strong> - $${dish.price} <br/>
                        ${dish.description || ""}
                    </li>
                `).join("")}
            </ul>
        `).join("");
    }

    const imagesHtml = (newsletter.image || [])
        .map(img => `<img src="${img.url}" alt="${img.filename}" style="max-width:100%; margin-top:10px;" />`)
        .join("");

    const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${newsletter.title}</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: auto; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
            h2 { color: #0056b3; margin-top: 10px; }
            h3 { color: #222; margin-top: 20px; }
            ul { text-align: left; padding-left: 20px; }
            li { margin-bottom: 10px; }
            .footer { font-size: 13px; color: #777; margin-top: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>${newsletter.title}</h2>
            ${newsletter.content}
            ${imagesHtml}
            ${menusHtml}
            <div class="footer">You received this email because you subscribed to our newsletter.</div>
        </div>
    </body>
    </html>
    `;

    return await sendEmail({
        to: recipient.email,
        subject: newsletter.title,
        text: newsletter.title,
        html: htmlMessage
    });
};



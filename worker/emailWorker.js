const { Worker } = require("bullmq");
const Redis = require("ioredis");


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
        console.log("⚡ Processing job:", job.name);
        console.log("job.data", job.data);

        const { recipient, newsletter } = job.data;

        console.log("Recipient:", recipient);
        console.log("Newsletter:", newsletter);

        await sendInvitationEmail(guest.email, event, guest, pdfBuffer, lang, child.name);


    },
    { connection }
);

worker.on("completed", (job) => console.log(`✅ Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`❌ Job ${job.id} failed`, err));

console.log("🎯 Email worker started");


const sendNewsletter = async (to, link) => {
    if (!recipient || !newsletter) throw new Error("Recipient and Newsletter data are required");

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
        .link { font-size: 18px; font-weight: bold; color: #222; word-break: break-all; }
        .footer { font-size: 13px; color: #777; margin-top: 30px; }
      </style>
    </head>
    <body>
      ${newsletter.content}
    </body>
    </html>
    `;

    return await sendEmail({
        to,
        subject: newsletter.title,
        text: newsletter.title,
        html: htmlMessage,
    });
};
const nodeMailer = require('nodemailer');



const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.html,
        encoding: "utf-8",
    };

    await transporter.sendMail(mailOptions);
};
module.exports = { sendEmail };

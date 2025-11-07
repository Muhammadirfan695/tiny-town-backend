const { emailTranslations } = require("../utils");
const { sendEmail } = require("../utils/sendEmail");

exports.sendResetOtpEmail = async (to, otp, lang = "en") => {
  const t = emailTranslations[lang]?.passwordReset || emailTranslations.en.passwordReset;
  const appLogoUrl = `${process.env.BASE_URL}public/assets/bdaybee-header-logo.svg`;
  console.log("appLogoUrl", appLogoUrl)
  const htmlMessage = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <title>${t.subject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            color: #333;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
          }
          .logo {
            width: 120px;
            margin-bottom: 20px;
          }
          h2 {
            color: #0056b3;
            margin-top: 10px;
          }
          .otp {
            font-size: 20px;
            font-weight: bold;
            color: #222;
          }
          .footer {
            font-size: 13px;
            color: #777;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${appLogoUrl}" alt="App Logo" class="logo" />
  
          <h2>${t.heading}</h2>
          <p>${t.message}</p>
  
          <p class="otp">${otp}</p>
  
          <p>${t.expires}</p>
  
          <div class="footer">
            <p>${t.footer || "Thank you for joining us!"}</p>
            <p>&copy; ${new Date().getFullYear()} BdayBee</p>
          </div>
        </div>
      </body>
      </html>
    `;
  //     const htmlMessage = `
  //     <!DOCTYPE html>
  //     <html lang="${lang}">
  //     <head>
  //       <meta charset="UTF-8">
  //       <title>${t.subject}</title>
  //     </head>
  //     <body style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
  //       <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
  //         <h2 style="color: #0056b3;">${t.heading}</h2>
  //         <p>${t.message}</p>
  //         <p><strong>${otp}</strong></p>
  //         <p style="margin-top: 20px;">${t.expires}</p>
  //       </div>
  //     </body>
  //     </html>
  //   `;



  return await sendEmail({
    to,
    subject: t.subject,
    message: t.text(otp),
    text: t.text(otp),
    html: htmlMessage,
  });
};

exports.sendResetOtpEmail = async (to, otp, lang = "en") => {
  const t = emailTranslations[lang]?.passwordReset || emailTranslations.en.passwordReset;
  const appLogoUrl = `${process.env.BASE_URL}public/assets/bdaybee-header-logo.svg`;
  console.log("appLogoUrl", appLogoUrl)
  const htmlMessage = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <title>${t.subject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            color: #333;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
          }
          .logo {
            width: 120px;
            margin-bottom: 20px;
          }
          h2 {
            color: #0056b3;
            margin-top: 10px;
          }
          .otp {
            font-size: 20px;
            font-weight: bold;
            color: #222;
          }
          .footer {
            font-size: 13px;
            color: #777;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${appLogoUrl}" alt="App Logo" class="logo" />
  
          <h2>${t.heading}</h2>
          <p>${t.message}</p>
  
          <p class="otp">${otp}</p>
  
          <p>${t.expires}</p>
  
          <div class="footer">
            <p>${t.footer || "Thank you for joining us!"}</p>
            <p>&copy; ${new Date().getFullYear()} BdayBee</p>
          </div>
        </div>
      </body>
      </html>
    `;
  //     const htmlMessage = `
  //     <!DOCTYPE html>
  //     <html lang="${lang}">
  //     <head>
  //       <meta charset="UTF-8">
  //       <title>${t.subject}</title>
  //     </head>
  //     <body style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
  //       <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
  //         <h2 style="color: #0056b3;">${t.heading}</h2>
  //         <p>${t.message}</p>
  //         <p><strong>${otp}</strong></p>
  //         <p style="margin-top: 20px;">${t.expires}</p>
  //       </div>
  //     </body>
  //     </html>
  //   `;



  return await sendEmail({
    to,
    subject: t.subject,
    message: t.text(otp),
    text: t.text(otp),
    html: htmlMessage,
  });
};


exports.sendWelcomeEmailWithOtp = async (to, otp, lang) => {
  const t = emailTranslations[lang]?.welcome || emailTranslations.en.welcome;

  const appLogoUrl = `${process.env.BASE_URL}public/assets/bdaybee-header-logo.svg`;
  console.log("appLogoUrl", appLogoUrl)
  const htmlMessage = `
      <!DOCTYPE html>
      <html lang="${lang}">
      <head>
        <meta charset="UTF-8">
        <title>${t.subject}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            color: #333;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
          }
          .logo {
            width: 120px;
            margin-bottom: 20px;
          }
          h2 {
            color: #0056b3;
            margin-top: 10px;
          }
          .otp {
            font-size: 20px;
            font-weight: bold;
            color: #222;
          }
          .footer {
            font-size: 13px;
            color: #777;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="${appLogoUrl}" alt="App Logo" class="logo" />
  
          <h2>${t.heading}</h2>
          <p>${t.message}</p>
  
          <p class="otp">${otp}</p>
  
          <p>${t.expires}</p>
  
          <div class="footer">
            <p>${t.footer || "Thank you for joining us!"}</p>
            <p>&copy; ${new Date().getFullYear()} BdayBee</p>
          </div>
        </div>
      </body>
      </html>
    `;

  return await sendEmail({
    to,
    subject: t.subject,
    text: t.text(otp),
    message: t.text(otp),
    html: htmlMessage,
  });
};


const sendMagicLink = async (to, link) => {
  if (!to || !link) throw new Error("Recipient and link are required");

  const htmlMessage = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Magic Link to Login</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background-color: #f8f9fa; }
      .container { max-width: 600px; margin: auto; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
      h2 { color: #0056b3; margin-top: 10px; }
      .link { font-size: 18px; font-weight: bold; color: #222; word-break: break-all; }
      .footer { font-size: 13px; color: #777; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Magic Link</h2>
      <p>Click the link below to login:</p>
      <p class="link"><a href="${link}">${link}</a></p>
      <p class="footer">This link will expire shortly. Do not share it with anyone.</p>
    </div>
  </body>
  </html>
  `;

  return await sendEmail({
    to,
    subject: "Your Magic Login Link",
    text: `Use this link to login: ${link}`,
    html: htmlMessage,
  });
};


const sendOTPtoResetPassword = async (to, otp) => {
  if (!to || !otp) throw new Error("Recipient and otp are required");

  const htmlMessage = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Code to Reset Password</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background-color: #f8f9fa; }
      .container { max-width: 600px; margin: auto; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
      h2 { color: #0056b3; margin-top: 10px; }
      .link { font-size: 18px; font-weight: bold; color: #222; word-break: break-all; }
      .footer { font-size: 13px; color: #777; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>OTP</h2>
      <p>Use the otp in below to reset password</p>
      <p class="link">${otp}</p>
      <p class="footer">This otp will expire shortly. Do not share it with anyone.</p>
    </div>
  </body>
  </html>
  `;

  return await sendEmail({
    to,
    subject: "Your Reset Code",
    text: `Use this code to reset: ${otp}`,
    html: htmlMessage,
  });
};

const sendOTPtoVerify = async (to, otp) => {
  if (!to || !otp) throw new Error("Recipient and otp are required");

  const htmlMessage = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Code to Verify Account</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background-color: #f8f9fa; }
      .container { max-width: 600px; margin: auto; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
      h2 { color: #0056b3; margin-top: 10px; }
      .link { font-size: 18px; font-weight: bold; color: #222; word-break: break-all; }
      .footer { font-size: 13px; color: #777; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>OTP</h2>
      <p>Use the otp in below to verify your account</p>
      <p class="link">${otp}</p>
      <p class="footer">This otp will expire shortly. Do not share it with anyone.</p>
    </div>
  </body>
  </html>
  `;

  return await sendEmail({
    to,
    subject: "Your Verification Code",
    text: `Use this code to verify: ${otp}`,
    html: htmlMessage,
  });
};

const sendRequestNotify = async (to, firstName, role) => {
  if (!to) throw new Error("Recipient is required");

  const htmlMessage = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Signup Request Submitted</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background-color: #f8f9fa; }
      .container { max-width: 600px; margin: auto; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
      h2 { color: #0056b3; margin-top: 10px; }
      .link { font-size: 18px; font-weight: bold; color: #222; word-break: break-all; }
      .footer { font-size: 13px; color: #777; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Welcome</h2>
      <p>Hi ${firstName}, your signup request as ${role} has been submitted. You'll be notified once it's approved.</p>

    </div>
  </body>
  </html>
  `;

  return await sendEmail({
    to,
    subject: "Signup Request Submitted",
    text: `Signup Request Submitted`,
    html: htmlMessage,
  });
};
const sendAcceptRejectNotify = async (to, status, firstName, role) => {
  if (!to) throw new Error("Recipient is required");

  const htmlMessage = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Your Request Status</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px; background-color: #f8f9fa; }
      .container { max-width: 600px; margin: auto; background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 10px; }
      h2 { color: #0056b3; margin-top: 10px; }
      .link { font-size: 18px; font-weight: bold; color: #222; word-break: break-all; }
      .footer { font-size: 13px; color: #777; margin-top: 30px; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Status</h2>
      <p>Hi ${firstName}, your signup request as ${role} has been ${status}.</p>

    </div>
  </body>
  </html>
  `;

  return await sendEmail({
    to,
    subject: "Your Request Status",
    text: `Your Request Status`,
    html: htmlMessage,
  });
};
module.exports = {
  sendMagicLink,
  sendOTPtoResetPassword,
  sendOTPtoVerify,
  sendRequestNotify, sendAcceptRejectNotify
};
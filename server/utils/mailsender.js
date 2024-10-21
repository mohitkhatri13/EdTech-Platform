const nodemailer = require("nodemailer");
require('dotenv').config();

const mailsender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      // port: process.env.MAIL_PORT || 587, // default to 587 if not specified
      // secure: process.env.MAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: 'By-Mohit Khatri-Ed Tech Project <no-reply@example.com>', 
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });

    console.log("Email sent successfully:", info);
    return info;
  } catch (error) {
    console.log("Error in mail sender");
    console.log(error.message);
    throw error;
  }
};

module.exports = mailsender;

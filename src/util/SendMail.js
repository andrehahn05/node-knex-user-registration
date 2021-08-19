const nodemailer = require("nodemailer");
const mailConfig = require("../config/mail");

module.exports = {
  async sendMail(data) {
    const { host, port, secure, auth } = mailConfig;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth,
    });
    await transporter.sendMail(data);
  },
};


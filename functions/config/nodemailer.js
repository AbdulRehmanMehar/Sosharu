const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const keys = require('./keys.js');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: keys.nodemailer.api
    }
  })
);

module.exports = transporter;
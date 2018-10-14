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

const send = (to, subject, content) => {
  let config = {
    from: 'Sosharu <no-reply@social-57b13.firebaseapp.com>',
    to: to,
    subject: subject,
    html: content
  };
  transporter.sendMail(config, (err, resp) => {
    if (err) return console.log(err);
    console.log(resp);
  });
};

send('mehars.6925@gmail.com', 'Testing', 'Nodemailer Rocks!');

module.exports = { send, transporter };
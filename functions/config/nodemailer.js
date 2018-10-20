const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const compiler = require('./compiler.js');
const keys = require('./keys.js');

let capital_letter = (str) => {
  str = str.split(" ");

  for (i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }

  return str.join(" ");
};

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: keys.nodemailer.api
    }
  })
);

const send = (to, subject, templatename, templatedata) => {
  let config = {
    from: 'Sosharu <no-reply@social-57b13.firebaseapp.com>',
    to: to,
    subject: subject,
    html: compiler.compileTemplate(templatename, templatedata),
  };
  transporter.sendMail(config, (err, resp) => {
    if (err) return console.log(err);
    console.log(resp);
  });
};



module.exports = { send, transporter };
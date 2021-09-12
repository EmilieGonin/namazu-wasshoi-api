const nodemailer = require("nodemailer");
const env = process.env.NODE_ENV || 'dev';
let transport;

if (env == "dev") {
  transport = nodemailer.createTransport(process.env.MAILTRAP_URL);
} else {
  transport = nodemailer.createTransport(process.env.MAILERTOGO_URL);
}

transport.verify((e) => {
  if (e) {
    console.error(e);
  } else {
    console.log("Service mail : OK");
  }
})

const mailTemplate = function(to, subject, content) {
  return {
    from: process.env.MAIL_FROM,
    to: to,
    subject: subject,
    html: `
      <div style="width:100%; max-width:500px; margin:auto;font-family:sans-serif;font-size:14px;">
        <a href="https://namazuwasshoi.com/"><img src="cid:bann@namazuwasshoi.com" style="width:100%; max-height:180px; object-fit:cover;border-top:6px solid #e62e39;border-bottom:6px solid #e62e39;" /></a>
        <p>
          ${content}
        </p>
        <a href="https://namazuwasshoi.com/" style="display:block; margin:auto; width:150px; padding:15px; text-align:center; background-color:#e62e39; color:white; text-decoration:none; font-size:15px;">Accéder au site</a>
      </div>
    `,
    attachments: [{
      filename: "bann.png",
      path: "./assets/bann.png",
      cid: "bann@namazuwasshoi.com"
    }]
  };
}

module.exports = { transport, mailTemplate };

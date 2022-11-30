const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const filePath = path.join(__dirname, "../Templates/password.html");
const source = fs.readFileSync(filePath, "utf8").toString();
const template = handlebars.compile(source);
const replacement = {
  name: "Thomas Dalem",
  link: "dashboard.signai.fr/password",
};
const htmlToSend = template(replacement);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_TOKEN,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const MAIL_LIST = [
  { type: "created", subject: "Votre projet à été validé!", html: htmlToSend },
  { type: "yes", subject: "Votre projet est en cour d'optimisation", html: htmlToSend},
  { type: "finished", subject: "Votre projet est terminé", html: htmlToSend },
];

async function sendMail(emailType, emailAddress, projectName) {

  const index = MAIL_LIST.findIndex((item) => item.type === emailType);

  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "nepasrepondre.signai@gmail.com",
        clientId: process.env.GOOGLE_CLIENT_TOKEN,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "NePasRepondre SignAI <nepasrepondre.signai@gmail.com>",
      to: emailAddress,
      subject: MAIL_LIST[index].subject,
      text: "Veuillez activer l'accès à l'HTML de ce mail",
      html: MAIL_LIST[index].html,
      attachments: [
        {
          filename: "2023_logo_signai.png",
          path: __dirname + "/../Templates/images/2023_logo_signai.png",
          cid: "logo",
        },
      ],
    };
    const res = await transport.sendMail(mailOptions);
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
    return e;
  }
}

module.exports = { sendMail };

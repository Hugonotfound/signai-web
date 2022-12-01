const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_TOKEN,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const getHtml = (input, projectName, projectId) => {
  const filePath = path.join(__dirname, input);
  const source = fs.readFileSync(filePath, "utf8").toString();
  const template = handlebars.compile(source);
  const replacement = {
    projectName: projectName,
    link: 'https://dashboard.signai.fr/view/' + projectId,
  };
  return template(replacement);
};

const MAIL_LIST = [
  {
    type: "created",
    subject: "Votre projet à été validé!",
    html: "../Templates/created.html",
  },
  {
    type: "starting",
    subject: "Votre projet est en cour de traitement!",
    html: "../Templates/starting.html",
  },
  {
    type: "finished",
    subject: "Votre projet est terminé!",
    html: "../Templates/finished.html",
  },
];

async function sendMail(emailType, emailAddress, projectName, projectId) {
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
      to: emailAddress, //tableau d'adresses ou string avec une adresse
      subject: MAIL_LIST[index].subject,
      text: "Veuillez activer l'accès à l'HTML de ce mail",
      html: getHtml( MAIL_LIST[index].html, projectName, projectId),
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

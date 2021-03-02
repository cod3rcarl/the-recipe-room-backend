const nodemailer = require("nodemailer");
const config = require("../config/config");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(config.GOOGLE_CLIENT, config.GOOGLE_SECRET, "https://developers.google.com/oauthplayground");

  oauth2Client.setCredentials({
    refresh_token: config.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err);
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: config.GOOGLE_EMAIL,
      accessToken,
      clientId: config.GOOGLE_CLIENT,
      clientSecret: config.GOOGLE_SECRET,
      refreshToken: config.GOOGLE_REFRESH_TOKEN,
    },
  });
  console.log(transporter);
  return transporter;
};

const sendEmail = async (emailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

// send mail with defined transport object

module.exports = sendEmail;

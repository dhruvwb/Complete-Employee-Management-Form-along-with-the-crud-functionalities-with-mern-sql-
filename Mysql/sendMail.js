const nodemailer = require("nodemailer");

const sendMail = async (BodyMail, Subject, html, req, res) => {
  const testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  let transporter = await nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "palsahab427@gmail.com",
      pass: "obqk pkow ublv obzo",
    },
  });
  const personalEmail = req.body.personalEmail;
  const officeEmail = req.body.officeEmail;
  const emailAddress =
    personalEmail === officeEmail
      ? [personalEmail]
      : [personalEmail, officeEmail];

  const htmlFromDb = html;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString();
  const link = "https://www.google.com/";
  const modifiedHtml = htmlFromDb
    .replace("[Employee name]", req.body.firstName)
    .replace("[Registration Date]", formattedDate)
    .replace("[Verification Link]", link);

  // console.log(BodyMail);
  let info = await transporter.sendMail({
    from: "noreply <santino47@ethereal.email>",
    to: emailAddress,
    subject: Subject,
    text: BodyMail,
    html: modifiedHtml,
  });

  console.log("Message send %s", info.messageId);
  res.json(info);
};

module.exports = sendMail;

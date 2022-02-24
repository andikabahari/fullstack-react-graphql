import nodemailer from "nodemailer";

type MailOptions = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(options: MailOptions) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();
  // console.log("testAccount", testAccount);

  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "sxgo6isn43tlua6p@ethereal.email",
      pass: "Q42sg5sTave8mNQzRN",
    },
  });

  let info = await transporter.sendMail(options);

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

import nodemailer from 'nodemailer';
import process from "process";

export const sendMail = async (email, subject, text) => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.MAILER_USER_GG,
      pass: process.env.MAILER_PASS_GG,
    },
  });

  const mailOptions = {
    from: `"BooksShop" <${process.env.MAILER_USER_GG}>`,
    to: email,
    subject,
    // text,
    html: text, // html body
  }

  let info = await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {

      console.log("Message sent!");
    }
  });

}


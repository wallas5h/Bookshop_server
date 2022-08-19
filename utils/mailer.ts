import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import process from "process";

export enum EmailSubject {
  newsletter = 'Newsletter - sign up',
  register = 'Activate your account',
  reset = 'Reset password',
  set = 'Password reset confirmation',
}

export enum EmailType {
  newsletter = 'newsletter/newsletter',
  register = 'register/register',
  reset = 'resetPwd/resetPwd',
  set = 'setPwd/setPwd',
}

export const sendMail = async (email, subject, emailType: EmailType, link = "", link2 = "", user = "", ip = "", date = "") => {

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.MAILER_USER_GG,
      pass: process.env.MAILER_PASS_GG,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: path.join(__dirname, '../views/'),
      layoutsDir: path.join(__dirname, '../views/'),
      defaultLayout: ''
    },
    viewPath: path.join(__dirname, '../views/'),
    extName: '.hbs'
  };

  transporter.use('compile', hbs(handlebarOptions));

  const mailOptions = {
    from: `"BooksShop" <${process.env.MAILER_USER_GG}>`,
    to: email,
    subject,
    template: emailType,
    context: {
      link,
      link2,
      user,
      ip,
      date,
    }
  }

  let info = await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      console.log("Message sent!");
    }
  });

}


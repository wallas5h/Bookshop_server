import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import process from "process";
import { EmailView } from "./mailer.utils";

export const sendOrderMail = async (
  transactionId,
  email,
  subject,
  emailView: EmailView,
  books,
  addressDetails,
  deliveryCost,
  deliveryName,
  paymentMethodName,
  booksCost,
  totalCost,
  date,
  invoice
) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAILER_USER_GG,
      pass: process.env.MAILER_PASS_GG,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.join(__dirname, "../views/"),
      layoutsDir: path.join(__dirname, "../views/"),
      defaultLayout: "",
    },
    viewPath: path.join(__dirname, "../views/"),
    extName: ".hbs",
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: `"BooksShop" <${process.env.MAILER_USER_GG}>`,
    to: email,
    subject,
    template: emailView,
    context: {
      booksData: books.map((book, index) => {
        return {
          nr: index + 1,
          title: book.title,
          count: book.count,
          price: Number(book.price).toFixed(2),
        };
      }),
      transactionId,
      name: addressDetails.name,
      street: addressDetails.street,
      city: addressDetails.city,
      postcode: addressDetails.postcode,
      country: addressDetails.country,
      areaCode: addressDetails.areaCode,
      phone: addressDetails.phone,
      deliveryCost: Number(deliveryCost).toFixed(2),
      deliveryName,
      paymentMethodName,
      booksCost: Number(booksCost).toFixed(2),
      totalCost,
      date,
      invoice,
    },
  };

  let info = await transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
      console.log("Message sent!");
    }
  });
};

import bcrypt from "bcrypt";
import { config } from "../config/config";
import { User } from "../models";
import { sendMail } from "../utils/mailer";
import { EmailSubject, EmailView } from "../utils/mailer.utils";

export const resetPassword = async (req, res) => {
  const email = String(req.body.email);

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).send("Error: Invalid credencials");
    return;
  }

  let token: string = user.refreshToken;

  const confirmedLink = `${config.corsOrigin}/password/set/${token}`;

  sendMail(email, EmailSubject.reset, EmailView.reset, confirmedLink);

  res.status(200).json({
    message: "Check your email, we send you link to reset password.",
  });
};

export const setPassword = async (req, res) => {
  const { password, token } = req.body;
  const ip = req.ip;
  const date = new Date().toLocaleString();

  const user = await User.findOne({
    refreshToken: token,
  });

  if (!user) {
    res.status(400).json({
      message: "Error: Invalid credencials",
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user.password = hashedPassword;
  await user.save();

  sendMail(
    user.email,
    EmailSubject.set,
    EmailView.set,
    "",
    "",
    user.email,
    ip,
    date
  );

  res.status(200).json({
    message:
      "Your password has been changed successfully. Use your new password to login.",
  });
};

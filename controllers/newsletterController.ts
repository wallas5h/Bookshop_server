import { config } from "../config/config";
import { Newsletter } from "../models/newsletterModel";
import { sendMail } from "../utils/mailer";


// @desc get newsletter
// @route get /api/newsletter
// @acces Pivate


export const getUserFromNewsletter = async (req, res) => {

}

// @desc post newsletter
// @route post /api/newsletter
// @acces Pivate

export const addUserToNewsletter = async (req, res) => {
  const email = String(req.body.email);

  if (!email) {
    res
      .status(400)
      .json({
        message: 'Invalid input data'
      })
    return;
  }

  const emailExist = await Newsletter.findOne({
    email,
  });

  if (emailExist && emailExist.confirm) {
    res
      .status(200)
      .json({
        message: `That email address already exists in Newsletter's list`
      })
    return;
  }

  if (emailExist && !emailExist.confirm) {
    res
      .status(200)
      .json({
        message: `Email: ${email} is waiting for sign up. Check your email.`
      })
    return;
  }

  const newEmailInNewsletter = await Newsletter.create({
    email,
    confirm: false
  })

  if (!newEmailInNewsletter) {
    res
      .status(500)
      .json({
        message: 'Server error'
      })

    return;
  }

  sendMail(email, "Newsletter - sign up",
    `  <h3>Hello</h3>
  <div> We noticed you haven't completed the newsletter sign up process. Please
    <a href="${config.domaniAddress}/newsletter/confirm/${newEmailInNewsletter._id}">click here to confirm your email address</a> and you'll start receiving newsletters from us.</div>
  <div><button><a href="${config.domaniAddress}/newsletter/confirm/${newEmailInNewsletter._id}">Confirm my email</a></button></div>
  <div> Thank you, </div>
  <h1>BooksShop</h1>
  `)

  res
    .status(200)
    .json({
      message: `Check your email and sign up for newsletter.`,
    })

}



// @desc get newsletter
// @route get /api/newsletter/confirm/:id
// @acces Pivate

export const confirmNewsletter = async (req, res) => {

  const newsletterId = String(req.params.id);

  if (!newsletterId) {
    res
      .status(400)
      .send('Error: Invalid id')
    return;
  }

  const newNewsletterUser = await Newsletter.findOne({
    _id: newsletterId
  });

  if (!newNewsletterUser) {
    res
      .status(400)
      .send('Error: Invalid id')
    return;
  }

  newNewsletterUser.confirm = true;
  await newNewsletterUser.save();

  res
    .status(200)
    .send('Thank You for confirming Your email address. ')
}

// @desc delete newsletter
// @route post /api/newsletter/:id
// @acces Pivate

export const removeUserFromNewsletter = async (req, res) => {

  const newsletterId = String(req.params.id);

  if (!newsletterId) {
    res
      .status(400)
      .json({
        message: 'Invalid id'
      })
    return;
  }

  const existedNewsletter = await Newsletter.findOne({ _id: newsletterId })

  if (!existedNewsletter) {
    res
      .status(400)
      .json({
        message: 'Email not found'
      })
    return;
  }

  await Newsletter.deleteOne({
    _id: newsletterId
  });

  res
    .status(200)
    .json({
      message: `Email: ${existedNewsletter.email} was removed from newsletter`,
    })
}
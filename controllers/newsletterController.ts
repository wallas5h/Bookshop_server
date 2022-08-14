

// @desc get newsletter
// @route get /api/newsletter
// @acces Pivate

import { Newsletter } from "../models/newsletterModel";

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
  })

  if (emailExist) {
    res
      .status(200)
      .json({
        message: 'That email address already exists'
      })
    return;
  }

  const newEmailInNewsletter = await Newsletter.create({
    email,
  })

  if (!newEmailInNewsletter) {
    res
      .status(500)
      .json({
        message: 'Server error'
      })

    return;
  }

  // @TODO send email to new newsletter user

  res
    .status(200)
    .json({
      message: `Email: ${email} added to newsletter`,
    })

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
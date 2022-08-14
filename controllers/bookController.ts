
import { Response } from "express"
import { Book } from "../models/bookModel"





// @desc get books
// @route get /api/book
// @acces Pivate

export const getBooks = async (req, res) => {
  const books = await Book.find({})

  res
    .status(200)
    .json(books)
}

// @desc get books
// @route get /api/book/search/querystrings
// @acces Pivate

export const searchBooks = async (req, res) => {

  const searchPhrase = String(req.query.phrase);
  const currentPage = Number(req.query.currentPage);
  const perPage = Number(req.query.perPage);

  const maxPerPage = perPage;

  const books = await Book.find({
    $or: [
      {
        title: { $regex: '.*' + searchPhrase + '.*' },
        active: true,
      },
      {
        author: { $regex: '.*' + searchPhrase + '.*' },
        active: true,
      },
    ]
  })
    .skip(maxPerPage * (currentPage - 1))
  // .limit(8)

  const count = await Book.find({
    $or: [
      {
        title: { $regex: '.*' + searchPhrase + '.*' },
        active: true,
      },
      {
        author: { $regex: '.*' + searchPhrase + '.*' },
        active: true,
      },
    ]
  }).count()

  const totalPages = Math.ceil(count / maxPerPage);

  res
    .status(200)
    .json({
      books,
      currentPage,
      totalPages,
      count,
    })
}

// @desc feature books
// @route get /api/book/feature
// @acces Pivate

export const featureBooks = async (req, res) => {
  const books = await Book.find({
    count: { $gt: 0 },
    active: true,
  }).sort({ newPrice: 1 }).limit(10)

  res
    .status(200)
    .json(books)
}

// @desc feature books
// @route get /api/book/:id
// @acces Pivate

export const findBookById = async (req, res) => {
  const id = req.params.id
  const book = await Book.find({
    _id: id
  })

  res
    .status(200)
    .json(book)
}

// @desc set book
// @route post /api/book
// @acces Pivate

export const setBook = async (req, res) => {

  const { title, category, author, description, newPrice, oldPrice, count, active, imageURL } = req.body

  // if (!req.body.text) {
  //   res.status(400)
  //   throw new ValidationError('Please add a text field')
  // }

  const book = await Book.create({
    title, category, author, description, newPrice, oldPrice, imageURL, count, active,
  })

  res
    .status(200)
    .json(book)
}

// @desc update goals
// @route put /api/book/:id
// @acces Pivate

export const updateBook = async (req, res: Response) => {

  const book = await Book.findById(req.params.id)

  if (!book) {
    res
      .status(200)
    throw new Error('Goal not found')
  }

  // const user = await User.findById(req.user.id)

  // // Check for user
  // if (!user) {
  //   res.status(401);
  //   throw new Error('user not found');
  // }

  // // Make sure the logged in user matches the goal user
  // if (goal.user.toString() !== user.id) {
  //   res.status(401);
  //   throw new Error('user not authorized');
  // }

  const updatedGoal = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true })

  res
    .status(200)
    .json(updatedGoal)
}

// @desc delet goals
// @route delete /api/book/:id
// @acces Pivate

export const deleteBook = async (req, res) => {

  const book = await Book.findById(req.params.id)

  if (!book) {
    res
      .status(200)
    throw new Error('Goal not found')
  }

  // const user = await User.findById(req.user.id)

  // // Check for user
  // if (!user) {
  //   res.status(401);
  //   throw new Error('user not found');
  // }

  // // Make sure the logged in user matches the goal user
  // if (goal.user.toString() !== user.id) {
  //   res.status(401);
  //   throw new Error('user not authorized');
  // }

  await Book.findByIdAndRemove(req.params.id)

  res
    .status(200)
    .json({
      id: req.params.id
    })
}
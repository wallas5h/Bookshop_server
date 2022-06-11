



// @desc get goals
// @route get /api/goals
// @acces Pivate

import { Goal } from "../models/goalModel"
import { ValidationError } from "../utils/errors"

export const getGoals = async (req, res) => {
  const goals = await Goal.find()

  res
    .status(200)
    .json(goals)
}

// @desc set goals
// @route post /api/goals
// @acces Pivate

export const setGoals = async (req, res) => {

  if (!req.body.text) {
    res.status(400)
    throw new ValidationError('Please add a text field')
  }

  const goal = await Goal.create({
    text: req.body.text
  })

  res
    .status(200)
    .json(goal)
}

// @desc update goals
// @route put /api/goals/:id
// @acces Pivate

export const updateGoals = async (req, res) => {

  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res
      .status(200)
    throw new Error('Goal not found')
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true })

  res
    .status(200)
    .json(updatedGoal)
}

// @desc delet goals
// @route delete /api/goals/:id
// @acces Pivate

export const deleteGoals = async (req, res) => {

  const goal = await Goal.findById(req.params.id)

  if (!goal) {
    res
      .status(200)
    throw new Error('Goal not found')
  }

  await Goal.findByIdAndRemove(req.params.id)

  res
    .status(200)
    .json({
      id: req.params.id
    })
}
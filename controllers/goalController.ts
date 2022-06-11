// @desc get goals

export const getGoals = async (req, res) => {
  res
    .status(200)
    .json({
      message: "get goal"
    })
}

// @desc set goals
// @route post /api/goals
// @acces Pivate

export const setGoals = async (req, res) => {

  res
    .status(200)
    .json({
      message: "set goal"
    })
}

// @desc update goals
// @route put /api/goals/:id
// @acces Pivate

export const updateGoals = async (req, res) => {
  res
    .status(200)
    .json({
      message: `update goal ${req.params.id}`
    })
}

// @desc delet goals
// @route delete /api/goals/:id
// @acces Pivate

export const deleteGoals = async (req, res) => {
  res
    .status(200)
    .json({
      message: `delete goal ${req.params.id}`
    })
}
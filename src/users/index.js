import express from "express"
import createError from "http-errors"
import UsersModel from "./model.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body)
    const { _id } = await newUser.save()
    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/", async (req, res, next) => {
  try {
    const resources = await UsersModel.find({})
    res.send(resources)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const resource = await UsersModel.findById(req.params.id)
    if (resource) {
      res.send(resource)
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedResource = await UsersModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (updatedResource) {
      res.send(updatedResource)
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedResource = await UsersModel.findByIdAndDelete(req.params.id)
    if (deletedResource) {
      res.status(204).send()
    } else {
      next(createError(404, `User with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter

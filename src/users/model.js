import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { Schema, model } = mongoose

const UsersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

// BEFORE saving the user in db, I'd like to execute the following code
UsersSchema.pre("save", async function () {
  // This code will be automagically executed BEFORE saving
  // Here I am not using an arrow function as I normally do, because of the "this" keyword
  const newUserData = this // If I use arrow functions, "this" will be undefined, it contains the new user's data in case of normal functions

  if (newUserData.isModified("password")) {
    // I can save some precious CPU cycles if I execute hash function ONLY whenever the user is modifying his password (or if the user is being created)
    const plainPW = newUserData.password

    const hash = await bcrypt.hash(plainPW, 11)
    newUserData.password = hash
  }
})

UsersSchema.methods.toJSON = function () {
  // This .toJSON method is called EVERY TIME Express does a res.send(user/users)
  // This does mean that we could override the default behaviour of this method, by writing some code that removes passwords (and also some unnecessary things as well) from users
  const currentUserDocument = this
  const currentUser = currentUserDocument.toObject()
  delete currentUser.password
  delete currentUser.createdAt
  delete currentUser.updatedAt
  delete currentUser.__v
  return currentUser
}

export default model("user", UsersSchema)

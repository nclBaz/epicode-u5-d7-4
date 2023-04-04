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

export default model("user", UsersSchema)

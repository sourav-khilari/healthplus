import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  }, // Firebase UID
  email: {
    type: String,
    required: true,
    unique:true,
  }, // User email
  name: {
    type: String
  }, // User's name
  authMethod: {
    type: String,
    required: true
  }, // e.g., 'email/password', 'google'
  patient_id: {
    type: String,
    //unique: true
  }

}, {
  //add automatically createdAt and updatedAt
  timestamps: true
});

export const User = mongoose.model("User", userSchema)


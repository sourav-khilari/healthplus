import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    }, // Firebase UID
    email: {
      type: String,
      required: true,
    }, // User email
    name: {
      type: String,
    }, // User's name
    authMethod: {
      type: String,
      required: true,
    }, // e.g., 'email/password', 'google'
    patient_ids: {
      type: [String], // Array of verified patient IDs
      default: []
    },
    
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String, // To store the Firebase refresh token
    },
  },
  {
    //add automatically createdAt and updatedAt
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);

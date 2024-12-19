import mongoose, { Schema } from "mongoose";

const hospitalSchema = new Schema({})

export const User = mongoose.model("Hospital", hospitalSchema)
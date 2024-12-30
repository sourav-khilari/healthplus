import mongoose, { Schema } from "mongoose";


const DonationRequestSchema = new mongoose.Schema(
    {
      donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user who donated blood
      bloodGroup: { type: String, required: true }, // Blood group
      phone: { type: String, required: true }, // Contact number of the donor
      address: { type: String, required: true }, // Address of the donor
      status: {
        type: String,
        enum: ["pending", "read", "cancelled"],
        default: "pending",
      }, // Status of the request
      readByHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Hospital that marked it as read
    },
    { timestamps: true }
  );
  
const DonationRequest = mongoose.model("DonationRequest", DonationRequestSchema);

export{
    DonationRequest,
}
  
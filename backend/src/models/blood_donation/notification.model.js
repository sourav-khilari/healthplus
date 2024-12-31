const NotificationSchema = new mongoose.Schema(
    {
        recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message: { type: String, required: true },
        link: { type: String }, // Link to view the request
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const NotificationBlood = mongoose.model("NotificationBlood", NotificationSchema);

export {
    NotificationBlood,
}
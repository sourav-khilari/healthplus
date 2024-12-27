import mongoose from mongoose

const NotificationSchema = new mongoose.Schema(
    {
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User model
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false, // To track if the notification has been read
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export {
    Notification
}

import nodeMailer from "nodemailer"
import { asyncHandler } from "./asyncHandler.js";
import { ApiError } from "./ApiError.js";


const sendEmail = asyncHandler(async ({ email, subject, message }) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      secure: true,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    console.log("\n\n"+process.env.SMTP_MAIL, process.env.SMTP_PASSWORD+"\n\n");
    const options = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(options);
    console.log("Email sent successfully:", info.response);

  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new ApiError(400, `Error sending email: ${error.message}`);
    //throw new Error(`Error sending email: ${error.message}`);
  }
});

export default sendEmail;

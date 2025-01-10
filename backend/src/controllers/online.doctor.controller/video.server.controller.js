import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { Hospital } from "../../models/hospital.model.js";
import { uploadOnCloudinary } from "../../utils/cloudnary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { admin } from "../../config/firebase.js";

import { Doctor } from "../../models/doctor.model.js";
import { calendar } from "../../config/googleCalendar.js";
import bcrypt from "bcrypt";
import sendEmail from "../../utils/sendEmail.js";

const onlinegenerateRandomPassword = (length = 12) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length)),
  ).join("");
};

// Doctor Registration
const onlineregisterDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    department,
    speciality,
    email,
    phone,
    availability,
    slotDuration,
  } = req.body;

  if (
    !name ||
    !department ||
    !speciality ||
    !email ||
    !availability ||
    !slotDuration
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided." });
  }

  // Check if doctor already exists
  const existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor) {
    return res
      .status(400)
      .json({ error: "A doctor with this email already exists." });
  }

  // Create a new doctor
  const newDoctor = await Doctor.create({
    name,
    department,
    speciality,
    email,
    phone,
    availability,
    slotDuration,
    isApproved: false, // Admin approval pending
    role: "online doctor",
  });

  res.status(201).json({
    message:
      "Doctor application submitted successfully. Awaiting admin approval.",
    doctor: newDoctor,
  });
});

// Fetch all unapproved doctors
const onlinegetUnapprovedDoctors = asyncHandler(async (req, res) => {
  const unapprovedDoctors = await Doctor.find({ isApproved: false });
  res.status(200).json({ doctors: unapprovedDoctors });
});

const onlineapproveDoctor = asyncHandler(async (req, res) => {
  const { doctorId } = req.body;

  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required." });
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found." });
  }

  if (doctor.isApproved) {
    return res.status(400).json({ error: "Doctor is already approved." });
  }

  // Generate credentials
  const password = generateRandomPassword(); // Custom function for random password
  const hashedPassword = await bcrypt.hash(password, 10);
  const firebaseUser = await admin.auth().createUser({
    email: doctor.email,
    password,
    displayName: doctor.name,
  });
  const calendarResponse = await calendar.calendars.insert({
    requestBody: {
      summary: `${name} - ${speciality}`,
      description: `Calendar for Dr. ${name} (${speciality})`,
    },
  });

  // hospital.firebaseUid = firebaseUser.uid;
  // Update doctor details
  doctor.password = hashedPassword;
  doctor.firebaseUid = firebaseUser.uid;
  (doctor.calendarId = calendarResponse.data.id), // Google Calendar ID
    (doctor.isApproved = true);
  await doctor.save();

  // Send email with credentials
  const message = `
        Congratulations! Your application has been approved.
        Here are your login credentials:
        Email: ${doctor.email}
        Password: ${password}
    `;
  await sendEmail(doctor.email, "Doctor Application Approved", message);

  res
    .status(200)
    .json({ message: "Doctor approved and notified successfully." });
});

const calculateFreeSlots = (availability, bookedSlots, slotDuration) => {
  const freeSlots = [];
  // const dayAvailability = availability.find((slot) => slot.day === new Date(date).getDay());
  // if (!dayAvailability) return [];
  availability.forEach(({ day, startTime, endTime }) => {
    const startHour = parseInt(startTime.split(":")[0]);
    const startMinute = parseInt(startTime.split(":")[1]);
    const endHour = parseInt(endTime.split(":")[0]);
    const endMinute = parseInt(endTime.split(":")[1]);

    // Generate all slots within the available time range
    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);

    const end = new Date();
    end.setHours(endHour, endMinute, 0, 0);

    while (current < end) {
      const slotStart = new Date(current);
      current.setMinutes(current.getMinutes() + slotDuration);
      const slotEnd = new Date(current);

      // Check if the slot overlaps with any booked slot
      const isBooked = bookedSlots.some((booked) => {
        const bookedStart = new Date(booked.start);
        const bookedEnd = new Date(booked.end);
        return (
          (slotStart >= bookedStart && slotStart < bookedEnd) ||
          (slotEnd > bookedStart && slotEnd <= bookedEnd)
        );
      });

      if (!isBooked) {
        freeSlots.push({ start: slotStart, end: slotEnd });
      }
    }
  });

  return freeSlots;
};

//get doctor
const onlinegetAvailableSlots = asyncHandler(async (req, res) => {
  const { doctorId, date } = req.params;
  console.log(doctorId);
  console.log(date);
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found 1st" });

    // Fetch booked slots from Google Calendar
    //const calendar = await google.calendar('v3');
    const events = await calendar.events.list({
      calendarId: doctor.calendarId,
      timeMin: new Date(`${date}T00:00:00Z`).toISOString(),
      timeMax: new Date(`${date}T23:59:59Z`).toISOString(),
      singleEvents: true,
    });
    console.log("after event");
    const bookedSlots = events.data.items.map((event) => ({
      start: event.start.dateTime,
      end: event.end.dateTime,
    }));
    console.log("after event1");
    // Filter availability for the specific day
    const dayOfWeek = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });
    const availability = doctor.availability.filter(
      (slot) => slot.day === dayOfWeek,
    );

    // Calculate free slots
    const freeSlots = calculateFreeSlots(
      availability,
      bookedSlots,
      doctor.slotDuration,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { bookedSlots, freeSlots },
          "all free slots for particular doctor",
        ),
      );
  } catch (error) {
    //res.status(500).json({ error: `Failed to fetch slots: ${error.message}` });
    throw new ApiError(500, "Failed to fetch slots", error.message);
  }
});

const onlinecheckAvailability = async (doctorId, date, timeSlot) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new Error("Doctor not found");

  // Ensure time slot falls within availability
  const availability = doctor.availability.find(
    (day) =>
      day.day ===
      new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
  );
  if (!availability) return false;

  const slotStart = new Date(timeSlot.start).getTime();
  const availabilityStart = new Date(availability.startTime).getTime();
  const availabilityEnd = new Date(availability.endTime).getTime();

  if (slotStart < availabilityStart || slotStart >= availabilityEnd)
    return false;

  // Ensure time slot is not already booked
  const appointments = await Appointment.find({
    doctorId,
    date,
    $or: [
      { "timeSlot.start": { $lte: timeSlot.end } },
      { "timeSlot.end": { $gte: timeSlot.start } },
    ],
  });
  return appointments.length === 0;
};

//timeslot format that i send in frontend
// "timeSlot": {
//     "start": "2024-12-23T10:00:00.000Z",
//     "end": "2024-12-23T11:00:00.000Z"
//}

let generatedStrings = new Set();
function isUnique(str) {
  if (generatedStrings.has(str)) {
    return false;
  } else {
    generatedStrings.add(str);
    return true;
  }
}

function generateUniqueString(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";
  do {
    uniqueString = "";
    for (let i = 0; i < length; i++) {
      uniqueString += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
  } while (!isUnique(uniqueString));
  return uniqueString;
}

const onlinebookAppointment = asyncHandler(async (req, res) => {
  const {
    patientName,
    patient_id,
    patientEmail,
    doctorId,
    hospitalId,
    date,
    timeSlot,
  } = req.body;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    // Check if doctor is available at the given time slot
    const isAvailable = await checkAvailability(doctorId, date, timeSlot);
    if (!isAvailable)
      return res
        .status(400)
        .json({ error: "Doctor is not available in given time slot" });

    // Create event in Google Calendar
    const event = {
      summary: `Appointment with ${patientName}`,
      description: `Patient Email: ${patientEmail}`,
      start: { dateTime: timeSlot.start, timeZone: "UTC" },
      end: { dateTime: timeSlot.end, timeZone: "UTC" },
    };
    const eventResponse = await calendar.events.insert({
      calendarId: doctor.calendarId,
      requestBody: event,
    });
    const userId = req.user._id;
    const video_id = generateUniqueString(8);
    // Save appointment in MongoDB
    const newAppointment = new Appointment({
      patientName,
      patientEmail,
      doctorId,
      patient_id,
      userId,
      date,
      video_id,
      timeSlot,
      calendarEventId: eventResponse.data.id,
    });
    await newAppointment.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { appointment: newAppointment },
          "Appointment booked successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Failed to book appointment: ", error.message);
  }
});

const onlineupdateAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { newDate, newTimeSlot } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor) throw new Error("Doctor not found");

    const isAvailable = await checkAvailability(
      doctor._id,
      newDate,
      newTimeSlot,
    );
    if (!isAvailable)
      return res
        .status(400)
        .json({ error: "Doctor is not available in given time slot" });

    // Update the event in Google Calendar
    const updatedEvent = await calendar.events.update({
      calendarId: doctor.calendarId,
      eventId: appointment.calendarEventId,
      requestBody: {
        start: { dateTime: newTimeSlot.start, timeZone: "UTC" },
        end: { dateTime: newTimeSlot.end, timeZone: "UTC" },
      },
    });

    // Update appointment in MongoDB
    appointment.date = newDate;
    appointment.timeSlot = newTimeSlot;
    await appointment.save();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          appointment,
          "Appointment rescheduled successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Failed to update appointment: ", error.message);
  }
});

const onlinedeleteAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error("Appointment not found");

    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor) throw new Error("Doctor not found");

    // Delete the event from Google Calendar
    await calendar.events.delete({
      calendarId: doctor.calendarId,
      eventId: appointment.calendarEventId,
    });

    // Mark as canceled or delete from MongoDB
    await Appointment.findByIdAndDelete(appointmentId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          appointment,
          "AppointmAppointment canceled successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, "Failed to cancel appointment: ", error.message);
  }
});

const onlinegetDoctorAppointments = asyncHandler(async (req, res) => {
  const doctorId = req.params?.doctorId; // Doctor ID from request params
  const currentTime = new Date();
  const next24Hours = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000);

  // Get today's date range (start and end)
  const todayStart = new Date(currentTime);
  todayStart.setHours(0, 0, 0, 0); // Midnight of the current day
  const todayEnd = new Date(currentTime);
  todayEnd.setHours(23, 59, 59, 999); // End of the current day

  try {
    // Fetch appointments for today
    const todayAppointments = await Appointment.find({
      doctorId,
      "timeSlot.start": {
        $gte: todayStart, // From midnight today
        $lte: todayEnd, // To end of today
      },
    })
      .populate("doctorId", "name speciality") // Optionally populate doctor details
      .sort({ "timeSlot.start": 1 }); // Sort by time

    // Fetch appointments for the next 24 hours
    const next24HourAppointments = await Appointment.find({
      doctorId,
      "timeSlot.start": {
        $gte: currentTime, // From current time
        $lte: next24Hours, // Up to 24 hours from now
      },
    })
      .populate("doctorId", "name department speciality") // Optionally populate doctor details
      .sort({ "timeSlot.start": 1 }); // Sort by time

    // Combine both results (avoid duplicates)
    const uniqueAppointments = [
      ...new Map(
        [...todayAppointments, ...next24HourAppointments].map((item) => [
          item._id.toString(),
          item,
        ]),
      ).values(),
    ];

    // Respond with combined appointments
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { appointments: uniqueAppointments },
          "Appointments fetched successfully.",
        ),
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch appointments."));
  }
});

const onlinegetUserAppointments = asyncHandler(async (req, res) => {
  // Check if the user is logged in (via req.user._id)
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. User not logged in." });
  }

  // Fetch appointments belonging to the user
  const appointments = await Appointment.find({ userId })
    .sort({ date: -1 }) // Sort by date, latest first
    .populate("doctorId", "name speciality"); // Include doctor's name and speciality
  res.status(200).json({
    message: "Appointments retrieved successfully.",
    appointments,
  });
});

// Function to check if the generated string is unique

const onlinegetVideoId = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params; // Appointment ID passed in the route params

  // Check if the appointment exists
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  // Generate a unique video ID
  const videoId = appointment.video_id;

  // Update the appointment with the new video ID
  // appointment.video_id = videoId;
  // await appointment.save();

  // Respond with the updated video ID
  res.status(200).json({ message: "Video ID updated successfully", videoId });
});

export {
  onlineregisterDoctor,
  onlinegetUnapprovedDoctors,
  onlineapproveDoctor,
  onlinegetAvailableSlots,
  onlinebookAppointment,
  onlineupdateAppointment,
  onlinedeleteAppointment,
  onlinegetDoctorAppointments,
  onlinegetUserAppointments,
  onlinegetVideoId,
};

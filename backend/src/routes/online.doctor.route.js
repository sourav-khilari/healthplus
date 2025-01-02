import {
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
} from "../controllers/online.doctor.controller/video.server.controller.js"

router.post("/onlineregisterDoctor", onlineregisterDoctor);
router.get("/onlinegetDoctorAppointments", roleMiddleware("online doctor"), onlinegetDoctorAppointments);
router.get("/onlinegetVideoId", roleMiddleware("online docctor"), onlinegetVideoId);
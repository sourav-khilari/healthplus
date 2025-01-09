import { DonationRequest } from "../../models/blood_donation/donation.request.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const submitBloodDonationRequest = asyncHandler(async (req, res) => {
    const { bloodGroup, phone, address } = req.body;
    const donorId = req.user._id;

    try {
        const donationRequest = new DonationRequest({
            donorId,
            bloodGroup,
            phone,
            address,
        });

        await donationRequest.save();

        res.status(201).send({
            success: true,
            message: "Blood donation request submitted successfully.",
            data: donationRequest,
        });
    } catch (error) {
        console.error("Error submitting blood donation request:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error.",
        });
    }
});


const getDonationRequestsForHospital = asyncHandler(async (req, res) => {
    try {
        const requests = await DonationRequest.find({ status: "pending" }).populate("donorId", "name email");

        res.status(200).send({
            success: true,
            data: requests,
        });
    } catch (error) {
        console.error("Error fetching donation requests:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error.",
        });
    }
});


const markRequestAsRead = asyncHandler(async (req, res) => {
    //decide based on frontend
    //const { requestId } = req.params;
    //requestId=_id
    const { requestId } = req.body;
    const hospitalId = req.user._id; // Assuming the user is a hospital

    try {
        const request = await DonationRequest.findById(requestId);

        if (!request || request.status !== "pending") {
            return res.status(400).send({
                success: false,
                message: "Request not found or already processed.",
            });
        }

        request.status = "read";
        request.readByHospitalId = hospitalId;

        await request.save();

        res.status(200).send({
            success: true,
            message: "Request marked as read.",
        });
    } catch (error) {
        console.error("Error marking request as read:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error.",
        });
    }
});

const declineDonationRequest = asyncHandler(async (req, res) => {
    //decide based on frontend
    //const { requestId } = req.params;
    //requestId=_id
    const { requestId } = req.body;
    const hospitalId = req.user._id; // Assuming the user is a hospital

    try {
        const request = await DonationRequest.findById(requestId);

        if (!request || request.status !== "pending") {
            return res.status(400).send({
                success: false,
                message: "Request not found or already processed.",
            });
        }

        request.status = "cancelled";
        request.readByHospitalId = hospitalId;

        await request.save();

        res.status(200).send({
            success: true,
            message: "Request marked as read.",
        });
    } catch (error) {
        console.error("Error marking request as read:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error.",
        });
    }
});


const cancelDonationRequest = asyncHandler(async (req, res) => {
    //decide based on frontend
    //const { requestId } = req.params;
    const { requestId } = req.body;
    const donorId = req.user._id;

    try {
        const request = await DonationRequest.findById(requestId);

        if (!request || request.donorId.toString() !== donorId || request.status !== "pending") {
            return res.status(400).send({
                success: false,
                message: "Request not found or cannot be cancelled.",
            });
        }

        request.status = "cancelled";

        await request.save();

        res.status(200).send({
            success: true,
            message: "Donation request cancelled successfully.",
        });
    } catch (error) {
        console.error("Error cancelling donation request:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error.",
        });
    }
});


const getUserDonationRequests = asyncHandler(async (req, res) => {
    const donorId = req.user._id; // Assuming `req.user` contains the logged-in user's details

    try {
        const donationRequests = await DonationRequest.find({ donorId })
            .sort({ createdAt: -1 }) // Sort by the most recent requests
            .select("bloodGroup phone address status createdAt"); // Select only relevant fields

        if (donationRequests.length === 0) {
            return res.status(200).send({
                success: true,
                message: "You have not made any donation requests yet.",
                data: [],
            });
        }


        res.status(200).send({
            success: true,
            data: {
                donationRequests,
                user: req.user
            }
        });

    } catch (error) {
        console.error("Error fetching user's donation requests:", error);
        res.status(500).send({
            success: false,
            message: "Internal server error. Could not fetch donation requests.",
        });
    }
});


export {
    submitBloodDonationRequest,
    getDonationRequestsForHospital,
    markRequestAsRead,
    cancelDonationRequest,
    getUserDonationRequests,
    declineDonationRequest,
}
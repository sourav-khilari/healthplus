import ApprovedHospitals from "./ApprovedHospitals.jsx";
import PendingHospitals from "./PendingHospitals.jsx";
import RejectedHospitals from "./RejectedHospitals.jsx";
import "../../styles/Common.css"
const HospitalManagement = () => {
  return (
    <div>
      <h2>Hospital Management</h2>
      <PendingHospitals />
      <ApprovedHospitals />
      <RejectedHospitals />
    </div>
  );
};

export default HospitalManagement;

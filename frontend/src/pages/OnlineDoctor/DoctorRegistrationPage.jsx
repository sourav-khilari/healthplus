import  { useState } from "react";
import axios from "axios";

const DoctorRegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    speciality: "",
    email: "",
    phone: "",
    availability: "",
    slotDuration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/v1/onlineregisterDoctor", formData);
      alert(response.data.message);
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="speciality"
        placeholder="Speciality"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="availability"
        placeholder="Availability"
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="slotDuration"
        placeholder="Slot Duration"
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default DoctorRegistrationPage;

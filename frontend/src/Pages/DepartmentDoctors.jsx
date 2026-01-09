import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const DepartmentDoctors = () => {
    const { departmentName } = useParams();
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:4000/api/v1/user/doctors",
                    { withCredentials: true }
                );

                // Filter doctors by department
                const filteredDoctors = data.doctors.filter(
                    (doctor) => doctor.doctorDepartment === departmentName
                );

                setDoctors(filteredDoctors);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch doctors");
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [departmentName]);

    const handleBackToHome = () => {
        // Use direct window navigation for reliability
        window.location.href = "/";
    };

    if (loading) {
        return (
            <div className="department-doctors-container">
                <div className="loading">Loading doctors...</div>
            </div>
        );
    }

    return (
        <div className="department-doctors-container">
            <div className="department-doctors-header">
                <button onClick={handleBackToHome} className="back-button">
                    ← Back to Home
                </button>
                <h1>{departmentName} Department</h1>
                <p className="doctor-count">
                    {doctors.length} {doctors.length === 1 ? "Doctor" : "Doctors"} Available
                </p>
            </div>

            {doctors.length === 0 ? (
                <div className="no-doctors-message">
                    <p>There are no doctors available in this department as of now.</p>
                </div>
            ) : (
                <div className="doctors-grid">
                    {doctors.map((doctor) => (
                        <div key={doctor._id} className="doctor-card">
                            <div className="doctor-avatar">
                                <img
                                    src={doctor.docAvatar?.url || "/default-avatar.png"}
                                    alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                                />
                            </div>
                            <div className="doctor-info">
                                <h3>
                                    Dr. {doctor.firstName} {doctor.lastName}
                                </h3>
                                <p className="doctor-department">{doctor.doctorDepartment}</p>
                                <button
                                    className="book-appointment-btn"
                                    onClick={() =>
                                        navigate(
                                            `/appointment?doctorId=${doctor._id}&department=${doctor.doctorDepartment}`
                                        )
                                    }
                                >
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DepartmentDoctors;

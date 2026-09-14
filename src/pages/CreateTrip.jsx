import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        destination: "",
        startDate: "",
        endDate: "",
        travelers: 1,
        budget: "",
    });

    const [error, setError] = useState("");

    // Handle input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    // Submit form
    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation
        if (!formData.title.trim()) {
            setError("Please enter a trip name.");
            return;
        }

        if (!formData.destination.trim()) {
            setError("Please enter a destination.");
            return;
        }

        if (!formData.startDate) {
            setError("Please select a start date.");
            return;
        }

        if (!formData.endDate) {
            setError("Please select an end date.");
            return;
        }

        if (
            new Date(formData.endDate) <
            new Date(formData.startDate)
        ) {
            setError("End date cannot be before start date.");
            return;
        }

        if (Number(formData.travelers) < 1) {
            setError("Number of travelers must be at least 1.");
            return;
        }

        // Create trip object
        const newTrip = {
            id: Date.now().toString(),

            title: formData.title.trim(),

            destination: formData.destination.trim(),

            startDate: formData.startDate,

            endDate: formData.endDate,

            travelers: Number(formData.travelers),

            budget: formData.budget
                ? Number(formData.budget)
                : 0,

            createdAt: new Date().toISOString(),

            activities: [],
        };

        // Get existing trips
        const existingTrips =
            JSON.parse(
                localStorage.getItem("tripnest_trips")
            ) || [];

        // Add new trip
        const updatedTrips = [
            ...existingTrips,
            newTrip,
        ];

        // Save trips
        localStorage.setItem(
            "tripnest_trips",
            JSON.stringify(updatedTrips)
        );

        // Save the newly selected trip
        localStorage.setItem(
            "tripnest_current_trip",
            JSON.stringify(newTrip)
        );

        // Navigate to My Trips
        navigate("/trips");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "30px 20px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <div
                style={{
                    maxWidth: "700px",
                    margin: "0 auto",
                }}
            >
                {/* Back button */}
                <button
                    onClick={() => navigate("/trips")}
                    style={{
                        border: "none",
                        background: "transparent",
                        color: "#2563eb",
                        cursor: "pointer",
                        fontSize: "15px",
                        marginBottom: "20px",
                    }}
                >
                    ← Back to My Trips
                </button>

                {/* Form container */}
                <div
                    style={{
                        background: "white",
                        borderRadius: "18px",
                        padding: "35px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                    }}
                >
                    <div style={{ marginBottom: "28px" }}>
                        <h1
                            style={{
                                margin: 0,
                                color: "#172033",
                                fontSize: "30px",
                            }}
                        >
                            Create New Trip
                        </h1>

                        <p
                            style={{
                                color: "#6b7280",
                                marginTop: "8px",
                            }}
                        >
                            Enter your trip details and start creating your
                            itinerary.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            style={{
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                color: "#b91c1c",
                                padding: "12px",
                                borderRadius: "8px",
                                marginBottom: "20px",
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Trip name */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontWeight: "600",
                                    color: "#374151",
                                }}
                            >
                                Trip Name
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Example: Goa Vacation"
                                style={inputStyle}
                            />
                        </div>

                        {/* Destination */}
                        <div style={{ marginBottom: "20px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "7px",
                                    fontWeight: "600",
                                    color: "#374151",
                                }}
                            >
                                Destination
                            </label>

                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                placeholder="Example: Goa"
                                style={inputStyle}
                            />
                        </div>

                        {/* Dates */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "18px",
                                marginBottom: "20px",
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        fontWeight: "600",
                                        color: "#374151",
                                    }}
                                >
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        fontWeight: "600",
                                        color: "#374151",
                                    }}
                                >
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Travelers and budget */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "18px",
                                marginBottom: "30px",
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        fontWeight: "600",
                                        color: "#374151",
                                    }}
                                >
                                    Number of Travelers
                                </label>

                                <input
                                    type="number"
                                    name="travelers"
                                    min="1"
                                    value={formData.travelers}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        marginBottom: "7px",
                                        fontWeight: "600",
                                        color: "#374151",
                                    }}
                                >
                                    Budget (₹)
                                </label>

                                <input
                                    type="number"
                                    name="budget"
                                    min="0"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="Example: 30000"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            style={{
                                width: "100%",
                                border: "none",
                                background:
                                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                                color: "white",
                                padding: "14px",
                                borderRadius: "10px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: "pointer",
                            }}
                        >
                            Create Trip →
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    background: "white",
};

export default CreateTrip;
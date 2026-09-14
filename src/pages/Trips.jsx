import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Trips() {
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);

    // Load trips from localStorage
    useEffect(() => {
        const savedTrips = localStorage.getItem("tripnest_trips");

        if (savedTrips) {
            setTrips(JSON.parse(savedTrips));
        }
    }, []);

    // Delete a trip
    const deleteTrip = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (!confirmed) return;

        const updatedTrips = trips.filter((trip) => trip.id !== id);

        setTrips(updatedTrips);
        localStorage.setItem("tripnest_trips", JSON.stringify(updatedTrips));
    };

    // Calculate number of days
    const calculateDays = (startDate, endDate) => {
        if (!startDate || !endDate) return 0;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const difference = end - start;

        return Math.ceil(difference / (1000 * 60 * 60 * 24)) + 1;
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "30px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            {/* Header */}
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                }}
            >
                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "32px",
                            color: "#172033",
                        }}
                    >
                        My Trips
                    </h1>

                    <p
                        style={{
                            color: "#6b7280",
                            marginTop: "8px",
                        }}
                    >
                        Create and manage your travel itineraries
                    </p>
                </div>

                <Link
                    to="/create-trip"
                    style={{
                        textDecoration: "none",
                        background: "#2563eb",
                        color: "white",
                        padding: "13px 20px",
                        borderRadius: "10px",
                        fontWeight: "600",
                        display: "inline-block",
                    }}
                >
                    + Create New Trip
                </Link>
            </div>

            {/* Main content */}
            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                {trips.length === 0 ? (
                    // Empty state
                    <div
                        style={{
                            background: "white",
                            borderRadius: "16px",
                            padding: "70px 30px",
                            textAlign: "center",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "60px",
                                marginBottom: "15px",
                            }}
                        >
                            ✈️
                        </div>

                        <h2
                            style={{
                                color: "#172033",
                                marginBottom: "10px",
                            }}
                        >
                            No trips yet
                        </h2>

                        <p
                            style={{
                                color: "#6b7280",
                                marginBottom: "25px",
                            }}
                        >
                            Start planning your next adventure.
                        </p>

                        <Link
                            to="/create-trip"
                            style={{
                                textDecoration: "none",
                                background: "#2563eb",
                                color: "white",
                                padding: "12px 22px",
                                borderRadius: "9px",
                                fontWeight: "600",
                            }}
                        >
                            Create Your First Trip
                        </Link>
                    </div>
                ) : (
                    // Trip cards
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "22px",
                        }}
                    >
                        {trips.map((trip) => {
                            const days = calculateDays(
                                trip.startDate,
                                trip.endDate
                            );

                            return (
                                <div
                                    key={trip.id}
                                    style={{
                                        background: "white",
                                        borderRadius: "16px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
                                    }}
                                >
                                    {/* Trip top section */}
                                    <div
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                                            color: "white",
                                            padding: "25px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "35px",
                                                marginBottom: "10px",
                                            }}
                                        >
                                            🌍
                                        </div>

                                        <h2
                                            style={{
                                                margin: 0,
                                                fontSize: "22px",
                                            }}
                                        >
                                            {trip.title}
                                        </h2>

                                        <p
                                            style={{
                                                marginTop: "8px",
                                                opacity: 0.9,
                                            }}
                                        >
                                            📍 {trip.destination}
                                        </p>
                                    </div>

                                    {/* Trip details */}
                                    <div style={{ padding: "22px" }}>
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                gap: "15px",
                                                marginBottom: "20px",
                                            }}
                                        >
                                            <div>
                                                <small
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Start Date
                                                </small>

                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    {formatDate(trip.startDate)}
                                                </div>
                                            </div>

                                            <div>
                                                <small
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    End Date
                                                </small>

                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    {formatDate(trip.endDate)}
                                                </div>
                                            </div>

                                            <div>
                                                <small
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Duration
                                                </small>

                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    {days} {days === 1 ? "Day" : "Days"}
                                                </div>
                                            </div>

                                            <div>
                                                <small
                                                    style={{
                                                        color: "#6b7280",
                                                    }}
                                                >
                                                    Travelers
                                                </small>

                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                        marginTop: "4px",
                                                    }}
                                                >
                                                    {trip.travelers}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Budget */}
                                        {trip.budget && (
                                            <div
                                                style={{
                                                    background: "#f0fdf4",
                                                    padding: "10px 12px",
                                                    borderRadius: "8px",
                                                    marginBottom: "18px",
                                                    color: "#166534",
                                                }}
                                            >
                                                💰 Budget: ₹{Number(trip.budget).toLocaleString("en-IN")}
                                            </div>
                                        )}

                                        {/* Buttons */}
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "10px",
                                            }}
                                        >
                                            <button
                                                onClick={() =>
                                                    navigate(`/trips/${trip.id}/itinerary`)
                                                }
                                                style={{
                                                    flex: 1,
                                                    border: "none",
                                                    background: "#2563eb",
                                                    color: "white",
                                                    padding: "11px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontWeight: "600",
                                                }}
                                            >
                                                View Itinerary
                                            </button>

                                            <button
                                                onClick={() => deleteTrip(trip.id)}
                                                style={{
                                                    border: "1px solid #ef4444",
                                                    background: "white",
                                                    color: "#ef4444",
                                                    padding: "11px 14px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Trips;
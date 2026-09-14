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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

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

        const existingTrips =
            JSON.parse(
                localStorage.getItem("tripnest_trips")
            ) || [];

        const updatedTrips = [
            ...existingTrips,
            newTrip,
        ];

        localStorage.setItem(
            "tripnest_trips",
            JSON.stringify(updatedTrips)
        );

        localStorage.setItem(
            "tripnest_current_trip",
            JSON.stringify(newTrip)
        );

        navigate("/trips");
    };

    const formatDate = (date) => {
        if (!date) return "Not selected";

        const d = new Date(date);

        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const calculateDays = () => {
        if (!formData.startDate || !formData.endDate) {
            return "--";
        }

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        const difference =
            Math.ceil(
                (end - start) /
                (1000 * 60 * 60 * 24)
            ) + 1;

        return difference > 0 ? difference : "--";
    };

    const pageStyle = {
        minHeight: "100vh",
        width: "100%",
        background:
            "linear-gradient(135deg, #eef4ff 0%, #f8faff 45%, #eef2ff 100%)",
        fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#172033",
        padding: "28px 24px 50px",
        boxSizing: "border-box",
    };

    const containerStyle = {
        width: "100%",
        maxWidth: "1180px",
        margin: "0 auto",
    };

    const inputStyle = {
        width: "100%",
        height: "54px",
        border: "1px solid #dbe2ea",
        borderRadius: "14px",
        padding: "0 16px 0 48px",
        fontSize: "15px",
        color: "#172033",
        background: "#ffffff",
        outline: "none",
        boxSizing: "border-box",
        transition: "all 0.2s ease",
    };

    const labelStyle = {
        display: "block",
        fontSize: "13px",
        fontWeight: "700",
        color: "#263449",
        marginBottom: "8px",
    };

    return (
        <div style={pageStyle}>

            {/* Decorative background circles */}
            <div
                style={{
                    position: "fixed",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background:
                        "rgba(79, 70, 229, 0.08)",
                    top: "-100px",
                    left: "-100px",
                    pointerEvents: "none",
                }}
            />

            <div
                style={{
                    position: "fixed",
                    width: "360px",
                    height: "360px",
                    borderRadius: "50%",
                    background:
                        "rgba(37, 99, 235, 0.06)",
                    right: "-130px",
                    bottom: "-130px",
                    pointerEvents: "none",
                }}
            />

            <div style={containerStyle}>

                {/* =========================
                    TOP NAVIGATION
                ========================= */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "28px",
                    }}
                >

                    {/* Brand */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "11px",
                        }}
                    >
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "13px",
                                background:
                                    "linear-gradient(135deg, #2563eb, #4f46e5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "21px",
                                boxShadow:
                                    "0 10px 25px rgba(37,99,235,0.25)",
                            }}
                        >
                            ✈
                        </div>

                        <div>
                            <div
                                style={{
                                    fontSize: "21px",
                                    fontWeight: "800",
                                    color: "#172033",
                                    lineHeight: "1",
                                }}
                            >
                                TripNest
                            </div>

                            <div
                                style={{
                                    fontSize: "11px",
                                    color: "#718096",
                                    marginTop: "4px",
                                }}
                            >
                                Your journey, beautifully planned
                            </div>
                        </div>
                    </div>

                    {/* Back button */}
                    <button
                        onClick={() => navigate("/trips")}
                        style={{
                            border: "1px solid #e1e7ef",
                            background: "rgba(255,255,255,0.85)",
                            color: "#334155",
                            padding: "11px 17px",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontWeight: "700",
                            cursor: "pointer",
                            boxShadow:
                                "0 5px 18px rgba(15,23,42,0.06)",
                        }}
                    >
                        ← My Trips
                    </button>
                </div>


                {/* =========================
                    MAIN CARD
                ========================= */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "minmax(350px, 0.95fr) minmax(450px, 1.05fr)",
                        background: "#ffffff",
                        borderRadius: "30px",
                        overflow: "hidden",
                        boxShadow:
                            "0 25px 80px rgba(30,41,59,0.14)",
                        border:
                            "1px solid rgba(226,232,240,0.8)",
                        position: "relative",
                        zIndex: 2,
                    }}
                >

                    {/* =========================
                        LEFT IMAGE SECTION
                    ========================= */}

                    <div
                        style={{
                            minHeight: "720px",
                            position: "relative",
                            overflow: "hidden",
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=90')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            alignItems: "flex-end",
                        }}
                    >

                        {/* Image overlay */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(180deg, rgba(15,23,42,0.05) 0%, rgba(15,23,42,0.18) 35%, rgba(15,23,42,0.92) 100%)",
                            }}
                        />

                        {/* Floating top badge */}
                        <div
                            style={{
                                position: "absolute",
                                top: "28px",
                                left: "28px",
                                padding: "9px 14px",
                                borderRadius: "30px",
                                background:
                                    "rgba(255,255,255,0.16)",
                                border:
                                    "1px solid rgba(255,255,255,0.25)",
                                backdropFilter: "blur(12px)",
                                color: "white",
                                fontSize: "11px",
                                fontWeight: "800",
                                letterSpacing: "0.7px",
                            }}
                        >
                            ✨ YOUR NEXT ADVENTURE
                        </div>

                        {/* Left content */}
                        <div
                            style={{
                                position: "relative",
                                zIndex: 2,
                                color: "white",
                                padding: "42px 38px",
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        >

                            <div
                                style={{
                                    fontSize: "13px",
                                    fontWeight: "700",
                                    letterSpacing: "1px",
                                    color:
                                        "rgba(255,255,255,0.75)",
                                    marginBottom: "12px",
                                }}
                            >
                                EXPLORE • DISCOVER • REMEMBER
                            </div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: "44px",
                                    lineHeight: "1.08",
                                    letterSpacing: "-1.7px",
                                    fontWeight: "800",
                                    maxWidth: "450px",
                                }}
                            >
                                Plan memories,
                                <br />
                                not just trips.
                            </h1>

                            <p
                                style={{
                                    margin:
                                        "18px 0 26px",
                                    fontSize: "15px",
                                    lineHeight: "1.7",
                                    color:
                                        "rgba(255,255,255,0.86)",
                                    maxWidth: "430px",
                                }}
                            >
                                Create your perfect journey,
                                organize every detail and
                                turn your travel ideas into
                                unforgettable experiences.
                            </p>


                            {/* Feature cards */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "11px",
                                    maxWidth: "440px",
                                }}
                            >

                                <div
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.13)",
                                        border:
                                            "1px solid rgba(255,255,255,0.16)",
                                        backdropFilter:
                                            "blur(12px)",
                                        borderRadius: "15px",
                                        padding: "13px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        🗺️
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "800",
                                        }}
                                    >
                                        Smart Planning
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "10px",
                                            marginTop: "3px",
                                            color:
                                                "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        Organize your journey
                                    </div>
                                </div>


                                <div
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.13)",
                                        border:
                                            "1px solid rgba(255,255,255,0.16)",
                                        backdropFilter:
                                            "blur(12px)",
                                        borderRadius: "15px",
                                        padding: "13px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        💰
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "800",
                                        }}
                                    >
                                        Budget Friendly
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "10px",
                                            marginTop: "3px",
                                            color:
                                                "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        Keep expenses in control
                                    </div>
                                </div>


                                <div
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.13)",
                                        border:
                                            "1px solid rgba(255,255,255,0.16)",
                                        backdropFilter:
                                            "blur(12px)",
                                        borderRadius: "15px",
                                        padding: "13px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        📅
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "800",
                                        }}
                                    >
                                        Easy Scheduling
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "10px",
                                            marginTop: "3px",
                                            color:
                                                "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        Plan every day
                                    </div>
                                </div>


                                <div
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.13)",
                                        border:
                                            "1px solid rgba(255,255,255,0.16)",
                                        backdropFilter:
                                            "blur(12px)",
                                        borderRadius: "15px",
                                        padding: "13px",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "20px",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        ❤️
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "800",
                                        }}
                                    >
                                        Great Memories
                                    </div>

                                    <div
                                        style={{
                                            fontSize: "10px",
                                            marginTop: "3px",
                                            color:
                                                "rgba(255,255,255,0.7)",
                                        }}
                                    >
                                        Enjoy the journey
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                    {/* =========================
                        RIGHT FORM SECTION
                    ========================= */}

                    <div
                        style={{
                            padding: "48px 46px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            background: "#ffffff",
                        }}
                    >

                        {/* Small heading */}
                        <div
                            style={{
                                color: "#4f46e5",
                                fontSize: "11px",
                                fontWeight: "800",
                                letterSpacing: "1.5px",
                                marginBottom: "10px",
                            }}
                        >
                            START YOUR JOURNEY
                        </div>

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "34px",
                                color: "#111827",
                                letterSpacing: "-1px",
                                lineHeight: "1.2",
                            }}
                        >
                            Create a new trip
                        </h2>

                        <p
                            style={{
                                margin:
                                    "10px 0 25px",
                                color: "#64748b",
                                fontSize: "14px",
                                lineHeight: "1.6",
                            }}
                        >
                            Add a few details and we'll
                            help you start planning your
                            perfect adventure.
                        </p>


                        {/* Error */}
                        {error && (
                            <div
                                style={{
                                    background: "#fff7ed",
                                    border:
                                        "1px solid #fed7aa",
                                    color: "#c2410c",
                                    borderRadius: "12px",
                                    padding: "12px 14px",
                                    marginBottom: "18px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                }}
                            >
                                ⚠️ {error}
                            </div>
                        )}


                        <form onSubmit={handleSubmit}>

                            {/* Trip name */}
                            <div
                                style={{
                                    marginBottom: "17px",
                                }}
                            >
                                <label style={labelStyle}>
                                    Trip Name *
                                </label>

                                <div
                                    style={{
                                        position: "relative",
                                    }}
                                >
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "17px",
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            fontSize: "18px",
                                            zIndex: 2,
                                        }}
                                    >
                                        ✨
                                    </span>

                                    <input
                                        style={inputStyle}
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Goa Weekend Escape"
                                    />
                                </div>
                            </div>


                            {/* Destination */}
                            <div
                                style={{
                                    marginBottom: "17px",
                                }}
                            >
                                <label style={labelStyle}>
                                    Destination *
                                </label>

                                <div
                                    style={{
                                        position: "relative",
                                    }}
                                >
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "17px",
                                            top: "50%",
                                            transform:
                                                "translateY(-50%)",
                                            fontSize: "18px",
                                            zIndex: 2,
                                        }}
                                    >
                                        📍
                                    </span>

                                    <input
                                        style={inputStyle}
                                        type="text"
                                        name="destination"
                                        value={
                                            formData.destination
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. Goa, India"
                                    />
                                </div>
                            </div>


                            {/* Date row */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "14px",
                                    marginBottom: "17px",
                                }}
                            >

                                <div>
                                    <label style={labelStyle}>
                                        Start Date *
                                    </label>

                                    <div
                                        style={{
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position:
                                                    "absolute",
                                                left: "17px",
                                                top: "50%",
                                                transform:
                                                    "translateY(-50%)",
                                                fontSize: "17px",
                                                zIndex: 2,
                                            }}
                                        >
                                            📅
                                        </span>

                                        <input
                                            style={{
                                                ...inputStyle,
                                                paddingLeft: "45px",
                                            }}
                                            type="date"
                                            name="startDate"
                                            value={
                                                formData.startDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>
                                </div>


                                <div>
                                    <label style={labelStyle}>
                                        End Date *
                                    </label>

                                    <div
                                        style={{
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position:
                                                    "absolute",
                                                left: "17px",
                                                top: "50%",
                                                transform:
                                                    "translateY(-50%)",
                                                fontSize: "17px",
                                                zIndex: 2,
                                            }}
                                        >
                                            📅
                                        </span>

                                        <input
                                            style={{
                                                ...inputStyle,
                                                paddingLeft: "45px",
                                            }}
                                            type="date"
                                            name="endDate"
                                            value={
                                                formData.endDate
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>
                                </div>

                            </div>


                            {/* Travelers + Budget */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "14px",
                                    marginBottom: "22px",
                                }}
                            >

                                <div>
                                    <label style={labelStyle}>
                                        Travelers
                                    </label>

                                    <div
                                        style={{
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position:
                                                    "absolute",
                                                left: "17px",
                                                top: "50%",
                                                transform:
                                                    "translateY(-50%)",
                                                fontSize: "18px",
                                                zIndex: 2,
                                            }}
                                        >
                                            👥
                                        </span>

                                        <input
                                            style={{
                                                ...inputStyle,
                                                paddingLeft: "48px",
                                            }}
                                            type="number"
                                            name="travelers"
                                            min="1"
                                            value={
                                                formData.travelers
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>
                                </div>


                                <div>
                                    <label style={labelStyle}>
                                        Budget (₹)
                                    </label>

                                    <div
                                        style={{
                                            position: "relative",
                                        }}
                                    >
                                        <span
                                            style={{
                                                position:
                                                    "absolute",
                                                left: "17px",
                                                top: "50%",
                                                transform:
                                                    "translateY(-50%)",
                                                fontSize: "18px",
                                                zIndex: 2,
                                            }}
                                        >
                                            💰
                                        </span>

                                        <input
                                            style={{
                                                ...inputStyle,
                                                paddingLeft: "48px",
                                            }}
                                            type="number"
                                            name="budget"
                                            min="0"
                                            value={
                                                formData.budget
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="30000"
                                        />
                                    </div>
                                </div>

                            </div>


                            {/* Live preview */}
                            <div
                                style={{
                                    background:
                                        "linear-gradient(135deg, #f8faff, #f1f5ff)",
                                    border:
                                        "1px solid #e3e9f5",
                                    borderRadius: "16px",
                                    padding: "15px",
                                    marginBottom: "20px",
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "10px",
                                        color: "#6366f1",
                                        fontWeight: "800",
                                        letterSpacing:
                                            "1px",
                                        marginBottom:
                                            "9px",
                                    }}
                                >
                                    TRIP PREVIEW
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: "11px",
                                    }}
                                >

                                    <div
                                        style={{
                                            width: "42px",
                                            height: "42px",
                                            borderRadius: "12px",
                                            background:
                                                "linear-gradient(135deg, #2563eb, #4f46e5)",
                                            color: "white",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            fontSize: "19px",
                                        }}
                                    >
                                        ✈
                                    </div>

                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "14px",
                                                fontWeight:
                                                    "800",
                                                color:
                                                    "#172033",
                                                whiteSpace:
                                                    "nowrap",
                                                overflow:
                                                    "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                            }}
                                        >
                                            {formData.title ||
                                                "Your trip name"}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "11px",
                                                color:
                                                    "#718096",
                                                marginTop:
                                                    "3px",
                                            }}
                                        >
                                            {formData.destination ||
                                                "Your destination"}
                                        </div>
                                    </div>

                                    <div
                                        style={{
                                            textAlign:
                                                "right",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "15px",
                                                fontWeight:
                                                    "800",
                                                color:
                                                    "#172033",
                                            }}
                                        >
                                            {calculateDays()}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: "10px",
                                                color:
                                                    "#718096",
                                            }}
                                        >
                                            days
                                        </div>
                                    </div>

                                </div>

                            </div>


                            {/* Submit */}
                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    height: "56px",
                                    border: "none",
                                    borderRadius: "14px",
                                    background:
                                        "linear-gradient(135deg, #2563eb, #4f46e5)",
                                    color: "white",
                                    fontSize: "15px",
                                    fontWeight: "800",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 12px 25px rgba(37,99,235,0.25)",
                                    transition:
                                        "transform 0.2s ease, box-shadow 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 16px 30px rgba(37,99,235,0.32)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 12px 25px rgba(37,99,235,0.25)";
                                }}
                            >
                                Create Trip & Start Planning
                                <span
                                    style={{
                                        marginLeft: "8px",
                                        fontSize: "17px",
                                    }}
                                >
                                    →
                                </span>
                            </button>

                        </form>


                        {/* Bottom note */}
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "17px",
                                fontSize: "11px",
                                color: "#94a3b8",
                            }}
                        >
                            🔒 Your trip details are saved securely
                            in your TripNest account.
                        </div>

                    </div>

                </div>


                {/* =========================
                    BOTTOM INFO
                ========================= */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "28px",
                        flexWrap: "wrap",
                        marginTop: "25px",
                        color: "#64748b",
                        fontSize: "11px",
                    }}
                >
                    <span>🌍 Discover destinations</span>
                    <span>📋 Build itineraries</span>
                    <span>💰 Manage your budget</span>
                    <span>❤️ Enjoy the journey</span>
                </div>

            </div>


            {/* =========================
                RESPONSIVE CSS
            ========================= */}

            <style>
                {`
                    @media (max-width: 900px) {
                        .trip-create-main {
                            grid-template-columns: 1fr !important;
                        }
                    }

                    @media (max-width: 900px) {
                        .trip-create-main > div:first-child {
                            min-height: 500px !important;
                        }
                    }

                    @media (max-width: 600px) {
                        body {
                            overflow-x: hidden;
                        }
                    }
                `}
            </style>

        </div>
    );
}

export default CreateTrip;
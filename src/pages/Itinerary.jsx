import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Itinerary() {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const [trip, setTrip] = useState(null);
    const [activities, setActivities] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        category: "Sightseeing",
        description: "",
        estimatedCost: "",
    });

    const [error, setError] = useState("");

    // --------------------------------------------------
    // LOAD TRIP
    // --------------------------------------------------

    useEffect(() => {
        const savedTrips =
            JSON.parse(localStorage.getItem("tripnest_trips")) || [];

        const selectedTrip = savedTrips.find(
            (item) => item.id === tripId
        );

        if (selectedTrip) {
            setTrip(selectedTrip);
            setActivities(selectedTrip.activities || []);
        }
    }, [tripId]);

    // --------------------------------------------------
    // CALCULATE DAYS
    // --------------------------------------------------

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];

        let current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            dates.push(
                current.toISOString().split("T")[0]
            );

            current.setDate(current.getDate() + 1);
        }

        return dates;
    };

    // --------------------------------------------------
    // FORMAT DATE
    // --------------------------------------------------

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // --------------------------------------------------
    // FORMAT TIME
    // --------------------------------------------------

    const formatTime = (time) => {
        if (!time) return "";

        const [hour, minute] = time.split(":");

        const date = new Date();

        date.setHours(hour);
        date.setMinutes(minute);

        return date.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // --------------------------------------------------
    // HANDLE FORM CHANGE
    // --------------------------------------------------

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    // --------------------------------------------------
    // RESET FORM
    // --------------------------------------------------

    const resetForm = () => {
        setFormData({
            title: "",
            date: "",
            startTime: "",
            endTime: "",
            location: "",
            category: "Sightseeing",
            description: "",
            estimatedCost: "",
        });

        setEditingActivity(null);
        setShowForm(false);
        setError("");
    };

    // --------------------------------------------------
    // CHECK TIME CONFLICT
    // --------------------------------------------------

    const hasTimeConflict = () => {
        const newStart = formData.startTime;
        const newEnd = formData.endTime;

        return activities.some((activity) => {
            // Ignore the activity being edited
            if (
                editingActivity &&
                activity.id === editingActivity.id
            ) {
                return false;
            }

            // Only compare activities on same date
            if (activity.date !== formData.date) {
                return false;
            }

            // Time overlap condition
            return (
                newStart < activity.endTime &&
                newEnd > activity.startTime
            );
        });
    };

    // --------------------------------------------------
    // ADD / UPDATE ACTIVITY
    // --------------------------------------------------

    const handleSubmit = (event) => {
        event.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            setError("Please enter an activity name.");
            return;
        }

        if (!formData.date) {
            setError("Please select a date.");
            return;
        }

        if (!formData.startTime) {
            setError("Please select a start time.");
            return;
        }

        if (!formData.endTime) {
            setError("Please select an end time.");
            return;
        }

        if (formData.endTime <= formData.startTime) {
            setError(
                "End time must be later than start time."
            );
            return;
        }

        if (hasTimeConflict()) {
            setError(
                "Time conflict! Another activity is already scheduled during this time."
            );
            return;
        }

        // ------------------------------------------------
        // UPDATE ACTIVITY
        // ------------------------------------------------

        if (editingActivity) {
            const updatedActivities = activities.map(
                (activity) =>
                    activity.id === editingActivity.id
                        ? {
                            ...activity,
                            ...formData,
                            estimatedCost:
                                formData.estimatedCost
                                    ? Number(formData.estimatedCost)
                                    : 0,
                        }
                        : activity
            );

            saveActivities(updatedActivities);

            resetForm();

            return;
        }

        // ------------------------------------------------
        // CREATE NEW ACTIVITY
        // ------------------------------------------------

        const newActivity = {
            id: Date.now().toString(),

            title: formData.title.trim(),

            date: formData.date,

            startTime: formData.startTime,

            endTime: formData.endTime,

            location: formData.location.trim(),

            category: formData.category,

            description: formData.description.trim(),

            estimatedCost: formData.estimatedCost
                ? Number(formData.estimatedCost)
                : 0,
        };

        const updatedActivities = [
            ...activities,
            newActivity,
        ];

        saveActivities(updatedActivities);

        resetForm();
    };

    // --------------------------------------------------
    // SAVE ACTIVITIES
    // --------------------------------------------------

    const saveActivities = (updatedActivities) => {
        setActivities(updatedActivities);

        const savedTrips =
            JSON.parse(
                localStorage.getItem("tripnest_trips")
            ) || [];

        const updatedTrips = savedTrips.map((item) => {
            if (item.id === tripId) {
                return {
                    ...item,
                    activities: updatedActivities,
                };
            }

            return item;
        });

        localStorage.setItem(
            "tripnest_trips",
            JSON.stringify(updatedTrips)
        );

        // Update current trip too
        const updatedTrip = updatedTrips.find(
            (item) => item.id === tripId
        );

        if (updatedTrip) {
            localStorage.setItem(
                "tripnest_current_trip",
                JSON.stringify(updatedTrip)
            );

            setTrip(updatedTrip);
        }
    };

    // --------------------------------------------------
    // DELETE ACTIVITY
    // --------------------------------------------------

    const deleteActivity = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this activity?"
        );

        if (!confirmed) return;

        const updatedActivities =
            activities.filter(
                (activity) => activity.id !== id
            );

        saveActivities(updatedActivities);
    };

    // --------------------------------------------------
    // EDIT ACTIVITY
    // --------------------------------------------------

    const editActivity = (activity) => {
        setEditingActivity(activity);

        setFormData({
            title: activity.title,
            date: activity.date,
            startTime: activity.startTime,
            endTime: activity.endTime,
            location: activity.location,
            category: activity.category,
            description: activity.description,
            estimatedCost:
                activity.estimatedCost || "",
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // --------------------------------------------------
    // MOVE ACTIVITY UP
    // --------------------------------------------------

    const moveActivityUp = (index) => {
        if (index === 0) return;

        const updated = [...activities];

        [updated[index - 1], updated[index]] = [
            updated[index],
            updated[index - 1],
        ];

        saveActivities(updated);
    };

    // --------------------------------------------------
    // MOVE ACTIVITY DOWN
    // --------------------------------------------------

    const moveActivityDown = (index) => {
        if (index === activities.length - 1) return;

        const updated = [...activities];

        [updated[index], updated[index + 1]] = [
            updated[index + 1],
            updated[index],
        ];

        saveActivities(updated);
    };

    // --------------------------------------------------
    // IF TRIP NOT FOUND
    // --------------------------------------------------

    if (!trip) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f5f7fb",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <h2>Trip not found</h2>

                    <button
                        onClick={() => navigate("/trips")}
                        style={primaryButton}
                    >
                        ← Back to My Trips
                    </button>
                </div>
            </div>
        );
    }

    const dates = getDatesBetween(
        trip.startDate,
        trip.endDate
    );

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
                    maxWidth: "1100px",
                    margin: "0 auto",
                }}
            >
                {/* BACK BUTTON */}

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

                {/* TRIP HEADER */}

                <div
                    style={{
                        background:
                            "linear-gradient(135deg, #2563eb, #4f46e5)",
                        color: "white",
                        padding: "30px",
                        borderRadius: "16px",
                        marginBottom: "25px",
                    }}
                >
                    <div style={{ fontSize: "40px" }}>
                        🌍
                    </div>

                    <h1
                        style={{
                            margin: "8px 0",
                            fontSize: "32px",
                        }}
                    >
                        {trip.title}
                    </h1>

                    <p
                        style={{
                            margin: "5px 0",
                            fontSize: "17px",
                        }}
                    >
                        📍 {trip.destination}
                    </p>

                    <p
                        style={{
                            margin: "5px 0",
                            opacity: 0.9,
                        }}
                    >
                        {formatDate(trip.startDate)} -{" "}
                        {formatDate(trip.endDate)}
                    </p>
                </div>

                {/* ADD ACTIVITY BUTTON */}

                {!showForm && (
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setError("");

                            setFormData({
                                ...formData,
                                date: trip.startDate,
                            });
                        }}
                        style={{
                            ...primaryButton,
                            marginBottom: "25px",
                        }}
                    >
                        + Add Activity
                    </button>
                )}

                {/* ACTIVITY FORM */}

                {showForm && (
                    <div
                        style={{
                            background: "white",
                            padding: "28px",
                            borderRadius: "16px",
                            marginBottom: "30px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.06)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "20px",
                            }}
                        >
                            <h2 style={{ margin: 0 }}>
                                {editingActivity
                                    ? "Edit Activity"
                                    : "Add Activity"}
                            </h2>

                            <button
                                onClick={resetForm}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    fontSize: "22px",
                                    cursor: "pointer",
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* ERROR */}

                        {error && (
                            <div
                                style={{
                                    background: "#fef2f2",
                                    border:
                                        "1px solid #fecaca",
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
                            {/* TITLE */}

                            <div style={fieldContainer}>
                                <label style={labelStyle}>
                                    Activity Name *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Example: Visit Baga Beach"
                                    style={inputStyle}
                                />
                            </div>

                            {/* DATE */}

                            <div style={fieldContainer}>
                                <label style={labelStyle}>
                                    Date *
                                </label>

                                <input
                                    type="date"
                                    name="date"
                                    min={trip.startDate}
                                    max={trip.endDate}
                                    value={formData.date}
                                    onChange={handleChange}
                                    style={inputStyle}
                                />
                            </div>

                            {/* TIME */}

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr",
                                    gap: "15px",
                                }}
                            >
                                <div style={fieldContainer}>
                                    <label style={labelStyle}>
                                        Start Time *
                                    </label>

                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>

                                <div style={fieldContainer}>
                                    <label style={labelStyle}>
                                        End Time *
                                    </label>

                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* LOCATION */}

                            <div style={fieldContainer}>
                                <label style={labelStyle}>
                                    Location
                                </label>

                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Example: Baga Beach, Goa"
                                    style={inputStyle}
                                />
                            </div>

                            {/* CATEGORY */}

                            <div style={fieldContainer}>
                                <label style={labelStyle}>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="Sightseeing">
                                        Sightseeing
                                    </option>

                                    <option value="Food">
                                        Food
                                    </option>

                                    <option value="Adventure">
                                        Adventure
                                    </option>

                                    <option value="Shopping">
                                        Shopping
                                    </option>

                                    <option value="Relaxation">
                                        Relaxation
                                    </option>

                                    <option value="Transport">
                                        Transport
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            {/* DESCRIPTION */}

                            <div style={fieldContainer}>
                                <label style={labelStyle}>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Add some details about this activity..."
                                    rows="3"
                                    style={{
                                        ...inputStyle,
                                        resize: "vertical",
                                    }}
                                />
                            </div>

                            {/* COST */}

                            <div style={fieldContainer}>
                                <label style={labelStyle}>
                                    Estimated Cost (₹)
                                </label>

                                <input
                                    type="number"
                                    name="estimatedCost"
                                    min="0"
                                    value={formData.estimatedCost}
                                    onChange={handleChange}
                                    placeholder="Example: 500"
                                    style={inputStyle}
                                />
                            </div>

                            {/* BUTTONS */}

                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginTop: "20px",
                                }}
                            >
                                <button
                                    type="submit"
                                    style={primaryButton}
                                >
                                    {editingActivity
                                        ? "Update Activity"
                                        : "Add Activity"}
                                </button>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    style={secondaryButton}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ITINERARY */}

                {dates.map((date, dayIndex) => {
                    const dayActivities =
                        activities
                            .filter(
                                (activity) =>
                                    activity.date === date
                            )
                            .sort((a, b) =>
                                a.startTime.localeCompare(
                                    b.startTime
                                )
                            );

                    return (
                        <div
                            key={date}
                            style={{
                                background: "white",
                                borderRadius: "16px",
                                padding: "25px",
                                marginBottom: "25px",
                                boxShadow:
                                    "0 4px 15px rgba(0,0,0,0.06)",
                            }}
                        >
                            {/* DAY HEADER */}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    marginBottom: "20px",
                                }}
                            >
                                <div>
                                    <div
                                        style={{
                                            color: "#2563eb",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                        }}
                                    >
                                        DAY {dayIndex + 1}
                                    </div>

                                    <h2
                                        style={{
                                            margin:
                                                "5px 0 0 0",
                                            color: "#172033",
                                        }}
                                    >
                                        {formatDate(date)}
                                    </h2>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowForm(true);

                                        setFormData({
                                            ...formData,
                                            date: date,
                                        });

                                        setError("");

                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }}
                                    style={{
                                        ...secondaryButton,
                                        color: "#2563eb",
                                        border:
                                            "1px solid #2563eb",
                                    }}
                                >
                                    + Add
                                </button>
                            </div>

                            {/* ACTIVITIES */}

                            {dayActivities.length === 0 ? (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "30px",
                                        border:
                                            "2px dashed #d1d5db",
                                        borderRadius: "10px",
                                        color: "#6b7280",
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: "30px",
                                        }}
                                    >
                                        📅
                                    </div>

                                    <p>
                                        No activities planned
                                        for this day.
                                    </p>

                                    <button
                                        onClick={() => {
                                            setShowForm(true);

                                            setFormData({
                                                ...formData,
                                                date: date,
                                            });

                                            window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });
                                        }}
                                        style={{
                                            ...secondaryButton,
                                            color: "#2563eb",
                                        }}
                                    >
                                        Add Activity
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    {dayActivities.map(
                                        (activity) => {
                                            const originalIndex =
                                                activities.findIndex(
                                                    (item) =>
                                                        item.id ===
                                                        activity.id
                                                );

                                            return (
                                                <div
                                                    key={activity.id}
                                                    style={{
                                                        display: "flex",
                                                        gap: "15px",
                                                        padding: "18px",
                                                        marginBottom:
                                                            "12px",
                                                        border:
                                                            "1px solid #e5e7eb",
                                                        borderRadius:
                                                            "12px",
                                                        background:
                                                            "#fafafa",
                                                    }}
                                                >
                                                    {/* TIME */}

                                                    <div
                                                        style={{
                                                            minWidth:
                                                                "100px",
                                                            color:
                                                                "#2563eb",
                                                            fontWeight:
                                                                "700",
                                                        }}
                                                    >
                                                        <div>
                                                            {formatTime(
                                                                activity.startTime
                                                            )}
                                                        </div>

                                                        <div
                                                            style={{
                                                                color:
                                                                    "#9ca3af",
                                                                fontSize:
                                                                    "13px",
                                                                marginTop:
                                                                    "3px",
                                                            }}
                                                        >
                                                            to{" "}
                                                            {formatTime(
                                                                activity.endTime
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* ACTIVITY DETAILS */}

                                                    <div
                                                        style={{
                                                            flex: 1,
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: "8px",
                                                                flexWrap:
                                                                    "wrap",
                                                            }}
                                                        >
                                                            <h3
                                                                style={{
                                                                    margin: 0,
                                                                    color:
                                                                        "#172033",
                                                                }}
                                                            >
                                                                {
                                                                    activity.title
                                                                }
                                                            </h3>

                                                            <span
                                                                style={{
                                                                    background:
                                                                        "#dbeafe",
                                                                    color:
                                                                        "#1d4ed8",
                                                                    padding:
                                                                        "4px 8px",
                                                                    borderRadius:
                                                                        "20px",
                                                                    fontSize:
                                                                        "12px",
                                                                    fontWeight:
                                                                        "600",
                                                                }}
                                                            >
                                                                {
                                                                    activity.category
                                                                }
                                                            </span>
                                                        </div>

                                                        {activity.location && (
                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "7px 0",
                                                                    color:
                                                                        "#4b5563",
                                                                }}
                                                            >
                                                                📍{" "}
                                                                {
                                                                    activity.location
                                                                }
                                                            </p>
                                                        )}

                                                        {activity.description && (
                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "5px 0",
                                                                    color:
                                                                        "#6b7280",
                                                                }}
                                                            >
                                                                {
                                                                    activity.description
                                                                }
                                                            </p>
                                                        )}

                                                        {activity.estimatedCost >
                                                            0 && (
                                                                <p
                                                                    style={{
                                                                        margin:
                                                                            "8px 0 0",
                                                                        color:
                                                                            "#166534",
                                                                        fontWeight:
                                                                            "600",
                                                                    }}
                                                                >
                                                                    💰 ₹
                                                                    {Number(
                                                                        activity.estimatedCost
                                                                    ).toLocaleString(
                                                                        "en-IN"
                                                                    )}
                                                                </p>
                                                            )}
                                                    </div>

                                                    {/* ACTIONS */}

                                                    <div
                                                        style={{
                                                            display:
                                                                "flex",
                                                            flexDirection:
                                                                "column",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                moveActivityUp(
                                                                    originalIndex
                                                                )
                                                            }
                                                            style={
                                                                actionButton
                                                            }
                                                            title="Move up"
                                                        >
                                                            ↑
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                moveActivityDown(
                                                                    originalIndex
                                                                )
                                                            }
                                                            style={
                                                                actionButton
                                                            }
                                                            title="Move down"
                                                        >
                                                            ↓
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                editActivity(
                                                                    activity
                                                                )
                                                            }
                                                            style={
                                                                actionButton
                                                            }
                                                            title="Edit"
                                                        >
                                                            ✏️
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                deleteActivity(
                                                                    activity.id
                                                                )
                                                            }
                                                            style={{
                                                                ...actionButton,
                                                                color:
                                                                    "#dc2626",
                                                            }}
                                                            title="Delete"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* SAVE MESSAGE */}

                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#166534",
                    }}
                >
                    ✓ Your itinerary is automatically saved
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "15px",
    background: "white",
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    fontWeight: "600",
    color: "#374151",
};

const fieldContainer = {
    marginBottom: "18px",
};

const primaryButton = {
    border: "none",
    background:
        "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "white",
    padding: "12px 20px",
    borderRadius: "9px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
};

const secondaryButton = {
    border: "1px solid #d1d5db",
    background: "white",
    color: "#374151",
    padding: "11px 18px",
    borderRadius: "9px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
};

const actionButton = {
    border: "1px solid #e5e7eb",
    background: "white",
    width: "34px",
    height: "30px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
};

export default Itinerary;
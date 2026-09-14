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
            JSON.parse(
                localStorage.getItem("tripnest_trips")
            ) || [];

        const selectedTrip = savedTrips.find(
            (item) => item.id === tripId
        );

        if (selectedTrip) {
            setTrip(selectedTrip);
            setActivities(
                selectedTrip.activities || []
            );
        }
    }, [tripId]);

    // --------------------------------------------------
    // GET DATES
    // --------------------------------------------------

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];

        let current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            dates.push(
                current.toISOString().split("T")[0]
            );

            current.setDate(
                current.getDate() + 1
            );
        }

        return dates;
    };

    // --------------------------------------------------
    // FORMAT DATE
    // --------------------------------------------------

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    // --------------------------------------------------
    // SHORT DATE
    // --------------------------------------------------

    const shortDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
            }
        );
    };

    // --------------------------------------------------
    // FORMAT TIME
    // --------------------------------------------------

    const formatTime = (time) => {
        if (!time) return "";

        const [hour, minute] = time.split(":");

        const date = new Date();

        date.setHours(Number(hour));
        date.setMinutes(Number(minute));

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }
        );
    };

    // --------------------------------------------------
    // CALCULATE TRIP DAYS
    // --------------------------------------------------

    const getTripDays = () => {
        if (!trip) return 0;

        const start = new Date(trip.startDate);
        const end = new Date(trip.endDate);

        return (
            Math.ceil(
                (end - start) /
                (1000 * 60 * 60 * 24)
            ) + 1
        );
    };

    // --------------------------------------------------
    // TOTAL COST
    // --------------------------------------------------

    const getTotalCost = () => {
        return activities.reduce(
            (total, activity) =>
                total +
                Number(activity.estimatedCost || 0),
            0
        );
    };

    // --------------------------------------------------
    // CATEGORY ICON
    // --------------------------------------------------

    const getCategoryIcon = (category) => {
        const icons = {
            Sightseeing: "📸",
            Food: "🍴",
            Adventure: "🏔️",
            Shopping: "🛍️",
            Relaxation: "🌿",
            Transport: "🚗",
            Other: "✨",
        };

        return icons[category] || "✨";
    };

    // --------------------------------------------------
    // HERO IMAGE
    // --------------------------------------------------

    const getHeroImage = () => {
        const destination =
            trip?.destination?.toLowerCase() || "";

        if (
            destination.includes("himalaya") ||
            destination.includes("manali") ||
            destination.includes("mountain") ||
            destination.includes("ladakh") ||
            destination.includes("shimla")
        ) {
            return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=90";
        }

        if (
            destination.includes("goa") ||
            destination.includes("beach")
        ) {
            return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=90";
        }

        if (
            destination.includes("paris")
        ) {
            return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=90";
        }

        if (
            destination.includes("dubai")
        ) {
            return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=90";
        }

        return "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=90";
    };

    // --------------------------------------------------
    // FORM CHANGE
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
    // TIME CONFLICT
    // --------------------------------------------------

    const hasTimeConflict = () => {
        const newStart = formData.startTime;
        const newEnd = formData.endTime;

        return activities.some((activity) => {
            if (
                editingActivity &&
                activity.id === editingActivity.id
            ) {
                return false;
            }

            if (
                activity.date !==
                formData.date
            ) {
                return false;
            }

            return (
                newStart < activity.endTime &&
                newEnd > activity.startTime
            );
        });
    };

    // --------------------------------------------------
    // ADD / UPDATE
    // --------------------------------------------------

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            setError(
                "Please enter an activity name."
            );
            return;
        }

        if (!formData.date) {
            setError(
                "Please select a date."
            );
            return;
        }

        if (!formData.startTime) {
            setError(
                "Please select a start time."
            );
            return;
        }

        if (!formData.endTime) {
            setError(
                "Please select an end time."
            );
            return;
        }

        if (
            formData.endTime <=
            formData.startTime
        ) {
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

        // UPDATE
        if (editingActivity) {
            const updatedActivities =
                activities.map(
                    (activity) =>
                        activity.id ===
                            editingActivity.id
                            ? {
                                ...activity,
                                ...formData,
                                estimatedCost:
                                    formData.estimatedCost
                                        ? Number(
                                            formData.estimatedCost
                                        )
                                        : 0,
                            }
                            : activity
                );

            saveActivities(
                updatedActivities
            );

            resetForm();

            return;
        }

        // CREATE
        const newActivity = {
            id: Date.now().toString(),
            title: formData.title.trim(),
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location:
                formData.location.trim(),
            category:
                formData.category,
            description:
                formData.description.trim(),
            estimatedCost:
                formData.estimatedCost
                    ? Number(
                        formData.estimatedCost
                    )
                    : 0,
        };

        const updatedActivities = [
            ...activities,
            newActivity,
        ];

        saveActivities(
            updatedActivities
        );

        resetForm();
    };

    // --------------------------------------------------
    // SAVE ACTIVITIES
    // --------------------------------------------------

    const saveActivities = (
        updatedActivities
    ) => {
        setActivities(
            updatedActivities
        );

        const savedTrips =
            JSON.parse(
                localStorage.getItem(
                    "tripnest_trips"
                )
            ) || [];

        const updatedTrips =
            savedTrips.map((item) => {
                if (item.id === tripId) {
                    return {
                        ...item,
                        activities:
                            updatedActivities,
                    };
                }

                return item;
            });

        localStorage.setItem(
            "tripnest_trips",
            JSON.stringify(updatedTrips)
        );

        const updatedTrip =
            updatedTrips.find(
                (item) =>
                    item.id === tripId
            );

        if (updatedTrip) {
            localStorage.setItem(
                "tripnest_current_trip",
                JSON.stringify(
                    updatedTrip
                )
            );

            setTrip(updatedTrip);
        }
    };

    // --------------------------------------------------
    // DELETE
    // --------------------------------------------------

    const deleteActivity = (id) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this activity?"
            );

        if (!confirmed) return;

        const updatedActivities =
            activities.filter(
                (activity) =>
                    activity.id !== id
            );

        saveActivities(
            updatedActivities
        );
    };

    // --------------------------------------------------
    // EDIT
    // --------------------------------------------------

    const editActivity = (
        activity
    ) => {
        setEditingActivity(
            activity
        );

        setFormData({
            title: activity.title,
            date: activity.date,
            startTime:
                activity.startTime,
            endTime:
                activity.endTime,
            location:
                activity.location,
            category:
                activity.category,
            description:
                activity.description,
            estimatedCost:
                activity.estimatedCost ||
                "",
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // --------------------------------------------------
    // MOVE UP
    // --------------------------------------------------

    const moveActivityUp = (
        index
    ) => {
        if (index === 0) return;

        const updated = [
            ...activities,
        ];

        [
            updated[index - 1],
            updated[index],
        ] = [
                updated[index],
                updated[index - 1],
            ];

        saveActivities(updated);
    };

    // --------------------------------------------------
    // MOVE DOWN
    // --------------------------------------------------

    const moveActivityDown = (
        index
    ) => {
        if (
            index ===
            activities.length - 1
        ) {
            return;
        }

        const updated = [
            ...activities,
        ];

        [
            updated[index],
            updated[index + 1],
        ] = [
                updated[index + 1],
                updated[index],
            ];

        saveActivities(updated);
    };

    // --------------------------------------------------
    // OPEN ADD FORM
    // --------------------------------------------------

    const openAddForm = (
        selectedDate = trip?.startDate
    ) => {
        setEditingActivity(null);

        setFormData({
            title: "",
            date:
                selectedDate ||
                trip?.startDate ||
                "",
            startTime: "",
            endTime: "",
            location: "",
            category: "Sightseeing",
            description: "",
            estimatedCost: "",
        });

        setError("");
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // --------------------------------------------------
    // TRIP NOT FOUND
    // --------------------------------------------------

    if (!trip) {
        return (
            <div className="itinerary-page">
                <div className="not-found">
                    <div className="not-found-icon">
                        🗺️
                    </div>

                    <h2>
                        Trip not found
                    </h2>

                    <p>
                        We couldn't find this
                        trip in your saved
                        trips.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                "/trips"
                            )
                        }
                    >
                        ← Back to My Trips
                    </button>
                </div>
            </div>
        );
    }

    const dates =
        getDatesBetween(
            trip.startDate,
            trip.endDate
        );

    return (
        <div className="itinerary-page">

            {/* ==========================================
                MAIN CONTAINER
            ========================================== */}

            <div className="itinerary-container">

                {/* ======================================
                    TOP BAR
                ====================================== */}

                <div className="top-bar">

                    <button
                        className="back-link"
                        onClick={() =>
                            navigate(
                                "/trips"
                            )
                        }
                    >
                        ← Back to My Trips
                    </button>

                    <div className="top-brand">
                        <div className="top-brand-icon">
                            ✈
                        </div>

                        <span>
                            TripNest
                        </span>
                    </div>

                </div>


                {/* ======================================
                    HERO
                ====================================== */}

                <section
                    className="trip-hero"
                    style={{
                        backgroundImage: `
                            linear-gradient(
                                90deg,
                                rgba(8, 20, 42, 0.88) 0%,
                                rgba(8, 20, 42, 0.65) 45%,
                                rgba(8, 20, 42, 0.18) 100%
                            ),
                            url("${getHeroImage()}")
                        `,
                    }}
                >

                    <div className="hero-content">

                        <div className="hero-badge">
                            ✨ YOUR ADVENTURE
                        </div>

                        <h1>
                            {trip.title}
                        </h1>

                        <div className="hero-location">
                            <span>
                                📍
                            </span>

                            <span>
                                {trip.destination}
                            </span>
                        </div>

                        <p className="hero-date">
                            {formatDate(
                                trip.startDate
                            )}
                            {" "}
                            —
                            {" "}
                            {formatDate(
                                trip.endDate
                            )}
                        </p>

                        <div className="hero-stats">

                            <div className="hero-stat">
                                <span className="hero-stat-icon">
                                    📅
                                </span>

                                <div>
                                    <strong>
                                        {
                                            getTripDays()
                                        }
                                    </strong>

                                    <small>
                                        Days
                                    </small>
                                </div>
                            </div>

                            <div className="hero-stat">
                                <span className="hero-stat-icon">
                                    👥
                                </span>

                                <div>
                                    <strong>
                                        {
                                            trip.travelers ||
                                            1
                                        }
                                    </strong>

                                    <small>
                                        Travelers
                                    </small>
                                </div>
                            </div>

                            <div className="hero-stat">
                                <span className="hero-stat-icon">
                                    💰
                                </span>

                                <div>
                                    <strong>
                                        ₹
                                        {Number(
                                            trip.budget ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                    <small>
                                        Budget
                                    </small>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ======================================
                    QUICK SUMMARY
                ====================================== */}

                <div className="summary-grid">

                    <div className="summary-card">
                        <div className="summary-icon blue">
                            🗓️
                        </div>

                        <div>
                            <span>
                                Trip Duration
                            </span>

                            <strong>
                                {getTripDays()}{" "}
                                days
                            </strong>
                        </div>
                    </div>


                    <div className="summary-card">
                        <div className="summary-icon purple">
                            📍
                        </div>

                        <div>
                            <span>
                                Destination
                            </span>

                            <strong>
                                {
                                    trip.destination
                                }
                            </strong>
                        </div>
                    </div>


                    <div className="summary-card">
                        <div className="summary-icon green">
                            💰
                        </div>

                        <div>
                            <span>
                                Planned Cost
                            </span>

                            <strong>
                                ₹
                                {getTotalCost().toLocaleString(
                                    "en-IN"
                                )}
                            </strong>
                        </div>
                    </div>


                    <div className="summary-card">
                        <div className="summary-icon orange">
                            🎯
                        </div>

                        <div>
                            <span>
                                Activities
                            </span>

                            <strong>
                                {
                                    activities.length
                                }
                            </strong>
                        </div>
                    </div>

                </div>


                {/* ======================================
                    ACTION BAR
                ====================================== */}

                <div className="action-bar">

                    <div>
                        <h2>
                            Your Itinerary
                        </h2>

                        <p>
                            Plan each day of
                            your journey
                        </p>
                    </div>

                    <button
                        className="primary-btn"
                        onClick={() =>
                            openAddForm()
                        }
                    >
                        <span>
                            +
                        </span>

                        Add Activity
                    </button>

                </div>


                {/* ======================================
                    ACTIVITY FORM
                ====================================== */}

                {showForm && (
                    <section className="form-card">

                        <div className="form-header">

                            <div>
                                <div className="form-title-icon">
                                    {editingActivity
                                        ? "✏️"
                                        : "✨"}
                                </div>

                                <div>
                                    <h2>
                                        {editingActivity
                                            ? "Edit Activity"
                                            : "Add Activity"}
                                    </h2>

                                    <p>
                                        Add details to
                                        make your
                                        itinerary
                                        complete.
                                    </p>
                                </div>
                            </div>

                            <button
                                className="close-btn"
                                onClick={
                                    resetForm
                                }
                            >
                                ×
                            </button>

                        </div>


                        {error && (
                            <div className="error-box">
                                ⚠️ {error}
                            </div>
                        )}


                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="form-grid">

                                {/* Activity */}
                                <div className="form-field full">
                                    <label>
                                        Activity Name *
                                    </label>

                                    <div className="input-wrap">
                                        <span>
                                            ✨
                                        </span>

                                        <input
                                            type="text"
                                            name="title"
                                            value={
                                                formData.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: Visit Baga Beach"
                                        />
                                    </div>
                                </div>


                                {/* Date */}
                                <div className="form-field">
                                    <label>
                                        Date *
                                    </label>

                                    <div className="input-wrap">
                                        <span>
                                            📅
                                        </span>

                                        <input
                                            type="date"
                                            name="date"
                                            min={
                                                trip.startDate
                                            }
                                            max={
                                                trip.endDate
                                            }
                                            value={
                                                formData.date
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>
                                </div>


                                {/* Category */}
                                <div className="form-field">
                                    <label>
                                        Category
                                    </label>

                                    <div className="input-wrap">
                                        <span>
                                            🏷️
                                        </span>

                                        <select
                                            name="category"
                                            value={
                                                formData.category
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >
                                            <option value="Sightseeing">
                                                📸 Sightseeing
                                            </option>

                                            <option value="Food">
                                                🍴 Food
                                            </option>

                                            <option value="Adventure">
                                                🏔️ Adventure
                                            </option>

                                            <option value="Shopping">
                                                🛍️ Shopping
                                            </option>

                                            <option value="Relaxation">
                                                🌿 Relaxation
                                            </option>

                                            <option value="Transport">
                                                🚗 Transport
                                            </option>

                                            <option value="Other">
                                                ✨ Other
                                            </option>
                                        </select>
                                    </div>
                                </div>


                                {/* Start Time */}
                                <div className="form-field">
                                    <label>
                                        Start Time *
                                    </label>

                                    <div className="input-wrap">
                                        <span>
                                            🕐
                                        </span>

                                        <input
                                            type="time"
                                            name="startTime"
                                            value={
                                                formData.startTime
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>
                                </div>


                                {/* End Time */}
                                <div className="form-field">
                                    <label>
                                        End Time *
                                    </label>

                                    <div className="input-wrap">
                                        <span>
                                            🕐
                                        </span>

                                        <input
                                            type="time"
                                            name="endTime"
                                            value={
                                                formData.endTime
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />
                                    </div>
                                </div>


                                {/* Location */}
                                <div className="form-field full">
                                    <label>
                                        Location
                                    </label>

                                    <div className="input-wrap">
                                        <span>
                                            📍
                                        </span>

                                        <input
                                            type="text"
                                            name="location"
                                            value={
                                                formData.location
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: Baga Beach, Goa"
                                        />
                                    </div>
                                </div>


                                {/* Cost */}
                                <div className="form-field">
                                    <label>
                                        Estimated Cost (₹)
                                    </label>

                                    <div className="input-wrap">
                                        <span>
                                            💰
                                        </span>

                                        <input
                                            type="number"
                                            name="estimatedCost"
                                            min="0"
                                            value={
                                                formData.estimatedCost
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Example: 1000"
                                        />
                                    </div>
                                </div>


                                {/* Description */}
                                <div className="form-field">
                                    <label>
                                        Description
                                    </label>

                                    <div className="input-wrap textarea-wrap">
                                        <span>
                                            📝
                                        </span>

                                        <textarea
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Add some details..."
                                            rows="3"
                                        />
                                    </div>
                                </div>

                            </div>


                            <div className="form-buttons">

                                <button
                                    type="submit"
                                    className="primary-btn"
                                >
                                    {editingActivity
                                        ? "✓ Update Activity"
                                        : "+ Add Activity"}
                                </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        resetForm
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </section>
                )}


                {/* ======================================
                    DAY-BY-DAY ITINERARY
                ====================================== */}

                <div className="days-container">

                    {dates.map(
                        (
                            date,
                            dayIndex
                        ) => {

                            const dayActivities =
                                activities
                                    .filter(
                                        (
                                            activity
                                        ) =>
                                            activity.date ===
                                            date
                                    )
                                    .sort(
                                        (
                                            a,
                                            b
                                        ) =>
                                            a.startTime.localeCompare(
                                                b.startTime
                                            )
                                    );

                            return (
                                <section
                                    className="day-card"
                                    key={date}
                                >

                                    {/* Day heading */}

                                    <div className="day-heading">

                                        <div className="day-number">
                                            <span>
                                                DAY
                                            </span>

                                            <strong>
                                                {dayIndex +
                                                    1}
                                            </strong>
                                        </div>

                                        <div className="day-info">
                                            <h2>
                                                {formatDate(
                                                    date
                                                )}
                                            </h2>

                                            <span>
                                                {dayActivities.length ===
                                                    0
                                                    ? "Nothing planned yet"
                                                    : `${dayActivities.length} ${dayActivities.length ===
                                                        1
                                                        ? "activity"
                                                        : "activities"
                                                    } planned`}
                                            </span>
                                        </div>

                                        <button
                                            className="day-add-btn"
                                            onClick={() =>
                                                openAddForm(
                                                    date
                                                )
                                            }
                                        >
                                            + Add
                                        </button>

                                    </div>


                                    {/* Activities */}

                                    {dayActivities.length ===
                                        0 ? (
                                        <div className="empty-day">

                                            <div className="empty-icon">
                                                🗓️
                                            </div>

                                            <h3>
                                                Your day is
                                                wide open
                                            </h3>

                                            <p>
                                                Add your
                                                first
                                                activity
                                                for{" "}
                                                {shortDate(
                                                    date
                                                )}
                                            </p>

                                            <button
                                                className="outline-btn"
                                                onClick={() =>
                                                    openAddForm(
                                                        date
                                                    )
                                                }
                                            >
                                                + Plan an
                                                Activity
                                            </button>

                                        </div>
                                    ) : (
                                        <div className="timeline">

                                            {dayActivities.map(
                                                (
                                                    activity,
                                                    activityIndex
                                                ) => {

                                                    const originalIndex =
                                                        activities.findIndex(
                                                            (
                                                                item
                                                            ) =>
                                                                item.id ===
                                                                activity.id
                                                        );

                                                    return (
                                                        <div
                                                            className="timeline-item"
                                                            key={
                                                                activity.id
                                                            }
                                                        >

                                                            {/* Timeline line */}

                                                            <div className="timeline-marker">
                                                                <span>
                                                                    {getCategoryIcon(
                                                                        activity.category
                                                                    )}
                                                                </span>
                                                            </div>


                                                            {/* Time */}

                                                            <div className="activity-time">
                                                                <strong>
                                                                    {formatTime(
                                                                        activity.startTime
                                                                    )}
                                                                </strong>

                                                                <span>
                                                                    {formatTime(
                                                                        activity.endTime
                                                                    )}
                                                                </span>
                                                            </div>


                                                            {/* Activity card */}

                                                            <div className="activity-card">

                                                                <div className="activity-main">

                                                                    <div className="activity-top">

                                                                        <div>

                                                                            <div className="activity-category">
                                                                                {
                                                                                    activity.category
                                                                                }
                                                                            </div>

                                                                            <h3>
                                                                                {
                                                                                    activity.title
                                                                                }
                                                                            </h3>

                                                                        </div>

                                                                    </div>


                                                                    {activity.location && (
                                                                        <div className="activity-location">
                                                                            <span>
                                                                                📍
                                                                            </span>

                                                                            {
                                                                                activity.location
                                                                            }
                                                                        </div>
                                                                    )}


                                                                    {activity.description && (
                                                                        <p className="activity-description">
                                                                            {
                                                                                activity.description
                                                                            }
                                                                        </p>
                                                                    )}


                                                                    {activity.estimatedCost >
                                                                        0 && (
                                                                            <div className="activity-cost">
                                                                                💰 ₹
                                                                                {Number(
                                                                                    activity.estimatedCost
                                                                                ).toLocaleString(
                                                                                    "en-IN"
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                </div>


                                                                {/* Actions */}

                                                                <div className="activity-actions">

                                                                    <button
                                                                        onClick={() =>
                                                                            moveActivityUp(
                                                                                originalIndex
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            originalIndex ===
                                                                            0
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
                                                                        disabled={
                                                                            originalIndex ===
                                                                            activities.length -
                                                                            1
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
                                                                        title="Edit"
                                                                    >
                                                                        ✏️
                                                                    </button>

                                                                    <button
                                                                        className="delete-action"
                                                                        onClick={() =>
                                                                            deleteActivity(
                                                                                activity.id
                                                                            )
                                                                        }
                                                                        title="Delete"
                                                                    >
                                                                        🗑️
                                                                    </button>

                                                                </div>

                                                            </div>

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>
                                    )}

                                </section>
                            );
                        }
                    )}

                </div>


                {/* ======================================
                    FOOTER
                ====================================== */}

                <div className="saved-message">
                    <span>
                        ✓
                    </span>

                    Your itinerary is
                    automatically saved
                </div>

            </div>


            {/* ==========================================
                CSS
            ========================================== */}

            <style>
                {`

                * {
                    box-sizing: border-box;
                }

                .itinerary-page {
                    min-height: 100vh;
                    background:
                        linear-gradient(
                            135deg,
                            #f4f7fb 0%,
                            #eef3fb 50%,
                            #f8faff 100%
                        );
                    padding: 28px 20px 60px;
                    font-family:
                        Inter,
                        -apple-system,
                        BlinkMacSystemFont,
                        "Segoe UI",
                        sans-serif;
                    color: #172033;
                }

                .itinerary-container {
                    max-width: 1160px;
                    margin: 0 auto;
                }


                /* ============================
                   TOP BAR
                ============================ */

                .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .back-link {
                    border: none;
                    background: white;
                    color: #2563eb;
                    padding: 10px 15px;
                    border-radius: 11px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow:
                        0 5px 20px
                        rgba(15, 23, 42, 0.05);
                    transition: 0.2s;
                }

                .back-link:hover {
                    transform: translateX(-3px);
                    box-shadow:
                        0 8px 25px
                        rgba(15, 23, 42, 0.08);
                }

                .top-brand {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    font-size: 19px;
                    font-weight: 800;
                    color: #172033;
                }

                .top-brand-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background:
                        linear-gradient(
                            135deg,
                            #2563eb,
                            #4f46e5
                        );
                    color: white;
                    box-shadow:
                        0 8px 20px
                        rgba(37, 99, 235, 0.2);
                }


                /* ============================
                   HERO
                ============================ */

                .trip-hero {
                    min-height: 390px;
                    border-radius: 28px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    box-shadow:
                        0 25px 70px
                        rgba(15, 23, 42, 0.18);
                    margin-bottom: 22px;
                }

                .hero-content {
                    position: relative;
                    z-index: 2;
                    color: white;
                    padding: 48px;
                    max-width: 720px;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 8px 13px;
                    border-radius: 30px;
                    background:
                        rgba(255,255,255,0.15);
                    border:
                        1px solid
                        rgba(255,255,255,0.24);
                    backdrop-filter: blur(12px);
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                    margin-bottom: 17px;
                }

                .hero-content h1 {
                    margin: 0;
                    font-size: 46px;
                    line-height: 1.08;
                    letter-spacing: -1.5px;
                    font-weight: 800;
                }

                .hero-location {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    margin-top: 15px;
                    font-size: 19px;
                    font-weight: 600;
                }

                .hero-date {
                    color:
                        rgba(255,255,255,0.78);
                    margin:
                        9px 0 27px;
                    font-size: 14px;
                }

                .hero-stats {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .hero-stat {
                    min-width: 145px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 15px;
                    border-radius: 14px;
                    background:
                        rgba(255,255,255,0.13);
                    border:
                        1px solid
                        rgba(255,255,255,0.15);
                    backdrop-filter: blur(10px);
                }

                .hero-stat-icon {
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background:
                        rgba(255,255,255,0.16);
                    font-size: 16px;
                }

                .hero-stat strong {
                    display: block;
                    font-size: 14px;
                }

                .hero-stat small {
                    display: block;
                    margin-top: 2px;
                    font-size: 10px;
                    color:
                        rgba(255,255,255,0.65);
                }


                /* ============================
                   SUMMARY
                ============================ */

                .summary-grid {
                    display: grid;
                    grid-template-columns:
                        repeat(4, 1fr);
                    gap: 13px;
                    margin-bottom: 32px;
                }

                .summary-card {
                    background: white;
                    border:
                        1px solid #e7ebf1;
                    border-radius: 17px;
                    padding: 17px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow:
                        0 7px 25px
                        rgba(15, 23, 42, 0.05);
                }

                .summary-icon {
                    width: 43px;
                    height: 43px;
                    border-radius: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 19px;
                }

                .summary-icon.blue {
                    background: #eaf2ff;
                }

                .summary-icon.purple {
                    background: #f1edff;
                }

                .summary-icon.green {
                    background: #eafbf2;
                }

                .summary-icon.orange {
                    background: #fff4e8;
                }

                .summary-card span {
                    display: block;
                    color: #7b8798;
                    font-size: 10px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .summary-card strong {
                    display: block;
                    color: #172033;
                    font-size: 14px;
                    font-weight: 800;
                }


                /* ============================
                   ACTION BAR
                ============================ */

                .action-bar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin:
                        10px 0 17px;
                }

                .action-bar h2 {
                    margin: 0;
                    font-size: 25px;
                    letter-spacing: -0.5px;
                }

                .action-bar p {
                    margin: 4px 0 0;
                    color: #7b8798;
                    font-size: 13px;
                }

                .primary-btn {
                    border: none;
                    background:
                        linear-gradient(
                            135deg,
                            #2563eb,
                            #4f46e5
                        );
                    color: white;
                    padding: 12px 18px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 800;
                    cursor: pointer;
                    box-shadow:
                        0 10px 22px
                        rgba(37,99,235,0.22);
                    transition: 0.2s;
                }

                .primary-btn:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 14px 28px
                        rgba(37,99,235,0.28);
                }

                .primary-btn span {
                    font-size: 17px;
                    margin-right: 5px;
                }


                /* ============================
                   FORM
                ============================ */

                .form-card {
                    background: white;
                    border-radius: 21px;
                    padding: 28px;
                    margin-bottom: 25px;
                    border:
                        1px solid #e5eaf1;
                    box-shadow:
                        0 15px 45px
                        rgba(15,23,42,0.08);
                }

                .form-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 22px;
                }

                .form-header > div:first-child {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .form-title-icon {
                    width: 43px;
                    height: 43px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 13px;
                    background: #eef3ff;
                    font-size: 20px;
                }

                .form-header h2 {
                    margin: 0;
                    font-size: 20px;
                }

                .form-header p {
                    margin: 4px 0 0;
                    color: #8792a3;
                    font-size: 12px;
                }

                .close-btn {
                    border: none;
                    background: #f3f5f8;
                    width: 35px;
                    height: 35px;
                    border-radius: 10px;
                    font-size: 22px;
                    cursor: pointer;
                    color: #667085;
                }

                .error-box {
                    background: #fff3f2;
                    color: #c0392b;
                    border:
                        1px solid #ffd4d0;
                    padding: 11px 13px;
                    border-radius: 11px;
                    margin-bottom: 18px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns:
                        1fr 1fr;
                    gap: 16px;
                }

                .form-field.full {
                    grid-column: 1 / -1;
                }

                .form-field label {
                    display: block;
                    margin-bottom: 7px;
                    color: #344054;
                    font-size: 12px;
                    font-weight: 800;
                }

                .input-wrap {
                    position: relative;
                }

                .input-wrap > span {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform:
                        translateY(-50%);
                    font-size: 15px;
                    z-index: 2;
                }

                .input-wrap input,
                .input-wrap select,
                .input-wrap textarea {
                    width: 100%;
                    border:
                        1px solid #dce2ea;
                    background: #fbfcfe;
                    border-radius: 12px;
                    padding:
                        12px 13px
                        12px 42px;
                    outline: none;
                    font-family: inherit;
                    font-size: 13px;
                    color: #172033;
                    transition: 0.2s;
                }

                .input-wrap input,
                .input-wrap select {
                    height: 47px;
                }

                .input-wrap textarea {
                    resize: vertical;
                    min-height: 78px;
                    line-height: 1.5;
                }

                .input-wrap input:focus,
                .input-wrap select:focus,
                .input-wrap textarea:focus {
                    border-color: #5b7cfa;
                    background: white;
                    box-shadow:
                        0 0 0 3px
                        rgba(37,99,235,0.08);
                }

                .textarea-wrap > span {
                    top: 19px;
                    transform: none;
                }

                .form-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                }

                .cancel-btn {
                    border:
                        1px solid #dce2ea;
                    background: white;
                    color: #475467;
                    padding: 12px 18px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                }


                /* ============================
                   DAY CARD
                ============================ */

                .day-card {
                    background: white;
                    border:
                        1px solid #e5eaf1;
                    border-radius: 21px;
                    margin-bottom: 20px;
                    padding: 24px;
                    box-shadow:
                        0 10px 35px
                        rgba(15,23,42,0.055);
                }

                .day-heading {
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    padding-bottom: 20px;
                    border-bottom:
                        1px solid #edf0f4;
                }

                .day-number {
                    width: 53px;
                    height: 53px;
                    border-radius: 15px;
                    background:
                        linear-gradient(
                            135deg,
                            #2563eb,
                            #4f46e5
                        );
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow:
                        0 8px 18px
                        rgba(37,99,235,0.2);
                }

                .day-number span {
                    font-size: 8px;
                    font-weight: 800;
                    letter-spacing: 0.7px;
                }

                .day-number strong {
                    font-size: 20px;
                    line-height: 20px;
                }

                .day-info {
                    flex: 1;
                }

                .day-info h2 {
                    margin: 0;
                    font-size: 18px;
                    color: #172033;
                }

                .day-info span {
                    display: block;
                    margin-top: 4px;
                    color: #8a94a4;
                    font-size: 11px;
                }

                .day-add-btn {
                    border:
                        1px solid #cddcff;
                    background: #f7f9ff;
                    color: #2563eb;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-size: 12px;
                    font-weight: 800;
                    cursor: pointer;
                    transition: 0.2s;
                }

                .day-add-btn:hover {
                    background: #edf3ff;
                }


                /* ============================
                   EMPTY DAY
                ============================ */

                .empty-day {
                    text-align: center;
                    padding: 38px 20px 25px;
                }

                .empty-icon {
                    width: 55px;
                    height: 55px;
                    margin: 0 auto 12px;
                    border-radius: 17px;
                    background: #f3f6fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                }

                .empty-day h3 {
                    margin: 0;
                    font-size: 15px;
                }

                .empty-day p {
                    margin:
                        5px 0 15px;
                    color: #8b95a5;
                    font-size: 12px;
                }

                .outline-btn {
                    border:
                        1px solid #d4def8;
                    background: white;
                    color: #2563eb;
                    padding: 9px 14px;
                    border-radius: 9px;
                    font-size: 11px;
                    font-weight: 800;
                    cursor: pointer;
                }


                /* ============================
                   TIMELINE
                ============================ */

                .timeline {
                    position: relative;
                    padding-top: 22px;
                }

                .timeline::before {
                    content: "";
                    position: absolute;
                    left: 21px;
                    top: 42px;
                    bottom: 42px;
                    width: 2px;
                    background:
                        linear-gradient(
                            #dce5fb,
                            #edf0f6
                        );
                }

                .timeline-item {
                    position: relative;
                    display: grid;
                    grid-template-columns:
                        43px 100px 1fr;
                    gap: 10px;
                    align-items: flex-start;
                    margin-bottom: 13px;
                }

                .timeline-marker {
                    position: relative;
                    z-index: 2;
                    width: 43px;
                    height: 43px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .timeline-marker span {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: white;
                    border:
                        3px solid #e4ebfc;
                    box-shadow:
                        0 4px 10px
                        rgba(15,23,42,0.07);
                    font-size: 14px;
                }

                .activity-time {
                    padding-top: 7px;
                    text-align: right;
                    padding-right: 8px;
                }

                .activity-time strong {
                    display: block;
                    color: #2563eb;
                    font-size: 12px;
                    font-weight: 800;
                }

                .activity-time span {
                    display: block;
                    color: #98a2b3;
                    font-size: 10px;
                    margin-top: 3px;
                }

                .activity-card {
                    display: flex;
                    justify-content: space-between;
                    gap: 15px;
                    background:
                        linear-gradient(
                            135deg,
                            #ffffff,
                            #fafbfe
                        );
                    border:
                        1px solid #e5e9f0;
                    border-radius: 15px;
                    padding: 16px;
                    transition: 0.2s;
                }

                .activity-card:hover {
                    border-color: #d5def4;
                    transform:
                        translateY(-1px);
                    box-shadow:
                        0 8px 22px
                        rgba(15,23,42,0.06);
                }

                .activity-main {
                    flex: 1;
                    min-width: 0;
                }

                .activity-category {
                    display: inline-block;
                    color: #4f46e5;
                    background: #eef0ff;
                    padding: 4px 8px;
                    border-radius: 20px;
                    font-size: 9px;
                    font-weight: 800;
                    margin-bottom: 6px;
                }

                .activity-main h3 {
                    margin: 0;
                    font-size: 15px;
                    color: #172033;
                }

                .activity-location {
                    display: flex;
                    gap: 6px;
                    align-items: center;
                    color: #667085;
                    margin-top: 8px;
                    font-size: 11px;
                }

                .activity-description {
                    color: #7b8798;
                    font-size: 11px;
                    line-height: 1.5;
                    margin:
                        7px 0 0;
                }

                .activity-cost {
                    display: inline-block;
                    margin-top: 9px;
                    color: #16803c;
                    background: #edfbf2;
                    padding: 5px 8px;
                    border-radius: 7px;
                    font-size: 10px;
                    font-weight: 800;
                }

                .activity-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .activity-actions button {
                    width: 31px;
                    height: 29px;
                    border:
                        1px solid #e0e5ed;
                    background: white;
                    color: #667085;
                    border-radius: 7px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: 0.15s;
                }

                .activity-actions button:hover:not(:disabled) {
                    background: #f3f6ff;
                    color: #2563eb;
                    border-color: #cdd8f5;
                }

                .activity-actions button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .activity-actions .delete-action {
                    color: #dc2626;
                }

                .activity-actions .delete-action:hover {
                    background: #fff1f1;
                    border-color: #fecaca;
                }


                /* ============================
                   SAVED MESSAGE
                ============================ */

                .saved-message {
                    text-align: center;
                    color: #62806d;
                    font-size: 11px;
                    padding: 20px;
                }

                .saved-message span {
                    display: inline-flex;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    align-items: center;
                    justify-content: center;
                    background: #eaf8ee;
                    color: #16803c;
                    margin-right: 6px;
                    font-weight: 800;
                }


                /* ============================
                   NOT FOUND
                ============================ */

                .not-found {
                    width: min(
                        450px,
                        calc(100% - 40px)
                    );
                    margin: 100px auto;
                    background: white;
                    border-radius: 22px;
                    padding: 45px;
                    text-align: center;
                    box-shadow:
                        0 20px 60px
                        rgba(15,23,42,0.1);
                }

                .not-found-icon {
                    font-size: 45px;
                }

                .not-found h2 {
                    margin:
                        15px 0 6px;
                }

                .not-found p {
                    color: #7b8798;
                    font-size: 13px;
                    margin-bottom: 20px;
                }


                /* ============================
                   RESPONSIVE
                ============================ */

                @media (max-width: 900px) {

                    .summary-grid {
                        grid-template-columns:
                            repeat(2, 1fr);
                    }

                    .hero-content h1 {
                        font-size: 38px;
                    }

                    .timeline-item {
                        grid-template-columns:
                            40px 80px 1fr;
                    }

                }


                @media (max-width: 650px) {

                    .itinerary-page {
                        padding:
                            15px 12px 40px;
                    }

                    .top-brand {
                        display: none;
                    }

                    .trip-hero {
                        min-height: 480px;
                        border-radius: 20px;
                        background-position: center;
                    }

                    .hero-content {
                        padding: 30px 25px;
                    }

                    .hero-content h1 {
                        font-size: 32px;
                    }

                    .hero-location {
                        font-size: 16px;
                    }

                    .hero-stats {
                        display: grid;
                        grid-template-columns:
                            1fr 1fr;
                    }

                    .hero-stat {
                        min-width: 0;
                    }

                    .summary-grid {
                        grid-template-columns:
                            1fr 1fr;
                    }

                    .summary-card {
                        padding: 13px;
                    }

                    .action-bar {
                        align-items: flex-start;
                        gap: 15px;
                    }

                    .action-bar .primary-btn {
                        white-space: nowrap;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .form-field.full {
                        grid-column: auto;
                    }

                    .day-card {
                        padding: 16px;
                    }

                    .day-heading {
                        flex-wrap: wrap;
                    }

                    .day-add-btn {
                        margin-left: auto;
                    }

                    .timeline-item {
                        grid-template-columns:
                            38px 1fr;
                        gap: 8px;
                    }

                    .activity-time {
                        grid-column: 2;
                        grid-row: 1;
                        text-align: left;
                        padding:
                            0 0 5px;
                    }

                    .timeline-marker {
                        grid-column: 1;
                        grid-row: 1 / span 2;
                    }

                    .activity-card {
                        grid-column: 2;
                        grid-row: 2;
                    }

                    .timeline::before {
                        left: 18px;
                    }

                    .activity-actions {
                        flex-direction: row;
                        flex-wrap: wrap;
                    }

                }

                `}
            </style>

        </div>
    );
}

export default Itinerary;
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const destinationImages = {
    goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=85",
    himalayas: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=85",
    manali: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=85",
    kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=85",
    rajasthan: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=85",
    mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1400&q=85",
    delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1400&q=85",
    default: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85",
};

function getDestinationImage(destination = "") {
    const value = destination.toLowerCase();

    if (value.includes("goa")) return destinationImages.goa;
    if (value.includes("himalaya")) return destinationImages.himalayas;
    if (value.includes("manali")) return destinationImages.manali;
    if (value.includes("kerala")) return destinationImages.kerala;
    if (value.includes("rajasthan")) return destinationImages.rajasthan;
    if (value.includes("mumbai")) return destinationImages.mumbai;
    if (value.includes("delhi")) return destinationImages.delhi;

    return destinationImages.default;
}

function calculateDays(startDate, endDate) {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return (
        Math.ceil(
            (end - start) / (1000 * 60 * 60 * 24)
        ) + 1
    );
}

function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getTripStatus(startDate, endDate) {
    if (!startDate || !endDate) return "upcoming";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (today < start) return "upcoming";
    if (today > end) return "completed";

    return "ongoing";
}

function getStatusText(status) {
    if (status === "ongoing") return "Ongoing";
    if (status === "completed") return "Completed";
    return "Upcoming";
}

function Icon({ type, size = 18 }) {
    const props = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    if (type === "calendar") {
        return (
            <svg {...props}>
                <rect x="3" y="4" width="18" height="17" rx="3" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        );
    }

    if (type === "users") {
        return (
            <svg {...props}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        );
    }

    if (type === "wallet") {
        return (
            <svg {...props}>
                <path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v8a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7" />
                <path d="M16 14h.01" />
            </svg>
        );
    }

    if (type === "map") {
        return (
            <svg {...props}>
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
        );
    }

    if (type === "activity") {
        return (
            <svg {...props}>
                <path d="M4 19V5" />
                <path d="M4 7h11l-2 3 2 3H4" />
            </svg>
        );
    }

    if (type === "arrow") {
        return (
            <svg {...props}>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
            </svg>
        );
    }

    if (type === "trash") {
        return (
            <svg {...props}>
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
                <path d="M9 6V3h6v3" />
            </svg>
        );
    }

    if (type === "plus") {
        return (
            <svg {...props}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        );
    }

    if (type === "sparkle") {
        return (
            <svg {...props}>
                <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
                <path d="M19 16l.6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16z" />
            </svg>
        );
    }

    return null;
}

function Trips() {
    const navigate = useNavigate();

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        try {
            const savedTrips =
                JSON.parse(
                    localStorage.getItem("tripnest_trips")
                ) || [];

            setTrips(savedTrips);
        } catch (error) {
            console.error("Unable to load trips:", error);
            setTrips([]);
        }
    }, []);

    const deleteTrip = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this trip?"
        );

        if (!confirmed) return;

        const updatedTrips = trips.filter(
            (trip) => trip.id !== id
        );

        setTrips(updatedTrips);

        localStorage.setItem(
            "tripnest_trips",
            JSON.stringify(updatedTrips)
        );

        const currentTrip =
            JSON.parse(
                localStorage.getItem(
                    "tripnest_current_trip"
                )
            );

        if (currentTrip?.id === id) {
            localStorage.removeItem(
                "tripnest_current_trip"
            );
        }
    };

    const statistics = useMemo(() => {
        const upcoming = trips.filter(
            (trip) =>
                getTripStatus(
                    trip.startDate,
                    trip.endDate
                ) === "upcoming"
        ).length;

        const totalBudget = trips.reduce(
            (sum, trip) =>
                sum + Number(trip.budget || 0),
            0
        );

        const totalActivities = trips.reduce(
            (sum, trip) =>
                sum +
                (Array.isArray(trip.activities)
                    ? trip.activities.length
                    : 0),
            0
        );

        return {
            total: trips.length,
            upcoming,
            totalBudget,
            totalActivities,
        };
    }, [trips]);

    return (
        <div className="trips-page">

            <div className="trips-container">

                {/* TOP NAVIGATION */}

                <header className="trips-topbar">

                    <div className="trips-brand">

                        <div className="trips-brand-icon">
                            ✈
                        </div>

                        <div>
                            <div className="trips-brand-name">
                                TripNest
                            </div>

                            <div className="trips-brand-tagline">
                                Your journey, organized.
                            </div>
                        </div>

                    </div>

                    <button
                        className="trips-dashboard-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <span>←</span>
                        Dashboard
                    </button>

                </header>


                {/* HERO */}

                <section className="trips-hero">

                    <div className="trips-hero-content">

                        <div className="trips-eyebrow">
                            <Icon
                                type="sparkle"
                                size={15}
                            />
                            YOUR TRAVEL SPACE
                        </div>

                        <h1>
                            My Trips
                        </h1>

                        <p>
                            Plan, organize and revisit
                            every adventure from one beautiful
                            place.
                        </p>

                    </div>

                    <Link
                        to="/create-trip"
                        className="create-trip-btn"
                    >
                        <span className="create-trip-icon">
                            <Icon
                                type="plus"
                                size={18}
                            />
                        </span>

                        Create New Trip
                    </Link>

                </section>


                {/* STATISTICS */}

                {trips.length > 0 && (
                    <section className="trip-statistics">

                        <div className="stat-card">

                            <div className="stat-icon blue">
                                <Icon
                                    type="map"
                                    size={21}
                                />
                            </div>

                            <div>
                                <span className="stat-label">
                                    TOTAL TRIPS
                                </span>

                                <strong>
                                    {statistics.total}
                                </strong>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon purple">
                                <Icon
                                    type="calendar"
                                    size={21}
                                />
                            </div>

                            <div>
                                <span className="stat-label">
                                    UPCOMING
                                </span>

                                <strong>
                                    {statistics.upcoming}
                                </strong>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon green">
                                <Icon
                                    type="wallet"
                                    size={21}
                                />
                            </div>

                            <div>
                                <span className="stat-label">
                                    TOTAL BUDGET
                                </span>

                                <strong>
                                    ₹
                                    {statistics.totalBudget.toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                            </div>

                        </div>


                        <div className="stat-card">

                            <div className="stat-icon orange">
                                <Icon
                                    type="activity"
                                    size={21}
                                />
                            </div>

                            <div>
                                <span className="stat-label">
                                    ACTIVITIES
                                </span>

                                <strong>
                                    {statistics.totalActivities}
                                </strong>
                            </div>

                        </div>

                    </section>
                )}


                {/* SECTION TITLE */}

                {trips.length > 0 && (
                    <div className="trips-section-heading">

                        <div>
                            <h2>
                                Your adventures
                            </h2>

                            <p>
                                Everything you've planned,
                                all in one place.
                            </p>
                        </div>

                        <span className="trip-count-badge">
                            {trips.length}{" "}
                            {trips.length === 1
                                ? "Trip"
                                : "Trips"}
                        </span>

                    </div>
                )}


                {/* EMPTY STATE */}

                {trips.length === 0 ? (

                    <div className="trips-empty-state">

                        <div className="empty-illustration">

                            <div className="empty-cloud cloud-one" />
                            <div className="empty-cloud cloud-two" />

                            <div className="empty-suitcase">
                                🧳
                            </div>

                        </div>

                        <span className="empty-small-title">
                            START EXPLORING
                        </span>

                        <h2>
                            Your next adventure
                            starts here
                        </h2>

                        <p>
                            Create your first trip,
                            choose a destination,
                            and start building an
                            unforgettable itinerary.
                        </p>

                        <Link
                            to="/create-trip"
                            className="empty-create-btn"
                        >
                            <Icon
                                type="sparkle"
                                size={17}
                            />
                            Plan My First Trip
                        </Link>

                    </div>

                ) : (

                    <div className="modern-trip-grid">

                        {trips.map((trip) => {

                            const days =
                                calculateDays(
                                    trip.startDate,
                                    trip.endDate
                                );

                            const activities =
                                Array.isArray(trip.activities)
                                    ? trip.activities
                                    : [];

                            const activityCount =
                                activities.length;

                            const totalCost =
                                activities.reduce(
                                    (sum, activity) =>
                                        sum +
                                        Number(
                                            activity.estimatedCost ||
                                            0
                                        ),
                                    0
                                );

                            const budget =
                                Number(
                                    trip.budget || 0
                                );

                            const budgetPercentage =
                                budget > 0
                                    ? Math.min(
                                        100,
                                        (totalCost /
                                            budget) *
                                        100
                                    )
                                    : 0;

                            const remaining =
                                Math.max(
                                    budget -
                                    totalCost,
                                    0
                                );

                            const status =
                                getTripStatus(
                                    trip.startDate,
                                    trip.endDate
                                );

                            const image =
                                getDestinationImage(
                                    trip.destination
                                );

                            return (
                                <article
                                    className="modern-trip-card"
                                    key={trip.id}
                                >

                                    {/* TRIP IMAGE */}

                                    <div
                                        className="modern-trip-image"
                                        style={{
                                            backgroundImage:
                                                `url("${image}")`,
                                        }}
                                    >

                                        <div className="modern-image-overlay" />

                                        <div className="trip-status">
                                            <span
                                                className={`status-dot ${status}`}
                                            />

                                            {getStatusText(
                                                status
                                            )}
                                        </div>

                                        <button
                                            className="image-delete-btn"
                                            onClick={() =>
                                                deleteTrip(
                                                    trip.id
                                                )
                                            }
                                            aria-label="Delete trip"
                                        >
                                            <Icon
                                                type="trash"
                                                size={16}
                                            />
                                        </button>

                                        <div className="trip-image-info">

                                            <span className="destination-chip">
                                                📍{" "}
                                                {trip.destination}
                                            </span>

                                            <h2>
                                                {trip.title}
                                            </h2>

                                            <p>
                                                {formatDate(
                                                    trip.startDate
                                                )}

                                                <span>
                                                    →
                                                </span>

                                                {formatDate(
                                                    trip.endDate
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    {/* CARD BODY */}

                                    <div className="modern-trip-body">

                                        <div className="quick-info-grid">

                                            <div className="quick-info-item">

                                                <div className="quick-info-icon">
                                                    <Icon
                                                        type="calendar"
                                                        size={16}
                                                    />
                                                </div>

                                                <div>
                                                    <span>
                                                        DURATION
                                                    </span>

                                                    <strong>
                                                        {days}{" "}
                                                        {days === 1
                                                            ? "Day"
                                                            : "Days"}
                                                    </strong>
                                                </div>

                                            </div>


                                            <div className="quick-info-item">

                                                <div className="quick-info-icon">
                                                    <Icon
                                                        type="users"
                                                        size={16}
                                                    />
                                                </div>

                                                <div>
                                                    <span>
                                                        TRAVELERS
                                                    </span>

                                                    <strong>
                                                        {
                                                            trip.travelers
                                                        }
                                                    </strong>
                                                </div>

                                            </div>

                                        </div>


                                        {/* ACTIVITIES */}

                                        <div className="activity-summary">

                                            <div className="activity-summary-left">

                                                <div className="activity-icon">
                                                    <Icon
                                                        type="activity"
                                                        size={17}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {activityCount}
                                                    </strong>

                                                    <span>
                                                        {activityCount ===
                                                            1
                                                            ? " Activity"
                                                            : " Activities"}
                                                    </span>
                                                </div>

                                            </div>


                                            <div className="planned-cost">

                                                <span>
                                                    PLANNED SPEND
                                                </span>

                                                <strong>
                                                    ₹
                                                    {totalCost.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* BUDGET */}

                                        {budget > 0 && (

                                            <div className="card-budget">

                                                <div className="budget-heading">

                                                    <div>
                                                        <span>
                                                            Trip Budget
                                                        </span>

                                                        <strong>
                                                            ₹
                                                            {budget.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>
                                                    </div>

                                                    <span>
                                                        {Math.round(
                                                            budgetPercentage
                                                        )}
                                                        %
                                                    </span>

                                                </div>


                                                <div className="budget-track">

                                                    <div
                                                        className="budget-fill"
                                                        style={{
                                                            width:
                                                                `${budgetPercentage}%`,
                                                        }}
                                                    />

                                                </div>


                                                <div className="budget-bottom">

                                                    <span>
                                                        ₹
                                                        {remaining.toLocaleString(
                                                            "en-IN"
                                                        )}{" "}
                                                        remaining
                                                    </span>

                                                    <span>
                                                        {Math.round(
                                                            budgetPercentage
                                                        ) ===
                                                            0
                                                            ? "Not started"
                                                            : "Budget used"}
                                                    </span>

                                                </div>

                                            </div>

                                        )}


                                        {/* ITINERARY BUTTON */}

                                        <button
                                            className="view-itinerary-btn"
                                            onClick={() =>
                                                navigate(
                                                    `/trips/${trip.id}/itinerary`
                                                )
                                            }
                                        >

                                            <span>
                                                View Itinerary
                                            </span>

                                            <span className="button-arrow">
                                                <Icon
                                                    type="arrow"
                                                    size={18}
                                                />
                                            </span>

                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

            </div>
        </div>
    );
}

export default Trips;
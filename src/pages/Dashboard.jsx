import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Load logged-in user
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Unable to read user:", error);
    }

    // Load trips
    try {
      const savedTrips = JSON.parse(
        localStorage.getItem("tripnest_trips")
      );

      if (Array.isArray(savedTrips)) {
        setTrips(savedTrips);
      }
    } catch (error) {
      console.error("Unable to read trips:", error);
    }
  }, []);

  // --------------------------------------------------
  // USER INFORMATION
  // --------------------------------------------------

  const email =
    user?.email ||
    localStorage.getItem("email") ||
    "traveler@tripnest.com";

  const firstName =
    user?.firstName ||
    user?.name ||
    email.split("@")[0] ||
    "Traveler";

  const role =
    user?.role ||
    user?.roles?.[0]?.name ||
    "TRAVELER";

  // --------------------------------------------------
  // TRIP CALCULATIONS
  // --------------------------------------------------

  const totalTrips = trips.length;

  const upcomingTrips = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return trips
      .filter((trip) => {
        if (!trip.startDate) return false;

        const start = new Date(trip.startDate);
        start.setHours(0, 0, 0, 0);

        return start >= today;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate) -
          new Date(b.startDate)
      );
  }, [trips]);

  const totalActivities = trips.reduce(
    (sum, trip) =>
      sum +
      (Array.isArray(trip.activities)
        ? trip.activities.length
        : 0),
    0
  );

  const totalBudget = trips.reduce(
    (sum, trip) =>
      sum + Number(trip.budget || 0),
    0
  );

  const nextTrip = upcomingTrips[0];

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return (
      Math.ceil(
        (end - start) /
        (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDestinationImage = (destination) => {
    const value =
      destination?.toLowerCase() || "";

    if (
      value.includes("goa") ||
      value.includes("beach")
    ) {
      return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=85";
    }

    if (
      value.includes("him") ||
      value.includes("mountain") ||
      value.includes("manali") ||
      value.includes("kashmir")
    ) {
      return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85";
    }

    if (
      value.includes("kerala") ||
      value.includes("munnar")
    ) {
      return "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85";
    }

    if (
      value.includes("dubai")
    ) {
      return "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=85";
    }

    if (
      value.includes("paris")
    ) {
      return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85";
    }

    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");

    navigate("/login");
  };

  // --------------------------------------------------
  // DESTINATIONS
  // --------------------------------------------------

  const destinations = [
    {
      name: "Goa",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Himalayas",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Kerala",
      country: "India",
      image:
        "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=85",
    },
    {
      name: "Paris",
      country: "France",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=85",
    },
  ];

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="dashboard-page">

      {/* ==========================================
                NAVBAR
            ========================================== */}

      <header className="dashboard-navbar">

        <div className="dashboard-navbar-inner">

          <Link
            to="/dashboard"
            className="dashboard-brand"
          >
            <div className="brand-logo">
              ✈
            </div>

            <div>
              <div className="brand-name">
                TripNest
              </div>

              <div className="brand-tagline">
                Plan. Explore. Remember.
              </div>
            </div>
          </Link>

          <nav className="dashboard-nav-links">

            <Link
              to="/dashboard"
              className="dashboard-nav-link active"
            >
              Dashboard
            </Link>

            <Link
              to="/trips"
              className="dashboard-nav-link"
            >
              My Trips
            </Link>

            <Link
              to="/create-trip"
              className="dashboard-nav-link"
            >
              Plan a Trip
            </Link>

          </nav>

          <div className="dashboard-user-area">

            <div className="user-avatar">
              {firstName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="user-info">
              <span className="user-name">
                {firstName}
              </span>

              <span className="user-role">
                {role}
              </span>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

      </header>

      {/* ==========================================
                MAIN
            ========================================== */}

      <main className="dashboard-main">

        {/* ======================================
                    HERO
                ====================================== */}

        <section className="dashboard-hero">

          <div className="hero-content">

            <div className="hero-small-label">
              ✨ YOUR TRAVEL SPACE
            </div>

            <h1>
              Welcome back,
              <span>
                {" "}
                {firstName}!
              </span>{" "}
              ✈️
            </h1>

            <p>
              Plan unforgettable journeys,
              organize your adventures,
              and keep every travel
              memory in one place.
            </p>

            <div className="hero-actions">

              <Link
                to="/create-trip"
                className="hero-primary-button"
              >
                + Plan a New Trip
              </Link>

              <Link
                to="/trips"
                className="hero-secondary-button"
              >
                Explore My Trips →
              </Link>

            </div>

          </div>

          <div className="hero-decoration">

            <div className="floating-card floating-card-one">
              🧳
              <span>
                Ready for adventure?
              </span>
            </div>

            <div className="floating-card floating-card-two">
              🌍
              <span>
                Explore the world
              </span>
            </div>

          </div>

        </section>

        {/* ======================================
                    STATISTICS
                ====================================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon blue">
              ✈️
            </div>

            <div>
              <div className="stat-label">
                Total Trips
              </div>

              <div className="stat-value">
                {totalTrips}
              </div>

              <div className="stat-description">
                Adventures planned
              </div>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              📅
            </div>

            <div>
              <div className="stat-label">
                Upcoming
              </div>

              <div className="stat-value">
                {upcomingTrips.length}
              </div>

              <div className="stat-description">
                Trips coming up
              </div>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              🗺️
            </div>

            <div>
              <div className="stat-label">
                Activities
              </div>

              <div className="stat-value">
                {totalActivities}
              </div>

              <div className="stat-description">
                Planned activities
              </div>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon purple">
              💰
            </div>

            <div>
              <div className="stat-label">
                Total Budget
              </div>

              <div className="stat-value budget-value">
                ₹
                {totalBudget.toLocaleString(
                  "en-IN"
                )}
              </div>

              <div className="stat-description">
                Across all trips
              </div>
            </div>

          </div>

        </section>

        {/* ======================================
                    TWO COLUMN AREA
                ====================================== */}

        <section className="dashboard-columns">

          {/* UPCOMING TRIP */}

          <div className="dashboard-panel upcoming-panel">

            <div className="panel-header">

              <div>
                <span className="panel-eyebrow">
                  NEXT ADVENTURE
                </span>

                <h2>
                  Upcoming Trip
                </h2>
              </div>

              <Link
                to="/trips"
                className="panel-link"
              >
                View all →
              </Link>

            </div>

            {nextTrip ? (
              <div className="upcoming-trip-card">

                <div
                  className="upcoming-trip-image"
                  style={{
                    backgroundImage: `url("${getDestinationImage(
                      nextTrip.destination
                    )}")`,
                  }}
                >

                  <div className="upcoming-overlay" />

                  <div className="upcoming-image-content">

                    <span className="trip-status">
                      UPCOMING
                    </span>

                    <h3>
                      {nextTrip.title ||
                        "My Trip"}
                    </h3>

                    <p>
                      📍{" "}
                      {nextTrip.destination ||
                        "Destination"}
                    </p>

                  </div>

                </div>

                <div className="upcoming-details">

                  <div className="detail-item">
                    <span>
                      🗓️ Start
                    </span>

                    <strong>
                      {formatDate(
                        nextTrip.startDate
                      )}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>
                      🗓️ End
                    </span>

                    <strong>
                      {formatDate(
                        nextTrip.endDate
                      )}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>
                      ⏱️ Duration
                    </span>

                    <strong>
                      {calculateDays(
                        nextTrip.startDate,
                        nextTrip.endDate
                      )}{" "}
                      Days
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>
                      💰 Budget
                    </span>

                    <strong>
                      ₹
                      {Number(
                        nextTrip.budget ||
                        0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                </div>

                <Link
                  to={`/trips/${nextTrip.id}/itinerary`}
                  className="view-itinerary-button"
                >
                  View Itinerary →
                </Link>

              </div>
            ) : (
              <div className="empty-trip">

                <div className="empty-trip-icon">
                  🧭
                </div>

                <h3>
                  Your next adventure
                  starts here
                </h3>

                <p>
                  You don't have any
                  upcoming trips yet.
                  Start planning your
                  next adventure.
                </p>

                <Link
                  to="/create-trip"
                  className="empty-trip-button"
                >
                  Create My First Trip
                </Link>

              </div>
            )}

          </div>

          {/* PROFILE + QUICK ACTIONS */}

          <div className="dashboard-side-column">

            {/* PROFILE */}

            <div className="dashboard-panel profile-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    ACCOUNT
                  </span>

                  <h2>
                    Your Profile
                  </h2>
                </div>

              </div>

              <div className="profile-card">

                <div className="profile-avatar">
                  {firstName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="profile-details">

                  <h3>
                    {firstName}
                  </h3>

                  <p>
                    {email}
                  </p>

                  <span className="profile-role">
                    {role}
                  </span>

                </div>

              </div>

              <div className="profile-divider" />

              <div className="profile-stat-row">

                <div>
                  <strong>
                    {totalTrips}
                  </strong>

                  <span>
                    Trips
                  </span>
                </div>

                <div>
                  <strong>
                    {totalActivities}
                  </strong>

                  <span>
                    Activities
                  </span>
                </div>

                <div>
                  <strong>
                    {upcomingTrips.length}
                  </strong>

                  <span>
                    Upcoming
                  </span>
                </div>

              </div>

            </div>

            {/* QUICK ACTIONS */}

            <div className="dashboard-panel quick-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    SHORTCUTS
                  </span>

                  <h2>
                    Quick Actions
                  </h2>
                </div>

              </div>

              <div className="quick-actions">

                <Link
                  to="/create-trip"
                  className="quick-action"
                >
                  <span className="quick-action-icon">
                    ✨
                  </span>

                  <span>
                    <strong>
                      Plan a Trip
                    </strong>

                    <small>
                      Create a new
                      adventure
                    </small>
                  </span>

                  <b>→</b>
                </Link>

                <Link
                  to="/trips"
                  className="quick-action"
                >
                  <span className="quick-action-icon">
                    🧳
                  </span>

                  <span>
                    <strong>
                      My Trips
                    </strong>

                    <small>
                      Manage your
                      journeys
                    </small>
                  </span>

                  <b>→</b>
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* ======================================
                    BUDGET OVERVIEW
                ====================================== */}

        <section className="budget-section">

          <div className="budget-header">

            <div>
              <span className="panel-eyebrow">
                TRAVEL FINANCES
              </span>

              <h2>
                Budget Overview
              </h2>

              <p>
                Keep track of the money
                allocated to your journeys.
              </p>
            </div>

            <div className="budget-total">
              <span>
                Total Planned
              </span>

              <strong>
                ₹
                {totalBudget.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

          <div className="budget-progress-container">

            <div className="budget-progress">

              <div
                className="budget-progress-fill"
                style={{
                  width:
                    totalBudget > 0
                      ? "68%"
                      : "0%",
                }}
              />

            </div>

            <div className="budget-progress-labels">

              <span>
                <b>₹0</b> spent
              </span>

              <span>
                Budget planning
              </span>

              <span>
                <b>
                  ₹
                  {totalBudget.toLocaleString(
                    "en-IN"
                  )}
                </b>{" "}
                allocated
              </span>

            </div>

          </div>

        </section>

        {/* ======================================
                    POPULAR DESTINATIONS
                ====================================== */}

        <section className="destinations-section">

          <div className="section-heading">

            <div>
              <span className="panel-eyebrow">
                GET INSPIRED
              </span>

              <h2>
                Explore Destinations
              </h2>

              <p>
                Find inspiration for your
                next unforgettable journey.
              </p>
            </div>

          </div>

          <div className="destination-grid">

            {destinations.map(
              (destination) => (
                <div
                  className="destination-card"
                  key={
                    destination.name
                  }
                >

                  <img
                    src={
                      destination.image
                    }
                    alt={
                      destination.name
                    }
                  />

                  <div className="destination-gradient" />

                  <div className="destination-content">

                    <h3>
                      {
                        destination.name
                      }
                    </h3>

                    <p>
                      📍{" "}
                      {
                        destination.country
                      }
                    </p>

                  </div>

                </div>
              )
            )}

          </div>

        </section>

        {/* ======================================
                    FOOTER
                ====================================== */}

        <footer className="dashboard-footer">

          <div>
            <strong>
              TripNest ✈️
            </strong>

            <span>
              Your journey, beautifully
              organized.
            </span>
          </div>

          <span>
            Plan smarter. Travel better.
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "TRAVELER",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await register(
        form.name,
        form.email,
        form.password,
        form.role
      );

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tn-auth-page">

      {/* LEFT SIDE */}
      <section className="tn-auth-left">
        <div className="tn-auth-overlay"></div>

        <div className="tn-auth-left-content">

          {/* LOGO */}
          <Link to="/login" className="tn-auth-logo">
            <span className="tn-auth-logo-icon">✈</span>

            <span>
              TripNest
            </span>
          </Link>

          {/* CONTENT */}
          <div className="tn-auth-left-main">

            <h1>
              Your next
              <br />
              <span>adventure awaits.</span>
            </h1>

            <p className="tn-auth-description">
              Create your TripNest account and turn your
              travel ideas into beautifully organized journeys.
            </p>

            {/* FEATURES */}
            <div className="tn-auth-features">

              <div className="tn-auth-feature">
                <div className="tn-feature-icon">🌍</div>
                <strong>Explore</strong>
                <small>Discover amazing destinations</small>
              </div>

              <div className="tn-auth-feature">
                <div className="tn-feature-icon">🗺️</div>
                <strong>Plan</strong>
                <small>Organize your perfect trip</small>
              </div>

              <div className="tn-auth-feature">
                <div className="tn-feature-icon">❤️</div>
                <strong>Remember</strong>
                <small>Keep your journeys forever</small>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* RIGHT SIDE */}
      <section className="tn-auth-right">

        <div className="tn-auth-card-new">

          {/* MOBILE LOGO */}
          <div className="tn-mobile-auth-brand">
            <span>✈</span>
            <strong>TripNest</strong>
          </div>


          {/* HEADING */}
          <div className="tn-auth-heading">

            <div className="tn-auth-heading-icon">
              ✨
            </div>

            <div>
              <h2>Create your account</h2>

              <p>
                Join TripNest and start planning your next adventure.
              </p>
            </div>

          </div>


          {/* ERROR */}
          {error && (
            <div className="tn-auth-error">
              ⚠️ {error}
            </div>
          )}


          {/* FORM */}
          <form
            className="tn-auth-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}
            <div className="tn-auth-field">

              <label htmlFor="register-name">
                Full name
              </label>

              <div className="tn-auth-input-wrap">

                <span className="tn-input-icon">
                  👤
                </span>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>
            </div>


            {/* EMAIL */}
            <div className="tn-auth-field">

              <label htmlFor="register-email">
                Email address
              </label>

              <div className="tn-auth-input-wrap">

                <span className="tn-input-icon">
                  ✉️
                </span>

                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  required
                />

              </div>
            </div>


            {/* PASSWORD */}
            <div className="tn-auth-field">

              <label htmlFor="register-password">
                Password
              </label>

              <div className="tn-auth-input-wrap">

                <span className="tn-input-icon">
                  🔒
                </span>

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button
                  type="button"
                  className="tn-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

              <div className="tn-password-hint">
                🔐 Use at least 8 characters for better security.
              </div>

            </div>


            {/* ROLE */}
            <div className="tn-auth-field">

              <label htmlFor="register-role">
                Account type
              </label>

              <div className="tn-auth-input-wrap">

                <span className="tn-input-icon">
                  🎒
                </span>

                <select
                  id="register-role"
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value,
                    })
                  }
                >
                  <option value="TRAVELER">
                    Traveler
                  </option>

                  <option value="GROUP_ADMIN">
                    Group Admin
                  </option>

                  <option value="ADMIN">
                    Admin
                  </option>
                </select>

              </div>

            </div>


            {/* BUTTON */}
            <button
              className="tn-auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account →"}
            </button>

          </form>


          {/* LOGIN LINK */}
          <div className="tn-auth-bottom">

            <span>
              Already have an account?{" "}
            </span>

            <Link to="/login">
              Sign in →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Register;
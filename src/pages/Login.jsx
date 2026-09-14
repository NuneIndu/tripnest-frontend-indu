import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await login(
        form.email,
        form.password
      );

      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="tn-auth-page">

      {/* LEFT SIDE */}
      <section className="tn-auth-left">
        <div className="tn-auth-overlay"></div>

        <div className="tn-auth-left-content">

          {/* LOGO */}
          <Link to="/login" className="tn-auth-logo">
            <span className="tn-auth-logo-icon">
              ✈
            </span>

            <span>TripNest</span>
          </Link>

          {/* MAIN CONTENT */}
          <div className="tn-auth-left-main">

            <h1>
              Travel more.
              <br />
              <span>Remember more.</span>
            </h1>

            <p className="tn-auth-description">
              Plan unforgettable journeys, discover amazing
              destinations, and keep all your travel plans
              organized in one place.
            </p>

            {/* FEATURES */}
            <div className="tn-auth-features">

              <div className="tn-auth-feature">
                <div className="tn-feature-icon">
                  🌍
                </div>

                <strong>Explore</strong>

                <small>
                  Discover amazing destinations
                </small>
              </div>

              <div className="tn-auth-feature">
                <div className="tn-feature-icon">
                  🗺️
                </div>

                <strong>Plan</strong>

                <small>
                  Build your perfect itinerary
                </small>
              </div>

              <div className="tn-auth-feature">
                <div className="tn-feature-icon">
                  ❤️
                </div>

                <strong>Remember</strong>

                <small>
                  Save your favorite journeys
                </small>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* RIGHT SIDE */}
      <section className="tn-auth-right">

        <div className="tn-auth-card-new">

          {/* HEADING */}
          <div className="tn-auth-heading">

            <div className="tn-auth-heading-icon">
              👋
            </div>

            <div>
              <h2>Welcome back</h2>

              <p>
                Sign in to continue your journey.
              </p>
            </div>

          </div>


          {/* ERROR */}
          {error && (
            <div className="tn-auth-error">
              ⚠️ {error}
            </div>
          )}


          {/* EMAIL LOGIN */}
          <form
            className="tn-auth-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}
            <div className="tn-auth-field">

              <label htmlFor="login-email">
                Email address
              </label>

              <div className="tn-auth-input-wrap">

                <span className="tn-input-icon">
                  ✉️
                </span>

                <input
                  id="login-email"
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

              <label htmlFor="login-password">
                Password
              </label>

              <div className="tn-auth-input-wrap">

                <span className="tn-input-icon">
                  🔒
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
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

            </div>


            {/* SIGN IN */}
            <button
              className="tn-auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in →"}
            </button>

          </form>


          {/* DIVIDER */}
          <div className="tn-auth-divider">
            <span>OR</span>
          </div>


          {/* GOOGLE */}
          <button
            type="button"
            className="tn-google-button"
            onClick={handleGoogleLogin}
          >

            <span className="tn-google-icon">
              G
            </span>

            <span>
              Continue with Google
            </span>

          </button>


          {/* REGISTER */}
          <div className="tn-auth-bottom">

            Don't have an account?{" "}

            <Link to="/register">
              Create account →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Login;
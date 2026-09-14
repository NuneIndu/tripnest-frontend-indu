import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import OAuth2Success from "./pages/OAuth2Success";

import Trips from "./pages/Trips";
import CreateTrip from "./pages/CreateTrip";
import Itinerary from "./pages/Itinerary";


// --------------------------------------------------
// PRIVATE ROUTE
// --------------------------------------------------

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // If user is not logged in, go to login page
  if (!user && !token && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// --------------------------------------------------
// APPLICATION ROUTES
// --------------------------------------------------

const AppRoutes = () => {
  return (
    <Routes>

      {/* ------------------------------------------- */}
      {/* PUBLIC ROUTES */}
      {/* ------------------------------------------- */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/oauth2/success"
        element={<OAuth2Success />}
      />


      {/* ------------------------------------------- */}
      {/* DASHBOARD */}
      {/* ------------------------------------------- */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />


      {/* ------------------------------------------- */}
      {/* MY TRIPS */}
      {/* ------------------------------------------- */}

      <Route
        path="/trips"
        element={
          <PrivateRoute>
            <Trips />
          </PrivateRoute>
        }
      />


      {/* ------------------------------------------- */}
      {/* CREATE TRIP */}
      {/* ------------------------------------------- */}

      <Route
        path="/create-trip"
        element={
          <PrivateRoute>
            <CreateTrip />
          </PrivateRoute>
        }
      />


      {/* ------------------------------------------- */}
      {/* ITINERARY */}
      {/* ------------------------------------------- */}

      <Route
        path="/trips/:tripId/itinerary"
        element={
          <PrivateRoute>
            <Itinerary />
          </PrivateRoute>
        }
      />


      {/* ------------------------------------------- */}
      {/* DEFAULT ROUTE */}
      {/* ------------------------------------------- */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />


      {/* ------------------------------------------- */}
      {/* UNKNOWN ROUTES */}
      {/* ------------------------------------------- */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
};


// --------------------------------------------------
// MAIN APP
// --------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
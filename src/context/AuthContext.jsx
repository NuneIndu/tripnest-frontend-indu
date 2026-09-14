import {
  createContext,
  useState,
  useContext,
  useEffect
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");

      return stored
        ? JSON.parse(stored)
        : null;

    } catch {
      return null;
    }
  };


  const [user, setUser] = useState(getStoredUser);

  const navigate = useNavigate();


  /* STORAGE LISTENER */

  useEffect(() => {

    const handleStorage = () => {
      setUser(getStoredUser());
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };

  }, []);


  /* ================= LOGIN ================= */

  const login = async (
    email,
    password
  ) => {

    try {

      const res = await api.post(
        "/api/auth/login",
        {
          email,
          password
        }
      );


      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );


      setUser(res.data);

      navigate("/dashboard");


      return {
        success: true
      };

    } catch (err) {

      console.error(
        "Login error:",
        err
      );

      return {
        success: false,
        message:
          "Invalid email or password!"
      };

    }

  };


  /* ================= REGISTER ================= */

  const register = async (
    name,
    email,
    password,
    role
  ) => {

    try {

      const res = await api.post(
        "/api/auth/register",
        {
          name,
          email,
          password,
          role
        }
      );


      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );


      setUser(res.data);

      navigate("/dashboard");


      return {
        success: true
      };

    } catch (err) {

      console.error(
        "Registration error:",
        err
      );

      return {
        success: false,
        message:
          "Registration failed!"
      };

    }

  };


  /* ================= LOGOUT ================= */

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");

  };


  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        setUser
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};


export const useAuth = () =>
  useContext(AuthContext);
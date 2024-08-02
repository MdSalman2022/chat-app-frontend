import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkToken = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/user/verify`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const handleLogin = async (phoneNumber, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return {
          success: true,
          data,
        };
      } else {
        console.error("Login failed:", data.message);
        return {
          success: false,
          error: data.message,
        };
      }
    } catch (error) {
      console.error("Login failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const handleRegister = async (username, phoneNumber, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, phoneNumber, password }),
        }
      );
      const datajson = await response.json();
      console.log("datajson", datajson);
      handleLogin(phoneNumber, password);
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      // Handle error (e.g., show error message to user)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
    }
  };

  const authInfo = { user, setUser, handleLogin, handleRegister };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

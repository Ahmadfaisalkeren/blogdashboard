import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RockToast } from "rocktoast";
import Loader from "../../Components/Loader/Loader";
import { API_URL } from "../../Components/API/ConfigAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    checkUserStatus();
  }, []);

  useEffect(() => {
    let logoutTimer;

    const resetLogoutTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(logoutUser, 60 * 60 * 1000);
    };

    const resetTimeOnActivity = () => {
      document.addEventListener("mousemove", resetLogoutTimer);
      document.addEventListener("keydown", resetLogoutTimer);
      resetLogoutTimer();
    };

    resetTimeOnActivity();

    return () => {
      clearTimeout(logoutTimer);
      document.removeEventListener("mousemove", resetLogoutTimer);
      document.removeEventListener("keydown", resetLogoutTimer);
    };
  }, [user]);

  const loginUser = async (userInfo) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/login`, userInfo);

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_id", user.id);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);
        setToastMessage("Login Successful");
        setShowToast(true);
        navigate("/home");
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error.response?.data?.error || "Login Failed";
      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = (showToast = true) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    if (showToast) {
      setToastMessage("Logged Out Successfully");
      setShowToast(true);
    }
  };

  const checkUserStatus = async () => {
    const token = localStorage.getItem("access_token");
    const userId = localStorage.getItem("user_id");

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get(`${API_URL}/api/user/${userId}`);

        if (response.data && response.data.user) {
          setUser(response.data.user);
        } else {
          console.error("User data is undefined or missing in the response");
          logoutUser(false);
        }
      } catch (error) {
        console.error("Error Fetching User:", error);
        logoutUser(false);
      }
    } else {
      logoutUser(false);
    }
    setLoading(false);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        children
      )}
      {showToast && (
        <RockToast
          message={toastMessage}
          duration={1500}
          onClose={() => setShowToast(false)}
          position="top-left"
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

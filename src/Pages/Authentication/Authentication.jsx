import React, { useState } from "react";
import "./Style.css";
import { useAuth } from "./AuthContext";
import loginBackground from "../../Assets/image/loginBackground.jpg";
import { CiLogin } from "react-icons/ci";

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, loading } = useAuth();
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      await loginUser(formData);
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <form onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-4 text-[#E11D48] text-center">
            Login Form
          </h2>
          {error && (
            <div className="text-red-600 mb-4 text-center">{error}</div>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-sky-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-[#F43F5E] hover:bg-[#BE123C] hover:border-[#F43F5E] duration-300 text-white py-2 rounded flex justify-center"
          >
            <CiLogin size={20} className="mr-1" />
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Authentication;

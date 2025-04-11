import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaBars, FaUser } from "react-icons/fa";
import { BsArrowsFullscreen } from "react-icons/bs";
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import useFullscreen from "../../Components/Fullscreen";

const Navbar = ({ toggleSidebar }) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [isOpen, setIsOpen] = useState(false);
  const userRef = useRef(null);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className="flex">
      <div className="w-full bg-white p-2 h-[45px] shadow-md text-sky-600 rounded-xl text-xl z-10">
        <div className="flex justify-between items-center">
          <button className="text-primary" onClick={toggleSidebar}>
            <FaBars size={25} />
          </button>
          <div className="flex relative">
            <div ref={userRef}>
              <button onClick={toggleFullscreen} className="text-primary mr-2">
                <BsArrowsFullscreen size={23} />
              </button>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-primary mr-2"
              >
                <FaUser size={25} />
              </button>
              {isOpen && (
                <ul
                  className="text-sm bg-white rounded-lg shadow-lg p-1 absolute shadow-md"
                  style={{
                    top: "40px",
                    left: "-87px",
                    width: "160px",
                    borderRadius: "10px",
                  }}
                >
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex justify-center rounded-lg hover:bg-sky-300 duration-300 py-2 w-full"
                    >
                      <FaArrowLeft className="mt-1 mr-2 text-primary" />
                      <span className="text-primary flex mr-1 text-sm font-medium">
                        Logout
                      </span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

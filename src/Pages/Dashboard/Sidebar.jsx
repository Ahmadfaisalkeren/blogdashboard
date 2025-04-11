import React, { useState } from "react";
import { AiOutlineHome } from "react-icons/ai";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowDropleft, IoMdArrowDropup } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import { FaRegObjectGroup } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";

const Sidebar = ({ isMinimized }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const adminMenu = [
    {
      title: "Home",
      link: "/home",
      icon: <AiOutlineHome />,
    },
    {
      title: "Heroes",
      link: "/heroes",
      icon: <BiCategoryAlt />,
    },
    {
      title: "Posts",
      link: "/posts",
      icon: <FaRegObjectGroup />,
    },
    {
      title: "Series",
      link: "/series",
      icon: <GrTransaction />,
    },
  ];

  const handleSetActiveMenu = (menuLink) => {
    setActiveMenu(menuLink);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className={`min-h-screen bg-white text-white transition-all duration-300 ${
        isMinimized ? "w-[78px]" : "w-32"
      } shadow-2xl`}
      style={{ minWidth: isMinimized ? "78px" : "14rem" }}
    >
      <div
        className={`px-6 text-sky-600 text-xl font-semibold justify-center h-16 flex items-center ${
          isMinimized && "justify-center"
        }`}
      >
        {isMinimized ? (
          <span className="text-sky-600">BD</span>
        ) : (
          <a className="text-sky-600" href="#" onClick={() => navigate("/")}>
            Blog Dashboard
          </a>
        )}
      </div>
      <nav className="mt-1">
        <ul>
          {adminMenu.map((menu, index) => (
            <div key={index}>
              <li className="duration-300 mb-2 px-3">
                <NavLink
                  to={menu.link}
                  exact="true"
                  className={({ isActive }) =>
                    `flex items-center text-sky-600 hover:bg-sky-600 rounded-lg hover:text-white py-2 pl-4 duration-300 ${
                      isActive ? "bg-sky-600 text-white" : ""
                    }`
                  }
                  onClick={() => handleSetActiveMenu(menu.link)}
                >
                  <span className="text-xl font-base mr-2 flex">
                    {menu.icon}
                  </span>
                  {!isMinimized && (
                    <span className="text-base font-medium">{menu.title}</span>
                  )}
                  {menu.subMenu &&
                    (isDropdownOpen ? (
                      <IoMdArrowDropup className="ml-2 mt-1 transition-transform duration-300 transform" />
                    ) : (
                      <IoMdArrowDropleft className="ml-2 mt-1 transition-transform duration-300" />
                    ))}
                </NavLink>
              </li>
              {menu.subMenu && (
                <ul
                  className={`pl-3 mt-1 transition-max-height duration-300 overflow-hidden ${
                    isDropdownOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  {menu.subMenu.map((subMenu, subIndex) => (
                    <li className="duration-300 mb-2" key={subIndex}>
                      <NavLink
                        to={subMenu.link}
                        exact="true"
                        className={({ isActive }) =>
                          `flex items-center text-sky-600 hover:bg-sky-300 rounded-lg hover:text-white py-2 duration-300 ${
                            isActive ? "bg-sky-600 text-white" : ""
                          }`
                        }
                        onClick={() => handleSetActiveMenu(subMenu.link)}
                      >
                        <span className="flex ml-2 text-base font-medium">
                          {subMenu.icon && (
                            <subMenu.icon className="mt-1 mr-2" />
                          )}
                          {!isMinimized && subMenu.title}
                        </span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

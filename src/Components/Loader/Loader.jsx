import React from "react";
import './Loader.css'

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <div className="text-tengah text-biru">Please Wait</div>
    </div>
  );
};

export default Loader;

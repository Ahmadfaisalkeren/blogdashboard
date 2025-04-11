import React, { useEffect } from "react";
import { BiCategoryAlt } from "react-icons/bi";
import { FaRegObjectGroup } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import useHomeStore from "./Store/useHomeStore";

const Home = () => {
  const { fetchDashboard, dashboard, loading, error } = useHomeStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md mt-5">
      <div className="p-3 grid grid-cols-3 gap-3">
        <div className="rounded-lg bg-gradient-to-r from-indigo-400 to-cyan-400 min-h-[100px]">
          <div className="flex justify-between">
            <p className="p-2 text-white font-bold text-base">Heroes Total</p>
            <BiCategoryAlt
              size={80}
              className="text-white hover:scale-110 duration-300"
            />
          </div>
          <p className="p-2 text-white font-semibold text-xl flex justify-end">
            {dashboard?.heroes ?? 0}
          </p>
        </div>
        <div className="rounded-lg bg-gradient-to-b from-indigo-500 to-pink-500 min-h-[100px]">
          <div className="flex justify-between">
            <p className="p-2 text-white font-bold text-base">Posts</p>
            <FaRegObjectGroup
              size={80}
              className="text-white hover:scale-110 duration-300"
            />
          </div>
          <p className="p-2 text-white font-semibold text-xl flex justify-end">
            {dashboard?.posts ?? 0}
          </p>
        </div>
        <div className="rounded-lg bg-gradient-to-r from-blue-800 to-indigo-900 min-h-[100px]">
          <div className="flex justify-between">
            <p className="p-2 text-white font-bold text-base">Series</p>
            <GrTransaction
              size={80}
              className="text-white hover:scale-110 duration-300"
            />
          </div>
          <p className="p-2 text-white font-semibold text-xl flex justify-end">
            {dashboard?.series ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

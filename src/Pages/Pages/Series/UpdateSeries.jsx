import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RockToast } from "rocktoast";
import "../../../Components/EditorJS/Styles.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import useSeriesStore from "./Stores/useSeriesStore";
import { API_URL } from "../../../Components/API/ConfigAPI";

const UpdateSeries = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchSeriesById,
    updateSeries,
    toastMessage,
    showToast,
    hideToast,
    loading,
    error,
  } = useSeriesStore();

  const [series, setSeries] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [seriesDate, setSeriesDate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSeries = async () => {
      const fetchedSeries = await fetchSeriesById(id);
      if (fetchedSeries) {
        setSeries(fetchedSeries);
        setTitle(fetchedSeries.title);
        setSlug(convertToSlug(fetchedSeries.title));
        setAuthor(fetchedSeries.author);
        setSeriesDate(fetchedSeries.series_date);
      }
    };

    fetchSeries();
  }, [id, fetchSeriesById]);
  const convertToSlug = (text) =>
    text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  useEffect(() => {
    setSlug(convertToSlug(title));
  }, [title]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        id,
        title,
        slug,
        author,
        series_date: seriesDate,
      };

      await updateSeries(payload, navigate);
    } catch (err) {
      console.error("Error updating series:", err);
      setErrors({
        general: "An error occurred while saving the series. Please try again.",
      });
    }
  };

  return (
    <div className="py-5">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-3">
          <div className="flex justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded px-3 py-2 bg-gray-300 hover:bg-gray-100 duration-300"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-gray-800 text-xl font-semibold">
              Update Series
            </h1>
          </div>
          <form onSubmit={handleSave}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 border rounded mb-4"
              placeholder="Title"
            />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="block w-full px-3 py-2 border rounded mb-4"
              placeholder="Author"
            />
            <input
              type="date"
              value={seriesDate}
              onChange={(e) => setSeriesDate(e.target.value)}
              className="block w-full px-3 py-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex text-sm bg-blue-500 text-white px-2 py-1 rounded"
              >
                <IoIosRefresh size={20} />
                <span> Update Series</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      {showToast && (
        <RockToast
          message={toastMessage}
          onClose={hideToast}
          position="top-right"
          duration={1500}
        />
      )}
      {error && <div className="text-red-500 mt-3">{error}</div>}
    </div>
  );
};

export default UpdateSeries;

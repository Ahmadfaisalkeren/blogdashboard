import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RockToast } from "rocktoast";
import "../../../Components/EditorJS/Styles.css";
import {
  FaArrowLeft,
  FaEye,
  FaPencilAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import useSeriesStore from "./Stores/useSeriesStore";
import Loader from "../../../Components/Loader/Loader";
import DetailSeriesPart from "../SeriesPart/DetailSeriesPart";
import DeleteSeriesPart from "../SeriesPart/DeleteSeriesPart";
import useSeriesPartStore from "../SeriesPart/Stores/useSeriesPartStore";

const DetailSeries = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailSeriesPart, setDetailSeriesPart] = useState(null);
  const [detailSeriesPartModal, setDetailSeriesPartModal] = useState(false);
  const [deleteSeriesPart, setDeleteSeriesPart] = useState(null);
  const [deleteSeriesPartModal, setDeleteSeriesPartModal] = useState(false);
  const [series, setSeries] = useState(null);

  const { fetchSeriesById } = useSeriesStore();

  const {
    seriesPart,
    showToast,
    loading,
    toastMessage,
    hideToast,
    fetchSeriesPartBySeriesId,
  } = useSeriesPartStore();

  useEffect(() => {
    const loadData = async () => {
      const seriesData = await fetchSeriesById(id);
      setSeries(seriesData);

      await fetchSeriesPartBySeriesId(id);
    };

    loadData();
  }, [id, fetchSeriesById, fetchSeriesPartBySeriesId]);

  const handleDetail = (seriesPart) => {
    setDetailSeriesPart(seriesPart);
    setDetailSeriesPartModal(true);
  };

  const handleDelete = (seriesPart) => {
    setDeleteSeriesPart(seriesPart);
    setDeleteSeriesPartModal(true);
  };

  return (
    <div className="py-5">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-screen">
        <div className="p-3">
          <div className="flex justify-between mb-3">
            <button
              onClick={() => navigate("/series")}
              className="rounded px-3 py-2 bg-gray-300 hover:bg-gray-100 duration-300"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-gray-800 text-xl font-semibold">
              Detail Series
            </h1>
          </div>
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-11">
              <div className="p-3 rounded-md bg-white shadow-md border border-green-500">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam unde aperiam vero iste expedita nemo, provident magni
                  voluptatum ex a, sequi, tenetur est eius officia deserunt
                  voluptas praesentium repellendus? Nam eligendi animi,
                  temporibus tenetur quod unde facilis maxime velit, reiciendis
                  consequatur beatae laborum porro exercitationem rerum.
                  Tempore, non? Voluptas magnam suscipit nihil, enim maiores a
                  nisi deserunt blanditiis aspernatur quas.
                </p>
              </div>
            </div>
            <div className="col-span-1">
              <button
                onClick={() => navigate(`/series/${id}/add-part`)}
                className="flex px-2 py-1 text-white rounded-md bg-green-500 hover:bg-green-300 duration-300"
              >
                <FaPlus size={16} className="mt-2" />
                <span className="text-xs">Series Part</span>
              </button>
            </div>
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              <div className="space-y-3">
                {seriesPart && seriesPart.length > 0 ? (
                  seriesPart.map((part) => (
                    <div
                      key={part.id}
                      className="flex justify-between p-3 rounded-md bg-white shadow-md border border-green-500"
                    >
                      <p className="text-lg font-semibold text-gray-800">
                        {part.part_number} | {part.title}
                      </p>
                      <div className="flex">
                        <button
                          onClick={() => handleDetail(part)}
                          className="flex text-xs px-2 py-1 rounded-md bg-white border border-green-600 text-green-600 hover:text-white hover:bg-green-600 hover:border-green-600 duration-300 mb-1 mr-1"
                        >
                          <FaEye size={16} className="mr-1" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/update-series-part/${part.id}`)
                          }
                          className="flex text-xs px-2 py-1 rounded-md bg-white border border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 duration-300 mb-1 mr-1"
                        >
                          <FaPencilAlt size={16} className="mr-1" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(part)}
                          className="flex text-xs px-2 py-1 rounded-md bg-white border border-red-600 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 duration-300 mb-1 mr-1"
                        >
                          <FaTrash size={16} className="mr-1" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="flex mx-auto text-gray-800 justify-center">
                    No series parts available.
                  </p>
                )}
              </div>
            )}
          </div>
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
      {detailSeriesPart && (
        <DetailSeriesPart
          isOpen={detailSeriesPartModal}
          onClose={() => setDetailSeriesPartModal(false)}
          seriesPartData={detailSeriesPart}
        />
      )}
      {deleteSeriesPart && (
        <DeleteSeriesPart
          isOpen={deleteSeriesPartModal}
          onClose={() => setDeleteSeriesPartModal(false)}
          seriesPartData={deleteSeriesPart}
        />
      )}
    </div>
  );
};

export default DetailSeries;

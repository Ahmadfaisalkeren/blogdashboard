import React from "react";
import { RockModal } from "rockmodal";
import { RockToast } from "rocktoast";
import useSeriesPartStore from "./Stores/useSeriesPartStore";

const DeleteSeriesPart = ({ isOpen, onClose, seriesPartData }) => {
  const deleteSeriesPart = useSeriesPartStore((state) => state.deleteSeriesPart);
  const showToast = useSeriesPartStore((state) => state.showToast);
  const toastMessage = useSeriesPartStore((state) => state.toastMessage);
  const hideToast = useSeriesPartStore((state) => state.hideToast);
  const loading = useSeriesPartStore((state) => state.loading);

  const handleDelete = async () => {
    await deleteSeriesPart(seriesPartData.id);
    onClose();
  };

  return (
    <>
      <RockModal
        isOpen={isOpen}
        onClose={onClose}
        width="40"
        height="40"
        effect="bounceIn"
        position="center"
        color="white"
      >
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Confirm Delete
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the seriesPart titled{" "}
            <strong className="text-red-500">{seriesPartData.title}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-700"
              } text-white px-4 py-2 rounded shadow-lg duration-300`}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow-lg duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </RockModal>

      {showToast && (
        <RockToast
          message={toastMessage}
          duration={2000}
          onClose={hideToast}
          position="top-right"
        />
      )}
    </>
  );
};

export default DeleteSeriesPart;

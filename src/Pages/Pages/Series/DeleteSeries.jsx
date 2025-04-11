import React from "react";
import { RockModal } from "rockmodal";
import { RockToast } from "rocktoast";
import useSeriesStore from "./Stores/useSeriesStore";

const DeleteSeries = ({ isOpen, onClose, seriesData }) => {
  const deleteSeries = useSeriesStore((state) => state.deleteSeries);
  const showToast = useSeriesStore((state) => state.showToast);
  const toastMessage = useSeriesStore((state) => state.toastMessage);
  const hideToast = useSeriesStore((state) => state.hideToast);
  const loading = useSeriesStore((state) => state.loading);

  const handleDelete = async () => {
    await deleteSeries(seriesData.id);
    onClose();
  };

  return (
    <>
      <RockModal
        isOpen={isOpen}
        onClose={onClose}
        width="40"
        height="40"
        effect="slideInRight"
        position="center"
        color="white"
      >
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Confirm Delete
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the series titled{" "}
            <strong className="text-red-500">{seriesData.title}</strong>? This
            action cannot be undone.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className={`${
                loading
                  ? "bg-gray-400 text-sm cursor-not-allowed"
                  : "bg-red-500 text-sm hover:bg-red-700"
              } text-white px-4 py-2 rounded shadow-lg duration-300`}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-sm hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow-lg duration-300"
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

export default DeleteSeries;

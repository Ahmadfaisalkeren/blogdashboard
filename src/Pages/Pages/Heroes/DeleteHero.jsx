import React from "react";
import { RockModal } from "rockmodal";
import { RockToast } from "rocktoast";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";
import useHeroStore from "./Store/useHeroStore";

const DeleteHero = ({ isOpen, onClose, heroData }) => {
  const deleteHero = useHeroStore((state) => state.deleteHero);
  const showToast = useHeroStore((state) => state.showToast);
  const toastMessage = useHeroStore((state) => state.toastMessage);
  const hideToast = useHeroStore((state) => state.hideToast);

  const handleDelete = async () => {
    try {
      await deleteHero(heroData.id, onClose);
    } catch (error) {
      console.error("Error deleting Hero:", error);
    }
  };

  return (
    <>
      <RockModal
        isOpen={isOpen}
        onClose={onClose}
        width="30"
        height="auto"
        color="white"
        effect="slideInRight"
        position="center"
      >
        <div className="p-6 text-center">
          <FaExclamationTriangle
            className="text-red-500 mx-auto mb-4"
            size={40}
          />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Hero</h2>
          <p className="text-gray-600 font-semibold mb-1">
            Are you sure you want to delete{" "}
            <span className="text-red-500">{heroData?.title}</span>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handleDelete}
              className="bg-red-500 text-sm hover:bg-red-600 text-white px-4 py-2 rounded shadow transition duration-300"
            >
              <FaTrash className="inline-block mr-2" />
              Confirm Delete
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-sm hover:bg-gray-400 text-gray-800 px-4 py-2 rounded shadow transition duration-300"
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

export default DeleteHero;

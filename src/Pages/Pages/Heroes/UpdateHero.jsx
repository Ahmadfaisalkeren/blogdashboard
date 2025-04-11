import React, { useEffect, useRef, useState } from "react";
import { RockModal } from "rockmodal";
import { RockToast } from "rocktoast";
import { API_URL } from "../../../Components/API/ConfigAPI";
import { FaPlus } from "react-icons/fa";
import useHeroStore from "./Store/useHeroStore";

const UpdateHero = ({ isOpen, onClose, heroData }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const inputFile = useRef(null);
  const [errors, setErrors] = useState({});
  const {
    updateHero,
    showToast,
    toastMessage,
    hideToast,
  } = useHeroStore();

  useEffect(() => {
    if (heroData) {
      setTitle(heroData.title);
      setImage(heroData.image ? `${API_URL}/storage/${heroData.image}` : null);
      setPreviewUrl(
        heroData.image ? `${API_URL}/storage/${heroData.image}` : null
      );
    }
  }, [heroData]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      setPreviewUrl(URL.createObjectURL(selectedImage));
    } else {
      setImage(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("title", title);
    if (image instanceof File) {
      formData.append("image", image);
    }

    try {
      await updateHero(heroData.id, formData, onClose);
    } catch (error) {
      console.error("Error updating hero:", error);
    }
  };

  return (
    <>
      <RockModal
        isOpen={isOpen}
        onClose={onClose}
        width="50"
        height="50"
        effect="bounceIn"
        position="center"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-primary">Update Hero</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="text-base text-primary font-medium"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.title && (
                <div className="text-primary text-sm mt-1">{errors.title}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="text-base text-primary font-medium"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                ref={inputFile}
                className="block w-full text-sm text-primary
                file:mr-4 file:py-2 file:px-4 file:rounded-md
                file:border-0 file:text-sm file:font-semibold
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100 mt-1"
              />
              {errors.image && (
                <div className="text-primary text-sm mt-1">{errors.image}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="imagePreview"
                className="text-base text-primary font-medium"
              >
                Image Preview
              </label>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Image Preview"
                  className="mt-2 flex"
                  width="150px"
                />
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white text-sm bg-blue-500 hover:bg-blue-700 duration-300 text-primary py-1 px-2 rounded flex items-center space-x-1"
              >
                <FaPlus className="mr-1" />
                Update
              </button>
            </div>
          </form>
        </div>
      </RockModal>
      {showToast && (
        <RockToast
          message={toastMessage}
          onClose={hideToast}
          duration={1500}
          position="top-right"
        />
      )}
    </>
  );
};

export default UpdateHero;

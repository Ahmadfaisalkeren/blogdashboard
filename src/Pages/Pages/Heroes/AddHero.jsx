import React, { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RockModal } from "rockmodal";
import { RockToast } from "rocktoast";
import useHeroStore from "./Store/useHeroStore";

const AddHero = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const inputFile = useRef(null);
  const [errors, setErrors] = useState({});

  const { addHero, showToast, toastMessage, hideToast } = useHeroStore();

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrors({ image: "The image field is required." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);

    try {
      await addHero(formData, onClose);
      resetForm();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Unexpected error:", error);
        setErrors({ general: "An unexpected error occurred." });
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setImage(null);
    setPreviewUrl("");
    if (inputFile.current) {
      inputFile.current.value = "";
    }
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <RockModal
        isOpen={isOpen}
        onClose={handleClose}
        width="50"
        height="50"
        effect="bounceIn"
        position="center"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Add Hero</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label
                htmlFor="title"
                className="text-base text-gray-800 font-medium"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={handleTitle}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {errors.title && (
                <div className="text-red-500 text-sm mt-1">{errors.title}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="text-base text-gray-800 font-medium"
              >
                Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImage}
                ref={inputFile}
                className="block w-full text-sm text-gray-800
                file:mr-4 file:py-2 file:px-4 file:rounded-md
                file:border-0 file:text-sm file:font-semibold
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100 mt-1"
              />
              {errors.image && (
                <div className="text-red-500 text-sm mt-1">{errors.image}</div>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="imagePreview"
                className="text-base text-gray-800 font-medium"
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
                className="text-white text-sm bg-blue-500 hover:bg-blue-700 duration-300 py-1 px-2 rounded flex items-center space-x-1"
              >
                <FaPlus className="mr-1" />
                Submit
              </button>
            </div>
          </form>
        </div>
      </RockModal>

      {showToast && (
        <RockToast
          message={toastMessage}
          onClose={hideToast}
          position="top-right"
          duration={1500}
        />
      )}
    </>
  );
};

export default AddHero;

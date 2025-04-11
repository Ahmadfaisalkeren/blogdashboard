import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RockToast } from "rocktoast";
import "../../../Components/EditorJS/Styles.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import useSeriesPartStore from "./Stores/useSeriesPartStore";
import EditorJS from "@editorjs/editorjs";
import EditorTools from "../../../Components/EditorJS/EditorTools";

const AddSeriesPart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [part_number, setPartNumber] = useState("");
  const [title, setTitle] = useState("");
  const [series_id, setSeriesId] = useState(id);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  const { addSeriesPart, toastMessage, showToast, hideToast, loading, error } =
    useSeriesPartStore();

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        tools: EditorTools,
      });
    }

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const outputData = await editorRef.current.save();
      const contentBlocks = outputData.blocks.map((block, index) => ({
        type: block.type,
        order: index + 1,
        data: block.data,
      }));

      const seriesPartData = {
        part_number: part_number,
        title: title,
        series_id: series_id,
        content_blocks: contentBlocks,
      };

      await addSeriesPart(series_id, seriesPartData, navigate);
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrors({ general: "An unexpected error occurred." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-5">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg min-h-screen">
        <div className="p-3">
          <div className="flex justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded px-3 py-2 bg-gray-300 hover:bg-gray-100 duration-300"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-gray-800 text-xl font-semibold">Add Part</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="part_number"
                className="block text-sm font-medium"
              >
                Series Part
              </label>
              <input
                type="number"
                id="part_number"
                name="part_number"
                value={part_number}
                onChange={(e) => {
                  setPartNumber(e.target.value);
                }}
                className="mt-1 px-3 py-2 border rounded-md w-full"
              />
              {errors.part_number && (
                <p className="text-red-500 text-sm">{errors.part_number[0]}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="mt-1 px-3 py-2 border rounded-md w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title[0]}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Content
              </label>
              <div id="editorjs" className="editorjs-container"></div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-3 text-white bg-blue-500 hover:bg-blue-700 duration-300 py-1 px-2 text-sm rounded flex items-center space-x-1 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <ImSpinner2 className="animate-spin mr-2" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-1" />
                    <span className="text-white">Add Part</span>
                  </>
                )}
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

export default AddSeriesPart;

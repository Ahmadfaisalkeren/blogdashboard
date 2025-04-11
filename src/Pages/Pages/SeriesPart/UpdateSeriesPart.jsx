import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import EditorToolsForUpdate from "../../../Components/EditorJS/EditorToolsUpdate";
import { RockToast } from "rocktoast";
import "../../../Components/EditorJS/Styles.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import useSeriesPartStore from "./Stores/useSeriesPartStore";
import { API_URL } from "../../../Components/API/ConfigAPI";

const UpdateSeriesPart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const {
    fetchSeriesPartById,
    updateSeriesPart,
    toastMessage,
    showToast,
    hideToast,
    error,
  } = useSeriesPartStore();

  const [seriesPart, setSeriesPart] = useState(null);
  const [part_number, setPartNumber] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSeriesPart = async () => {
      const fetchedSeriesPart = await fetchSeriesPartById(id);

      if (
        fetchedSeriesPart &&
        Array.isArray(fetchedSeriesPart) &&
        fetchedSeriesPart.length > 0
      ) {
        const seriesPartData = fetchedSeriesPart[0];
        setSeriesPart(seriesPartData);

        setTitle(seriesPartData.title || "");
        setPartNumber(seriesPartData.part_number || "");

        const transformedBlocks = transformBlocks(
          seriesPartData.content_blocks || []
        );
        initializeEditor(transformedBlocks);
      } else {
        console.warn("SeriesPart data is empty or not in the expected format");
      }
    };

    fetchSeriesPart();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [id, fetchSeriesPartById]);

  const transformBlocks = (contentBlocks) =>
    contentBlocks
      .map((block) => {
        switch (block.type) {
          case "header":
            return {
              id: block.id,
              type: "header",
              data: {
                text: block.headers?.[0]?.header || "Untitled Header",
                level: block.headers?.[0]?.level || 1,
              },
            };
          case "list":
            return {
              id: block.id,
              type: "list",
              data: {
                style: block.list_items[0]?.style || "unordered",
                items: block.list_items.map((item) => item.list),
              },
            };
          case "paragraph":
            return {
              id: block.id,
              type: "paragraph",
              data: {
                text: block.paragraphs?.[0]?.paragraph || "",
              },
            };
          case "code":
            return {
              id: block.id,
              type: "code",
              data: {
                code: block.codes?.code || "",
              },
            };
          case "image":
            return {
              id: block.id,
              type: "image",
              data: {
                file: {
                  url: `${API_URL}/storage/${block.images?.image_url || ""}`,
                  id: block.images?.id || null,
                },
                caption: block.images?.caption || "",
              },
            };
          default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })
      .filter(Boolean);

  const initializeEditor = (blocks) => {
    if (editorRef.current) {
      editorRef.current.destroy();
    }
    editorRef.current = new EditorJS({
      holder: "update-editorjs",
      tools: EditorToolsForUpdate,
      data: {
        time: Date.now(),
        blocks,
      },
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const savedData = await editorRef.current.save();
      const contentBlocks = savedData.blocks.map((block, index) => ({
        id: seriesPart.content_blocks[index]?.id || null,
        order: index + 1,
        type: block.type,
        data: block.data,
      }));

      const payload = {
        id,
        series_id: seriesPart.series_id,
        part_number,
        title,
        content_blocks: contentBlocks,
      };

      await updateSeriesPart(payload, navigate);
    } catch (err) {
      console.error("Error updating seriesPart:", err);
      setErrors({
        general:
          "An error occurred while saving the seriesPart. Please try again.",
      });
    }
  };

  return (
    <div className="py-5">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-3">
          <div className="flex justify-between mb-3">
            <button
              onClick={() => navigate(`/series-part/${seriesPart.series_id}`)}
              className="rounded px-3 py-2 bg-gray-300 hover:bg-gray-100 duration-300"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-gray-800 text-xl font-semibold">
              Update SeriesPart
            </h1>
          </div>
          <form onSubmit={handleSave}>
            <div className="mb-4">
              <label
                htmlFor="part_number"
                className="block text-sm font-medium"
              >
                Series Part
              </label>
              <input
                type="number"
                name="part_number"
                id="part_number"
                value={part_number}
                disabled
                readOnly
                onChange={(e) => setPartNumber(e.target.value)}
                className="mt-1 px-3 py-2 border rounded-md w-full"
              />
              {errors.part_number && (
                <p className="text-red-500 text-sm">{errors.part_number[0]}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Judul
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
              <div id="update-editorjs" className="editorjs-container"></div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex bg-blue-500 text-white px-2 py-1 rounded"
              >
                <IoIosRefresh size={20} />
                <span> Update SeriesPart</span>
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

export default UpdateSeriesPart;

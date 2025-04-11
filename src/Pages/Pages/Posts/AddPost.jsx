import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import EditorTools from "../../../Components/EditorJS/EditorTools";
import "../../../Components/EditorJS/Styles.css";
import { RockToast } from "rocktoast";
import usePostStore from "./Stores/usePostStore";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [post_date, setPostDate] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const { addPost, showToast, toastMessage, hideToast } = usePostStore();

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

  const convertToSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const outputData = await editorRef.current.save();
      const contentBlocks = outputData.blocks.map((block, index) => ({
        type: block.type,
        order: index + 1,
        data: block.data,
      }));

      const postData = {
        title: title,
        slug: slug,
        author: author,
        post_date: post_date,
        status: "hide",
        content_blocks: contentBlocks,
      };

      addPost(postData, navigate);
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrors({ general: "An unexpected error occurred." });
    }
  };

  return (
    <div className="py-5">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-3">
          <div className="flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="rounded px-3 py-2 bg-gray-300 hover:bg-gray-100 duration-300"
            >
              <FaArrowLeft />
            </button>
            <p className="text-gray-800 text-xl font-semibold">Add Post</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium">
                Judul
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(convertToSlug(e.target.value));
                }}
                className="mt-1 px-3 py-2 border rounded-md w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title[0]}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="author" className="block text-sm font-medium">
                Penulis
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 px-3 py-2 border rounded-md w-full"
              />
              {errors.author && (
                <p className="text-red-500 text-sm">{errors.author[0]}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="post_date" className="block text-sm font-medium">
                Tanggal Post
              </label>
              <input
                type="date"
                id="post_date"
                name="post_date"
                value={post_date}
                onChange={(e) => setPostDate(e.target.value)}
                className="mt-1 px-3 py-2 border rounded-md w-full"
              />
              {errors.post_date && (
                <p className="text-red-500 text-sm">{errors.post_date[0]}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="block text-sm font-medium">
                Content
              </label>
              <div id="editorjs" className="editorjs-container"></div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-white bg-blue-500 hover:bg-blue-700 duration-300 py-1 px-2 text-sm rounded flex items-center space-x-1"
              >
                <FaPlus className="mr-1" />
                <span className="text-white">Save Post</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      {showToast && (
        <RockToast
          message={toastMessage}
          onClose={hideToast}
          duration={1500}
          position="top-right"
        />
      )}
    </div>
  );
};

export default AddPost;

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import EditorToolsForUpdate from "../../../Components/EditorJS/EditorToolsUpdate";
import { RockToast } from "rocktoast";
import "../../../Components/EditorJS/Styles.css";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosRefresh } from "react-icons/io";
import usePostStore from "./Stores/usePostStore";
import { API_URL } from "../../../Components/API/ConfigAPI";

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const {
    fetchPostById,
    updatePost,
    toastMessage,
    showToast,
    hideToast,
    loading,
    error,
  } = usePostStore();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [postDate, setPostDate] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      const fetchedPost = await fetchPostById(id);
      if (fetchedPost) {
        setPost(fetchedPost);
        setTitle(fetchedPost.title);
        setSlug(convertToSlug(fetchedPost.title));
        setAuthor(fetchedPost.author);
        setPostDate(fetchedPost.post_date);

        const transformedBlocks = transformBlocks(fetchedPost.content_blocks);
        initializeEditor(transformedBlocks);
      }
    };

    fetchPost();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [id, fetchPostById]);

  // Generate slug from the title
  const convertToSlug = (text) =>
    text
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");

  useEffect(() => {
    setSlug(convertToSlug(title));
  }, [title]);

  // Transform fetched content blocks to Editor.js format
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

  // Initialize Editor.js
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

  // Handle post update
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const savedData = await editorRef.current.save();
      const contentBlocks = savedData.blocks.map((block, index) => ({
        id: post.content_blocks[index]?.id || null,
        order: index + 1,
        type: block.type,
        data: block.data,
      }));

      const payload = {
        id,
        title,
        slug,
        author,
        post_date: postDate,
        content_blocks: contentBlocks,
      };

      await updatePost(payload, navigate);
    } catch (err) {
      console.error("Error updating post:", err);
      setErrors({
        general: "An error occurred while saving the post. Please try again.",
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
            <h1 className="text-gray-800 text-xl font-semibold">Update Post</h1>
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
              value={postDate}
              onChange={(e) => setPostDate(e.target.value)}
              className="block w-full px-3 py-2 border rounded mb-4"
            />
            <div id="update-editorjs" className="editorjs-container mb-4"></div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex bg-blue-500 text-white px-2 py-1 rounded"
              >
                <IoIosRefresh size={20} />
                <span> Update Post</span>
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

export default UpdatePost;

import React, { useEffect, useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import { RockModal } from "rockmodal";
import "../../../Components/EditorJS/Styles.css";
import usePostStore from "./Stores/usePostStore";
import { API_URL } from "../../../Components/API/ConfigAPI";

const DetailPost = ({ isOpen, onClose, postData }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);

  const fetchPostById = usePostStore((state) => state.fetchPostById);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && postData?.id) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchPostById(postData.id);
          setPost(data);
        } catch (err) {
          setError("Failed to load post details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isOpen, postData, fetchPostById]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <RockModal
      isOpen={isOpen}
      onClose={onClose}
      width="50"
      height="50"
      effect="slideInLeft"
      position="center"
      color="white"
    >
      <div className="flex flex-col items-center justify-center h-full p-6">
        {loading ? (
          <p className="text-gray-400 italic">Loading post...</p>
        ) : error ? (
          <p className="text-red-500 italic">{error}</p>
        ) : post ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center text-sky-700">
              {post.title}
            </h1>
            <div className="w-full">
              {post.content_blocks.map((block) => {
                switch (block.type) {
                  case "header":
                    return (
                      <h2
                        key={block.id}
                        data-level={block.headers[0]?.level}
                        className="ce-header"
                      >
                        {block.headers[0]?.header || "No header content"}
                      </h2>
                    );
                  case "paragraph":
                    return (
                      <div key={block.id} className="mb-4 text-gray-700">
                        {block.paragraphs?.map((p) => (
                          <p key={p.id}>{p.paragraph}</p>
                        )) || (
                          <p className="text-gray-400 italic">
                            No paragraph content available
                          </p>
                        )}
                      </div>
                    );
                  case "list":
                    return (
                      <ul
                        key={block.id}
                        className={`${
                          block.list_items[0]?.style === "ordered"
                            ? "list-decimal"
                            : "list-disc"
                        } list-inside mb-4 text-gray-700`}
                      >
                        {block.list_items.map((item) => (
                          <li key={item.id}>{item.list}</li>
                        ))}
                      </ul>
                    );
                  case "code":
                    return (
                      <div key={block.id} className="relative mb-4">
                        <pre className="bg-gray-800 p-4 rounded text-sm text-white">
                          <code>{block.codes?.code}</code>
                        </pre>
                        <button
                          onClick={() => handleCopy(block.codes?.code)}
                          className="absolute top-1 right-1 px-2 py-1 text-[10px] bg-gray-500 text-white rounded-sm flex items-center"
                        >
                          {copied ? (
                            <>
                              <FaCheck />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <FaCopy />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  case "image":
                    return block.images?.image_url ? (
                      <img
                        key={block.id}
                        src={`${API_URL}/storage/${block.images?.image_url}`}
                        alt="Content Block"
                        className="w-64 h-auto mb-4 rounded"
                      />
                    ) : (
                      <p key={block.id} className="text-gray-400 italic">
                        No image available
                      </p>
                    );
                  default:
                    return (
                      <p key={block.id} className="text-gray-400 italic">
                        Unknown content block type
                      </p>
                    );
                }
              })}
            </div>
          </>
        ) : (
          <p className="text-gray-400 italic">No post found.</p>
        )}
      </div>
    </RockModal>
  );
};

export default DetailPost;

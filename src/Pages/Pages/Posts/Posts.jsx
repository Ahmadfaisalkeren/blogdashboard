import React, { useEffect, useState } from "react";
import { FaEye, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import Loader from "../../../Components/Loader/Loader";
import { GemilangTable } from "gemilangtable";
import { Link, useNavigate } from "react-router-dom";
import DetailPost from "./DetailPost";
import DeletePost from "./DeletePost";
import Switch from "react-switch";
import { RockToast } from "rocktoast";
import usePostStore from "./Stores/usePostStore";

const Posts = () => {
  const {
    posts,
    loading,
    fetchPosts,
    updatePostStatus,
    showToast,
    toastMessage,
    setToast,
    hideToast,
  } = usePostStore();

  const [deletePostModal, setDeletePostModal] = useState(false);
  const [deletePost, setDeletePost] = useState(null);
  const [detailPost, setDetailPost] = useState(null);
  const [detailPostModal, setDetailPostModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDetail = (post) => {
    setDetailPost(post);
    setDetailPostModal(true);
  };

  const handleDelete = (post) => {
    setDeletePostModal(true);
    setDeletePost(post);
  };

  const handleStatusToggle = (postId, newStatus) => {
    updatePostStatus(postId, newStatus);
  };

  const columns = [
    {
      header: "No",
      accessor: "sequenceNumber",
      width: "5%",
    },
    {
      header: "Title",
      accessor: "title",
      width: "25%",
    },
    {
      header: "Author",
      accessor: "author",
      width: "25%",
    },
    {
      header: "Post Date",
      accessor: "post_date",
      width: "25%",
    },
    {
      header: "Status",
      accessor: "status",
      render: (item) => (
        <Switch
          onChange={() =>
            handleStatusToggle(
              item.id,
              item.status === "hide" ? "publish" : "hide"
            )
          }
          checked={item.status === "publish"}
          onColor="#86d3ff"
          offColor="#ff6c75"
          checkedIcon={false}
          uncheckedIcon={false}
        />
      ),
      width: "15%",
    },
    {
      header: "Action",
      accessor: "actions",
      render: (item) => (
        <div className="flex">
          <button
            onClick={() => navigate(`/update-post/${item.id}`)}
            disabled={item.status === "publish"}
            className={`flex text-xs px-2 py-1 rounded-md ${
              item.status === "publish"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 duration-300"
            } mb-1 mr-1`}
          >
            <FaPencilAlt size={16} className="mr-1" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDetail(item)}
            disabled={item.status === "publish"}
            className={`flex text-xs px-2 py-1 rounded-md ${
              item.status === "publish"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border border-green-600 text-green-600 hover:text-white hover:bg-green-600 hover:border-green-600 duration-300"
            } mb-1 mr-1`}
          >
            <FaEye size={16} className="mr-1" />
            <span>Detail</span>
          </button>
          <button
            onClick={() => handleDelete(item)}
            disabled={item.status === "publish"}
            className={`flex text-xs px-2 py-1 rounded-md ${
              item.status === "publish"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white border border-red-600 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 duration-300"
            } mb-1`}
          >
            <FaTrash size={16} className="mr-1" />
            <span>Delete</span>
          </button>
        </div>
      ),
      width: "10%",
    },
  ];

  return (
    <div className="py-5">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-9">
          <div className="pb-3 flex items-center justify-between">
            <p className="text-lg font-semibold text-sky-600">Posts</p>
            <Link
              to={"/add-post"}
              className="flex text-sm px-2 py-1 rounded-md border text-white bg-sky-600 hover:bg-white hover:text-sky-600 hover:border-sky-600 duration-300"
            >
              <FaPlus size={12} className="mr-1 mt-1" />
              <span className="text-sm">Add</span>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <GemilangTable columns={columns} data={posts} />
          )}
        </div>
      </div>
      {detailPost && (
        <DetailPost
          isOpen={detailPostModal}
          onClose={() => setDetailPostModal(false)}
          postData={detailPost}
        />
      )}
      {deletePost && (
        <DeletePost
          isOpen={deletePostModal}
          onClose={() => setDeletePostModal(false)}
          postData={deletePost}
          updatePostsData={fetchPosts}
        />
      )}
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

export default Posts;

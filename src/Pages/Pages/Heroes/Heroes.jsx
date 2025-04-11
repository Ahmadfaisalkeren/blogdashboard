import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import Loader from "../../../Components/Loader/Loader";
import { GemilangTable } from "gemilangtable";
import { API_URL } from "../../../Components/API/ConfigAPI";
import AddHero from "./AddHero";
import UpdateHero from "./UpdateHero";
import DeleteHero from "./DeleteHero";
import useHeroStore from "./Store/useHeroStore";

const Heroes = () => {
  const {
    heroes,
    loading,
    fetchHeroes,
  } = useHeroStore();

  const [addHeroModal, setAddHeroModal] = useState(false);
  const [updateHeroModal, setUpdateHeroModal] = useState(false);
  const [deleteHeroModal, setDeleteHeroModal] = useState(false);
  const [updateHero, setUpdateHero] = useState(null);
  const [deleteHero, setDeleteHero] = useState(null);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const handleEdit = (hero) => {
    setUpdateHeroModal(true);
    setUpdateHero(hero);
  };

  const handleDelete = (hero) => {
    setDeleteHeroModal(true);
    setDeleteHero(hero);
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
      header: "Image",
      accessor: "image",
      width: "25%",
      render: (item) => (
        <img
          src={`${API_URL}/storage/${item.image}`}
          alt={item.title}
          className=" h-32 object-cover rounded-md"
        />
      ),
    },
    {
      header: "Action",
      accessor: "actions",
      render: (item) => (
        <div className="flex">
          <button
            onClick={() => handleEdit(item)}
            className="flex text-xs px-2 py-1 rounded-md bg-white border border-blue-600 text-blue-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 duration-300 mb-1 mr-1"
          >
            <FaPencilAlt size={16} className="mr-1" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="flex text-xs px-2 py-1 rounded-md
                bg-white border border-red-600 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600 duration-300 mb-1"
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
            <p className="text-lg font-semibold text-sky-600">Heroes</p>
            <button
              onClick={() => setAddHeroModal(true)}
              className="flex text-sm px-2 py-1 rounded-md border text-white bg-sky-600 hover:bg-white hover:text-sky-600 hover:border-sky-600 duration-300"
            >
              <FaPlus size={12} className="mr-1 mt-1" />
              <span className="text-sm">Add</span>
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <GemilangTable columns={columns} data={heroes} />
          )}
        </div>
      </div>
      <AddHero
        isOpen={addHeroModal}
        onClose={() => setAddHeroModal(false)}
        updateHeroesData={fetchHeroes}
      />
      {updateHero && (
        <UpdateHero
          isOpen={updateHeroModal}
          onClose={() => setUpdateHeroModal(false)}
          heroData={updateHero}
          updateHeroesData={fetchHeroes}
        />
      )}
      {deleteHero && (
        <DeleteHero
          isOpen={deleteHeroModal}
          onClose={() => setDeleteHeroModal(false)}
          heroData={deleteHero}
          updateHeroesData={fetchHeroes}
        />
      )}
    </div>
  );
};

export default Heroes;

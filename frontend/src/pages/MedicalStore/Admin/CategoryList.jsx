import { useState } from "react";
import {
  // useCreateCategoryMutation,
  // useUpdateCategoryMutation,
  // useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../components/CategoryForm";
import Modal from "../components/Modal";
import AdminMenu from "./AdminMenu";
import axios from "axios";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // const [createCategory] = useCreateCategoryMutation();
  // const [updateCategory] = useUpdateCategoryMutation();
  // const [deleteCategory] = useDeleteCategoryMutation();
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1", // Change to your backend URL
    withCredentials: true, // For handling cookies
  });
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    console.log("name=" + name);
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      //const result = await createCategory({ name }).unwrap();
      await axiosInstance.post("/admin/createCategory", { name });
      // if (result.error) {
      //   toast.error(result.error);
      // } else {
      //   setName("");
      //   toast.success(`${result.name} is created.`);
      // }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/admin/updateCategory/${selectedCategory._id}`,
        { name: updatingName }
      );
      toast.success(`${response.data.name} is updated.`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      refetch(); // Refresh the category list
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Updating category failed. Try again."
      );
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      toast.error("No category selected for deletion.");
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `/admin/deleteCategory/${selectedCategory._id}`
      );
      toast.success(`${response.data.name} is deleted.`);
      setSelectedCategory(null);
      setModalVisible(false);
      refetch(); // Refresh the category list
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Category deletion failed. Try again."
      );
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row bg-white shadow-lg rounded-lg p-6">
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <div className="text-xl font-bold text-blue-900 h-12 mb-4">
          Manage Categories
        </div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-blue-500 text-blue-500 py-2 px-4 rounded-lg m-3 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategoryItems,
  createCategoryItem,
  updateCategoryItem,
  deleteCategoryItem,
  getCategories,
} from "../../componet/State/Categories/Action";

const PAGE_SIZE = 5;

const Children = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const { loading, categoryItems, categories, error, success } = useSelector(
    (state) => state.categories
  );
  const jwt = localStorage.getItem("jwt");

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", categoryId: "" });

  useEffect(() => {
    if (jwt) {
      dispatch(getCategoryItems(restaurantId, currentPage - 1, PAGE_SIZE, "id", "asc", jwt));
      dispatch(getCategories(restaurantId, 0, 100, "id", "asc", jwt)); // Lấy danh mục cha
    }
  }, [dispatch, restaurantId, currentPage, jwt, success]);

  const totalPages = categoryItems?.totalPages || 1;
  const paginatedCategories = categoryItems?.content || [];
  const parentCategories = categories?.content || []; // Lấy danh mục cha từ Redux

  const openForm = (category = null) => {
    setEditingCategory(category);
    setFormData(
      category
        ? { name: category.name, categoryId: category.category.id }
        : { name: "", categoryId: "" }
    );
    setShowForm(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
  
    if (!formData.name.trim() || !formData.categoryId) {
      alert("Tên danh mục và ID danh mục cha không được để trống!");
      return;
    }
  
    const categoryItemData = {
      name: formData.name,
      categoryId: formData.categoryId,
      restaurantId: 1, // ✅ Bổ sung restaurantId mặc định
    };
  
    if (editingCategory) {
      dispatch(updateCategoryItem(editingCategory.id, categoryItemData, jwt)); // ✅ Cập nhật danh mục con
    } else {
      dispatch(createCategoryItem(categoryItemData, jwt)); // ✅ Thêm mới danh mục con
    }
  
    setShowForm(false);
  };
  
  const handleDelete = (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục con có ID: ${id}?`)) {
      dispatch(deleteCategoryItem(id, jwt));
    }
  };

  if (!jwt) return <p className="text-red-500">Bạn chưa đăng nhập!</p>;
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách danh mục con</h2>

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
        onClick={() => openForm()}
      >
        + Thêm Mới
      </button>

      <table className="w-full border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên danh mục con</th>
            <th className="border px-4 py-2">Danh mục cha</th>
            <th className="border px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((category) => (
            <tr key={category.id} className="text-center">
              <td className="border px-4 py-2">{category.id}</td>
              <td className="border px-4 py-2">{category.name}</td>
              <td className="border px-4 py-2">{category.category.name}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => openForm(category)}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDelete(category.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        {currentPage > 1 && (
          <button
            className="px-3 py-1 border bg-gray-300 text-black hover:bg-gray-400"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            &laquo;
          </button>
        )}
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`px-3 py-1 border ${
              i + 1 === currentPage
                ? "bg-blue-500 text-white font-bold"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            className="px-3 py-1 border bg-gray-300 text-black hover:bg-gray-400"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
          >
            &raquo;
          </button>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-blue-700">
              {editingCategory ? "Cập nhật danh mục con" : "Thêm danh mục con"}
            </h2>
            <form onSubmit={handleSubmitForm}>
              <label className="block mb-2">
                Tên danh mục:
                <input
                  type="text"
                  className="w-full border px-3 py-2 mt-1 rounded focus:ring-2 focus:ring-blue-500 text-black"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>
              <label className="block mb-2">
                Chọn danh mục cha:
                <select
                  className="w-full border px-3 py-2 mt-1 rounded focus:ring-2 focus:ring-blue-500 text-black"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  <option value="">Chọn danh mục cha</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400" onClick={() => setShowForm(false)}>
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  {editingCategory ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Children;

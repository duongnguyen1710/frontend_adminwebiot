import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../componet/State/Categories/Action";

const PAGE_SIZE = 5;

const Parent = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const { loading, categories, error } = useSelector(
    (state) => state.categories
  );
  const jwt = localStorage.getItem("jwt");

  // ⚡ Khai báo state trước khi sử dụng trong useEffect
  const [currentPage, setCurrentPage] = useState(1);

  // ⚡ Chỉ cần 1 useEffect để lấy danh mục
  useEffect(() => {
    if (jwt) {
      dispatch(
        getCategories(
          restaurantId,
          currentPage - 1,
          PAGE_SIZE,
          "id",
          "asc",
          jwt
        )
      );
    }
  }, [dispatch, restaurantId, currentPage, jwt]); // Chỉ gọi API getCategories

  const totalPages = categories?.totalPages || 1;
  const paginatedCategories = categories?.content || [];

  const getPaginationNumbers = () => {
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + 2);
    if (end - start < 2) start = Math.max(1, end - 2);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (!jwt) return <p className="text-red-500">Bạn chưa đăng nhập!</p>;
  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách danh mục</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Tên danh mục</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((category) => (
            <tr key={category.id} className="text-center">
              <td className="border px-4 py-2">{category.id}</td>
              <td className="border px-4 py-2">{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
        {getPaginationNumbers().map((page) => (
          <button
            key={page}
            className={`px-3 py-1 border ${
              page === currentPage
                ? "bg-blue-500 text-white font-bold"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
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
    </div>
  );
};

export default Parent;

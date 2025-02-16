import { api } from "../../config/api";
import { GET_CATEGORY_ITEMS_FAILURE, GET_CATEGORY_ITEMS_REQUEST, GET_CATEGORY_ITEMS_SUCCESS } from "../CategoryTest/ActionType";
import { CREATE_CATEGORY_FAILURE, CREATE_CATEGORY_ITEM_FAILURE, CREATE_CATEGORY_ITEM_REQUEST, CREATE_CATEGORY_ITEM_SUCCESS, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, DELETE_CATEGORY_FAILURE, DELETE_CATEGORY_ITEM_FAILURE, DELETE_CATEGORY_ITEM_REQUEST, DELETE_CATEGORY_ITEM_SUCCESS, DELETE_CATEGORY_REQUEST, DELETE_CATEGORY_SUCCESS, GET_CATEGORY_FAILURE, GET_CATEGORY_REQUEST, GET_CATEGORY_SUCCESS, UPDATE_CATEGORY_FAILURE, UPDATE_CATEGORY_ITEM_FAILURE, UPDATE_CATEGORY_ITEM_REQUEST, UPDATE_CATEGORY_ITEM_SUCCESS, UPDATE_CATEGORY_REQUEST, UPDATE_CATEGORY_SUCCESS } from "./ActionType";

export const getCategories =
  (restaurantId, page = 0, size = 5, sortBy = "id", sortDir = "asc", jwt) =>
  async (dispatch) => {
    dispatch({ type: GET_CATEGORY_REQUEST });

    try {
      const response = await api.get(
        `api/admin/category/page/1/category?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      console.log("Thành công:", response.data); // Log dữ liệu khi API gọi thành công

      dispatch({
        type: GET_CATEGORY_SUCCESS,
        payload: response.data, // API trả về Page<Category>
      });
    } catch (error) {
      console.error("Lỗi API:", error.response ? error.response.data : "Lỗi kết nối"); // Log lỗi API

      dispatch({
        type: GET_CATEGORY_FAILURE,
        payload: error.response ? error.response.data : "Lỗi kết nối",
      });
    }
  };

  export const createCategory = (categoryData, jwt) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_CATEGORY_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      };
  
      const { data } = await api.post("/api/admin/category/category", categoryData, config);
  
      dispatch({
        type: CREATE_CATEGORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_CATEGORY_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  

//   export const createCategory = ({data,jwt}) => {
//       console.log("data", data, "jwt", jwt);
//       return async (dispatch) => {
//           try {
//               const response = await api.post(`/api/admin/category/category`, data,{
//                   headers: {
//                       Authorization: `Bearer ${jwt}`,
//                   },
//               });
//               console.log("create  category", response.data);
//               dispatch({
//                   type:CREATE_CATEGORY_SUCCESS,
//                   payload: response.data,
//               });
//           } catch (error) {
//               console.log("error", error);
//           }
//       };
//   };

export const deleteCategory = (id, jwt) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    await api.delete(`/api/admin/category/${id}`, config);

    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: id, // Trả về ID của danh mục đã xóa để cập nhật state
    });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAILURE,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const updateCategory = (id, updatedData, jwt) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };

    const { data } = await api.put(`/api/admin/category/${id}`, updatedData, config);

    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: data, // Cập nhật danh mục trong store
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAILURE,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const getCategoryItems = (restaurantId, page = 0, size = 10, sortBy = "id", sortDir = "asc", jwt) => async (dispatch) => {
  try {
    dispatch({ type: GET_CATEGORY_ITEMS_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    const { data } = await api.get(`/api/admin/category/page/restaurant/1`, {
      params: { page, size, sortBy, sortDir },
      ...config,
    });

    dispatch({
      type: GET_CATEGORY_ITEMS_SUCCESS,
      payload: data, // Lưu danh sách danh mục con vào Redux store
    });
  } catch (error) {
    dispatch({
      type: GET_CATEGORY_ITEMS_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const createCategoryItem = (categoryItemData, jwt) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CATEGORY_ITEM_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };

    const { data } = await api.post(`/api/admin/category`, categoryItemData, config);

    dispatch({
      type: CREATE_CATEGORY_ITEM_SUCCESS,
      payload: data, // Lưu dữ liệu danh mục con mới vào Redux
    });
  } catch (error) {
    dispatch({
      type: CREATE_CATEGORY_ITEM_FAILURE,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteCategoryItem = (id, jwt) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_ITEM_REQUEST });

    const config = {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    };

    await api.delete(`/api/admin/category/category-item/${id}`, config);

    dispatch({
      type: DELETE_CATEGORY_ITEM_SUCCESS,
      payload: id, // Trả về ID danh mục con đã xóa
    });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_ITEM_FAILURE,
      payload: error.response?.data?.message || "Xóa danh mục con thất bại!",
    });
  }
};

export const updateCategoryItem = (id, updatedData, jwt) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_ITEM_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    };

    const { data } = await api.put(`/api/admin/category/category-item/${id}`, updatedData, config);

    dispatch({
      type: UPDATE_CATEGORY_ITEM_SUCCESS,
      payload: data, // Cập nhật danh mục con đã sửa vào Redux
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_ITEM_FAILURE,
      payload: error.response?.data?.message || "Cập nhật danh mục con thất bại!",
    });
  }
};
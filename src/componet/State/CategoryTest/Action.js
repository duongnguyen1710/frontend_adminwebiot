import axios from "axios";
import { API_URL, api} from '../../config/api';
import { CREATE_CATEGORYITEM_SUCCESS, CREATE_CATEGORY_SUCCESS, CREATE_INGREDIENT_CATEGORY_SUCCESS, CREATE_INGREDIENT_SUCCESS, DELETE_CATEGORY_FAILURE, DELETE_CATEGORY_REQUEST, DELETE_CATEGORY_SUCCESS, GETY_CATEGORY_FAILURE, GETY_CATEGORY_FAILURE1, GET_CATEGORYITEM, GET_CATEGORY_ITEMS_FAILURE, GET_CATEGORY_ITEMS_REQUEST, GET_CATEGORY_ITEMS_SUCCESS, GET_CATEGORY_REQUEST, GET_CATEGORY_REQUEST1, GET_CATEGORY_SUCCESS, GET_CATEGORY_SUCCESS1, GET_INGREDIENTS, GET_INGREDIENT_CATEGORY_SUCCESS, UPDATE_CATEGORY_FAILURE, UPDATE_CATEGORY_REQUEST, UPDATE_CATEGORY_SUCCESS, UPDATE_STOCK } from "./ActionType";

export const getCategoryItemOfRestaurant = ({id, jwt}) => {
    return async (dispatch) => {
        try {
            const response = await api.get(
                `/api/admin/category/restaurant/${id}`,
                {
                    headers:{
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log("get all category item", response.data);
            dispatch({
                type:GET_CATEGORYITEM,
                payload:response.data,
            });
        } catch (error) {
            console.log("error", error);
        }
    };
};

export const createCategoryItem = ({data, jwt}) => {
    return async (dispatch) => {
        try {
            const response = await api.post(`/api/admin/category`, data, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("create categoryitem", response.data);
            dispatch({type:CREATE_CATEGORYITEM_SUCCESS, payload: response.data,});

        } catch (error) {
            console.log("error", error);
        }
    };
};

export const createCategory = ({data,jwt}) => {
    console.log("data", data, "jwt", jwt);
    return async (dispatch) => {
        try {
            const response = await api.post(`/api/admin/category/category`, data,{
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("create  category", response.data);
            dispatch({
                type:CREATE_CATEGORY_SUCCESS,
                payload: response.data,
            });
        } catch (error) {
            console.log("error", error);
        }
    };
};

export const getCategory = ({id, jwt}) => {
    return async (dispatch) => {
        try {
            const response = await api.get(
                `/api/admin/category/restaurant/${id}/category`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            console.log("get category", response.data);
            dispatch({
                type: GET_CATEGORY_SUCCESS,
                payload:response.data,
            });
        } catch (error) {
            console.log("error", error);
        }
    };
};

// export const getCategory1 = ({ id, jwt, page = 0, size = 10, sortBy = "id", sortDir = "asc" }) => {
//     return async (dispatch) => {
//         try {
//             const response = await api.get(
//                 `/api/admin/category/page/restaurant/${id}/category?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${jwt}`,
//                     },
//                 }
//             );
//             console.log("get category with pagination", response.data);
//             dispatch({
//                 type: GET_CATEGORY_SUCCESS,
//                 payload: response.data, // Dữ liệu phân trang từ server
//             });
//         } catch (error) {
//             console.log("Error fetching categories with pagination", error);
//         }
//     };
// };

export const getCategory1 = ({ id, jwt, page = 0, size = 5, sortBy = "id", sortDir = "asc" }) => {
    return async (dispatch) => {
      dispatch({ type: GET_CATEGORY_REQUEST1 });
  
      try {
        const response = await api.get(
          `/api/admin/category/page/${id}/category?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
  
        dispatch({
          type: GET_CATEGORY_SUCCESS1,
          payload: response.data, // Kết quả trả về từ API
        });
      } catch (error) {
        dispatch({
          type: GETY_CATEGORY_FAILURE1,
          payload: error.response?.data || error.message,
        });
      }
    };
  };


export const deleteCategory = (categoryId, jwt) => {
    return async (dispatch) => {
        dispatch({ type: DELETE_CATEGORY_REQUEST });

        try {
            const response = await api.delete(`/api/admin/category/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            dispatch({
                type: DELETE_CATEGORY_SUCCESS,
                payload: response.data, // Thường trả về message từ server
            });
        } catch (error) {
            dispatch({
                type: DELETE_CATEGORY_FAILURE,
                payload: error.response?.data?.message || 'Failed to delete category',
            });
        }
    };
};

export const updateCategory = (categoryId, updatedCategory, jwt) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_CATEGORY_REQUEST });

        try {
            const response = await axios.put(`/api/categories/${categoryId}`, updatedCategory, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            dispatch({
                type: UPDATE_CATEGORY_SUCCESS,
                payload: response.data, // Thường trả về object category đã cập nhật
            });
        } catch (error) {
            dispatch({
                type: UPDATE_CATEGORY_FAILURE,
                payload: error.response?.data?.message || 'Failed to update category',
            });
        }
    };
};

export const getCategoryItems = ({ restaurantId, categoryId }) => {
    return async (dispatch) => {
        dispatch({ type: GET_CATEGORY_ITEMS_REQUEST }); // Bắt đầu gọi API
        try {
            const response = await api.get(`/category/${categoryId}/${restaurantId}`);
            
            console.log("Products by restaurant and category:", response.data);
            
            // Thành công
            dispatch({
                type: GET_CATEGORY_ITEMS_SUCCESS,
                payload: response.data, // Dữ liệu sản phẩm trả về từ API
            });
        } catch (error) {
            console.error("Error fetching products by restaurant and category:", error);
            
            // Thất bại
            dispatch({
                type: GET_CATEGORY_ITEMS_FAILURE,
                payload: error.message || "Something went wrong",
            });
        }
    };
};
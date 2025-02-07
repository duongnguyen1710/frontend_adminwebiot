
import { api } from "../../config/api";
import { CREATE_PRODUCT_FAILURE, CREATE_PRODUCT_REQUEST, CREATE_PRODUCT_SUCCESS, DELETE_PRODUCT_FAILURE, DELETE_PRODUCT_REQUEST, DELETE_PRODUCT_SUCCESS, GET_PRODUCT_BY_RESTAURANT_ID_FAILURE, GET_PRODUCT_BY_RESTAURANT_ID_REQUEST, GET_PRODUCT_BY_RESTAURANT_ID_SUCCESS, UPDATE_PRODUCT_FAILURE, UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_STATUS_FAILURE, UPDATE_STATUS_REQUEST, UPDATE_STATUS_SUCCESS } from "./ActionType";
//import { CREATE_MENU_ITEM_FAILURE, CREATE_MENU_ITEM_REQUEST, CREATE_MENU_ITEM_SUCCESS, DELETE_MENU_ITEM_FAILURE, DELETE_MENU_ITEM_REQUEST, DELETE_MENU_ITEM_SUCCESS, GET_MENU_ITEMS_BY_RESTAURANT_ID_FAILURE, GET_MENU_ITEMS_BY_RESTAURANT_ID_REQUEST, GET_MENU_ITEMS_BY_RESTAURANT_ID_SUCCESS, SEARCH_MENU_ITEM_FAILURE, SEARCH_MENU_ITEM_REQUEST, SEARCH_MENU_ITEM_SUCCESS, UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE, UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST, UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS } from "./ActionType";

// export const createMenuItem = ({menu, jwt}) => {
//     return async (dispatch) => {
//         dispatch({type: CREATE_MENU_ITEM_REQUEST});
//         try {
//             const {data} = await api.post("api/admin/food", menu, 
//                 {
//                     headers: {
//                         Authorization: `Bearer ${jwt}`,
//                     },
//                 }
//             );
//             console.log("created menu", data);
//             dispatch({type: CREATE_MENU_ITEM_SUCCESS, payload:data});
//         } catch (error) {
//             console.log("catch error", error);
//             dispatch({type: CREATE_MENU_ITEM_FAILURE, payload:error});
//         }
//     };
// };

export const getProductRestaurantId = (reqData) => {
    return async (dispatch) => {
        dispatch({ type: GET_PRODUCT_BY_RESTAURANT_ID_REQUEST });
        try {
            const { data } = await api.get(
                `/api/admin/product/page/${reqData.restaurantId}?page=${reqData.page || 0}&size=${reqData.size || 10}`,
                {
                    headers: {
                        Authorization: `Bearer ${reqData.jwt}`,
                    },
                }
            );
            console.log("Product by restaurant:", data);
            dispatch({ type: GET_PRODUCT_BY_RESTAURANT_ID_SUCCESS, payload: data });
        } catch (error) {
            console.log("Catch error:", error);
            dispatch({ type: GET_PRODUCT_BY_RESTAURANT_ID_FAILURE, payload: error.response?.data || error.message });
        }
    };
};

export const updateProduct = (productId, productData, jwt) => {
    return async (dispatch) => {
      dispatch({ type: UPDATE_PRODUCT_REQUEST });
  
      try {
        const { data } = await api.put(
          `/api/admin/product/${productId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
  
        dispatch({
          type: UPDATE_PRODUCT_SUCCESS,
          payload: data, // Dữ liệu sản phẩm đã sửa trả về từ server
        });
      } catch (error) {
        dispatch({
          type: UPDATE_PRODUCT_FAILURE,
          payload: error.response?.data || error.message, // Thông báo lỗi từ server hoặc lỗi chung
        });
      }
    };
  };

  export const deleteProduct = (productId, jwt) => {
    return async (dispatch) => {
      dispatch({ type: DELETE_PRODUCT_REQUEST });
  
      try {
        const { data } = await api.delete(`/api/admin/product/${productId}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
  
        dispatch({
          type: DELETE_PRODUCT_SUCCESS,
          payload: productId, // Truyền ID của sản phẩm đã xóa
        });
      } catch (error) {
        dispatch({
          type: DELETE_PRODUCT_FAILURE,
          payload: error.response?.data || error.message,
        });
      }
    };
  };

// export const searchMenuItem = ({keyword, jwt}) => {
//     return async (dispatch) => {
//         dispatch({type: SEARCH_MENU_ITEM_REQUEST});
//         try {
//             const {data} = await api.get(`api/food/search?name=${keyword}`,{
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//             });
//             console.log("data--------", data);
//             dispatch({type: SEARCH_MENU_ITEM_SUCCESS, payload:data});
//         } catch (error) {
//             dispatch({type: SEARCH_MENU_ITEM_FAILURE, payload:error});
//         }
//     }
// }

// export const updateMenuItemsAvailability = ({foodId, jwt}) => {
//     return async (dispatch) => {
//         dispatch({type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST});
//         try {
//             const {data} = await api.put(
//                 `/api/admin/food/${foodId}`,
//                 {},
//                 {
//                     headers: {
//                         Authorization: `Bearer ${jwt}`,
//                     },
//                 }
//             );
//             console.log("update menuItems Availability", data);
//             dispatch({type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload:data});
//         } catch (error) {
//             console.log("error", error);
//             dispatch({type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
//                 payload:error,
//             });
            
//         }
//     };
// };

// export const deleteFoodAction = ({foodId, jwt}) =>
//     async (dispatch) => {
//         dispatch({type: DELETE_MENU_ITEM_REQUEST});
//         try {
//             const {data} = await api.delete(`/api/admin/food/${foodId}`, {
//                 headers: {
//                     Authorization: `Bearer ${jwt}`,
//                 },
//             });
//             console.log("delete food", data);
//             dispatch({type: DELETE_MENU_ITEM_SUCCESS, payload: foodId});
//         } catch (error) {
//             dispatch({type: DELETE_MENU_ITEM_FAILURE, payload:error});
//         }
//     };

export const createProduct = (productData, jwt) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_PRODUCT_REQUEST });

        try {
            const { data } = await api.post(
                '/api/admin/product',
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );

            dispatch({
                type: CREATE_PRODUCT_SUCCESS,
                payload: data, // Dữ liệu sản phẩm trả về từ server
            });
        } catch (error) {
            dispatch({
                type: CREATE_PRODUCT_FAILURE,
                payload: error.response?.data || error.message, // Thông báo lỗi từ server hoặc lỗi chung
            });
        }
    };
};

export const updateProductStatus = (productId, status, jwt) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_STATUS_REQUEST });

    const response = await api.put(
      `/api/admin/product/${productId}/update-status?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    dispatch({
      type: UPDATE_STATUS_SUCCESS,
      payload: response.data,
    });

  } catch (error) {
    dispatch({
      type: UPDATE_STATUS_FAILURE,
      payload: error.response?.data || "Lỗi khi cập nhật trạng thái sản phẩm",
    });
  }
};
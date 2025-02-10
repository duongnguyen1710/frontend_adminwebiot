import { api } from "../../config/api";
import { CREATE_CATEGORY_FAILURE, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, GET_CATEGORY_FAILURE, GET_CATEGORY_REQUEST, GET_CATEGORY_SUCCESS } from "./ActionType";

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
    dispatch({ type: CREATE_CATEGORY_REQUEST });
  
    try {
        const response = await api.post(
          "api/admin/category/category",
          categoryData,
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          }
        );
      
        console.log("Response từ API:", response); // 👈 Xem API thực sự trả về gì
      
        if (response.status !== 201) {
          throw new Error(`Lỗi API: ${response.statusText}`);
        }
      
        dispatch({
          type: CREATE_CATEGORY_SUCCESS,
          payload: response.data,
        });
      
      } catch (error) {
        console.error("Lỗi khi tạo danh mục:", error.response || error.message || "Không xác định");
      
        dispatch({
          type: CREATE_CATEGORY_FAILURE,
          payload: error.response?.data?.message || error.message || "Lỗi không xác định",
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
  
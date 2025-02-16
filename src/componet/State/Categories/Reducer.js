import { CREATE_CATEGORY_FAILURE, CREATE_CATEGORY_REQUEST, CREATE_CATEGORY_SUCCESS, GET_CATEGORY_FAILURE, GET_CATEGORY_REQUEST, GET_CATEGORY_SUCCESS } from "./ActionType";

  
  const initialState = {
    loading: false,
    categories: [],
    error: null,
    success: false, // Thêm trạng thái success để reload dữ liệu
  };
  
  export const categoriesReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_CATEGORY_REQUEST:
        return { ...state, loading: true, error: null };
      case GET_CATEGORY_SUCCESS:
        return { ...state, loading: false, categories: action.payload, success: false }; // Reset success khi lấy danh sách mới
      case GET_CATEGORY_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      case CREATE_CATEGORY_REQUEST:
        return { ...state, loading: true, success: false };
      case CREATE_CATEGORY_SUCCESS:
        return { ...state, loading: false, success: true }; // Đánh dấu là đã thêm thành công
      case CREATE_CATEGORY_FAILURE:
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
  };
  
import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAILURE,
  GET_CATEGORY_REQUEST,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
} from "./ActionType";

const initialState = {
  loading: false,
  categories: { content: [], totalPages: 1 }, // Đảm bảo có cấu trúc đúng từ API
  error: null,
  success: false, 
};

export const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    // 🟢 Lấy danh sách danh mục
    case GET_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_CATEGORY_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        categories: action.payload || { content: [], totalPages: 1 }, // Đảm bảo categories có dữ liệu hợp lệ
        success: false 
      };
    case GET_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // 🟢 Thêm danh mục
    case CREATE_CATEGORY_REQUEST:
      return { ...state, loading: true, success: false };
    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: {
          ...state.categories,
          content: [action.payload, ...state.categories.content], // Chèn danh mục mới vào mảng content
        },
        success: true,
      };
    case CREATE_CATEGORY_FAILURE:
      return { ...state, loading: false, error: action.payload, success: false };


      case DELETE_CATEGORY_REQUEST:
        return { ...state, loading: true, success: false };
      case DELETE_CATEGORY_SUCCESS:
        return {
          ...state,
          loading: false,
          categories: {
            ...state.categories,
            content: state.categories.content.filter(
              (category) => category.id !== action.payload
            ), // Loại bỏ danh mục bị xóa
          },
          success: true, // Trigger reload dữ liệu
        };
      case DELETE_CATEGORY_FAILURE:
        return { ...state, loading: false, error: action.payload, success: false };

        case UPDATE_CATEGORY_REQUEST:
          return { ...state, loading: true, success: false };
        case UPDATE_CATEGORY_SUCCESS:
          return {
            ...state,
            loading: false,
            categories: {
              ...state.categories,
              content: state.categories.content.map((category) =>
                category.id === action.payload.id ? action.payload : category
              ), // Thay thế danh mục đã cập nhật
            },
            success: true,
          };
        case UPDATE_CATEGORY_FAILURE:
          return { ...state, loading: false, error: action.payload, success: false };
    default:
      return state;
  }
};

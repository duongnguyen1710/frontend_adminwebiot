import {
  GET_CATEGORY_ITEMS_FAILURE,
  GET_CATEGORY_ITEMS_REQUEST,
  GET_CATEGORY_ITEMS_SUCCESS,
} from "../CategoryTest/ActionType";
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
  CREATE_CATEGORY_ITEM_REQUEST,
  CREATE_CATEGORY_ITEM_SUCCESS,
  CREATE_CATEGORY_ITEM_FAILURE,
  DELETE_CATEGORY_ITEM_REQUEST,
  DELETE_CATEGORY_ITEM_SUCCESS,
  DELETE_CATEGORY_ITEM_FAILURE,
  UPDATE_CATEGORY_ITEM_REQUEST,
  UPDATE_CATEGORY_ITEM_SUCCESS,
  UPDATE_CATEGORY_ITEM_FAILURE,
} from "./ActionType";

const initialState = {
  loading: false,
  categories: { content: [], totalPages: 1 }, // Đảm bảo có cấu trúc đúng từ API
  categoryItems: { content: [], totalPages: 1 },
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
        success: false,
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
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

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
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

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
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case GET_CATEGORY_ITEMS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_CATEGORY_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryItems: action.payload || { content: [], totalPages: 1 }, // Cập nhật danh mục con
        success: false,
      };
    case GET_CATEGORY_ITEMS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CREATE_CATEGORY_ITEM_REQUEST:
      return { ...state, loading: true, success: false };

    case CREATE_CATEGORY_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryItems: {
          ...state.categoryItems,
          content: [action.payload, ...state.categoryItems.content], // Chèn danh mục con mới vào danh sách
        },
        success: true,
      };

    case CREATE_CATEGORY_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    case DELETE_CATEGORY_ITEM_REQUEST:
      return { ...state, loading: true, success: false };

    case DELETE_CATEGORY_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryItems: {
          ...state.categoryItems,
          content: state.categoryItems.content.filter(
            (item) => item.id !== action.payload
          ), // Loại bỏ danh mục con bị xóa
        },
        success: true, // Trigger reload dữ liệu
      };

    case DELETE_CATEGORY_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

      case UPDATE_CATEGORY_ITEM_REQUEST:
        return { ...state, loading: true, success: false };
      
      case UPDATE_CATEGORY_ITEM_SUCCESS:
        return {
          ...state,
          loading: false,
          categoryItems: {
            ...state.categoryItems,
            content: state.categoryItems.content.map((item) =>
              item.id === action.payload.id ? action.payload : item
            ), // Cập nhật danh mục con trong danh sách
          },
          success: true,
        };
      
      case UPDATE_CATEGORY_ITEM_FAILURE:
        return { ...state, loading: false, error: action.payload, success: false };
      
    default:
      return state;
  }
};

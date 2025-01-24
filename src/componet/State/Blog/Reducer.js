import {
  CREATE_BLOG_FAILURE,
  CREATE_BLOG_REQUEST,
  CREATE_BLOG_SUCCESS,
  DELETE_BLOG_FAILURE,
  DELETE_BLOG_REQUEST,
  DELETE_BLOG_SUCCESS,
  GET_BLOG_FAILURE,
  GET_BLOG_REQUEST,
  GET_BLOG_SUCCESS,
  GETTOP3_BLOG_FAILURE,
  GETTOP3_BLOG_REQUEST,
  GETTOP3_BLOG_SUCCESS,
  UPDATE_BLOG_FAILURE,
  UPDATE_BLOG_REQUEST,
  UPDATE_BLOG_SUCCESS,
} from "./ActionType";

const initialState = {
  blogs: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
};

// Reducer Blog
export const blogReducer = (state = initialState, action) => {
  switch (action.type) {
    // 📌 Lấy danh sách Blog (Phân trang)
    case GET_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_BLOG_SUCCESS:
      return {
        ...state,
        blogs: action.payload.blogs,
        currentPage: action.payload.currentPage,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
        loading: false,
      };
    case GET_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case DELETE_BLOG_SUCCESS:
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog.id !== action.payload),
        loading: false,
      };
    case DELETE_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case CREATE_BLOG_SUCCESS:
      return {
        ...state,
        blogs: [action.payload, ...state.blogs],
        loading: false,
      };
    case CREATE_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case UPDATE_BLOG_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case UPDATE_BLOG_SUCCESS:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.id === action.payload.id ? action.payload : blog
        ),
        loading: false,
      };
    case UPDATE_BLOG_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

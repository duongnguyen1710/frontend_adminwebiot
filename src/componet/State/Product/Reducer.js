import * as actionTypes from "./ActionType";

const initialState = {
  products: [],
  loading: false,
  error: null,
  message: null,
  availableProductCount: 0, // Thêm state để lưu số lượng sản phẩm có sẵn
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  },
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PRODUCT_BY_RESTAURANT_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case actionTypes.GET_PRODUCT_BY_RESTAURANT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.content,
        pagination: {
          page: action.payload.pageable.pageNumber,
          size: action.payload.pageable.pageSize,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        },
      };

    case actionTypes.GET_PRODUCT_BY_RESTAURANT_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case actionTypes.CREATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case actionTypes.CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload], // Thêm sản phẩm mới vào danh sách
        message: "Product created successfully.",
      };

    case actionTypes.CREATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: "Failed to create product.",
      };

    case actionTypes.UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        message: "Sản phẩm đã được cập nhật thành công.",
      };

    case actionTypes.UPDATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: "Cập nhật sản phẩm thất bại.",
      };

    case actionTypes.DELETE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter(
          (product) => product.id !== action.payload // Loại bỏ sản phẩm đã xóa
        ),
        message: "Xóa sản phẩm thành công.",
      };

    case actionTypes.DELETE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: "Xóa sản phẩm thất bại.",
      };

    // ✅ Cập nhật trạng thái sản phẩm (1: Còn hàng, 2: Hết hàng)
    case actionTypes.UPDATE_STATUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((product) =>
          product.id === action.payload.id ? { ...product, status: action.payload.status } : product
        ),
        message: "Trạng thái sản phẩm đã được cập nhật thành công.",
      };

    case actionTypes.UPDATE_STATUS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        message: "Cập nhật trạng thái sản phẩm thất bại.",
      };

    // ✅ Thêm reducer đếm số lượng sản phẩm có sẵn
    case actionTypes.COUNT_PRODUCT_AVAILABLE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case actionTypes.COUNT_PRODUCT_AVAILABLE_SUCCESS:
      return {
        ...state,
        loading: false,
        availableProductCount: action.payload, // Lưu số lượng sản phẩm có sẵn
      };

    case actionTypes.COUNT_PRODUCT_AVAILABLE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer;

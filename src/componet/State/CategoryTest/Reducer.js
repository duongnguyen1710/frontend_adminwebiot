import { CREATE_CATEGORY_SUCCESS, CREATE_CATEGORYITEM_SUCCESS, GET_CATEGORY_ITEMS_FAILURE, GET_CATEGORY_ITEMS_REQUEST, GET_CATEGORY_ITEMS_SUCCESS, GET_CATEGORY_REQUEST1, GET_CATEGORY_SUCCESS, GET_CATEGORY_SUCCESS1, GET_CATEGORYITEM, GETY_CATEGORY_FAILURE1 } from "./ActionType";

const initialState = {
    categoryItems: [],
    update: null,
    category: [], // Danh sách danh mục
    pagination: { // Thông tin phân trang
        page: 0,
        size: 5,
        totalPages: 0,
        totalElements: 0,
      },
      loading: false,
      error: null,
};

export const categoryTestReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CATEGORY_ITEMS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_CATEGORY_ITEMS_SUCCESS:
            return {
                ...state,
                loading: false,
                categoryItems: action.payload,
            };
        case GET_CATEGORY_ITEMS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case GET_CATEGORYITEM:
            return {
                ...state,
                categoryItems: action.payload,
            };
        case GET_CATEGORY_SUCCESS:
            return {
                ...state,
                category: action.payload,
            };
        case CREATE_CATEGORY_SUCCESS:
            return {
                ...state,
                category: [...state.category,action.payload],
            };
        case CREATE_CATEGORYITEM_SUCCESS:
            return {
                ...state,
                categoryItem: [...state.categoryItem,action.payload],
            };
        // case UPDATE_STOCK:
        //     return {
        //         ...state,
        //         update: action.payload,
        //         ingredients: state.ingredients.map((item) =>
        //             item.id === action.payload.id ? action.payload :item
        //         ),
        //     };
        case GET_CATEGORY_REQUEST1:
            return {
              ...state,
              loading: true,
              error: null,
            };
      
          case GET_CATEGORY_SUCCESS1:
            return {
              ...state,
              category: action.payload.content, // Danh sách danh mục
              pagination: { // Thông tin phân trang
                page: action.payload.number,
                size: action.payload.size,
                totalPages: action.payload.totalPages,
                totalElements: action.payload.totalElements,
              },
              loading: false,
            };
      
          case GETY_CATEGORY_FAILURE1:
            return {
              ...state,
              loading: false,
              error: action.payload,
            };
        default:
            return state;
    }
};
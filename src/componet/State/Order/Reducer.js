import {
  GET_ORDERS_FAILURE,
  GET_ORDERS_REQUEST,
  GET_ORDERS_SUCCESS,
  GET_ORDERSID_FAILURE,
  GET_ORDERSID_REQUEST,
  GET_ORDERSID_SUCCESS,
  GET_TOTAL_ORDERS_FAILURE,
  GET_TOTAL_ORDERS_REQUEST,
  GET_TOTAL_ORDERS_SUCCESS,
  GET_TOTAL_PRICE_ORDERS_FAILURE,
  GET_TOTAL_PRICE_ORDERS_REQUEST,
  GET_TOTAL_PRICE_ORDERS_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQUEST,
  GET_USERS_ORDERS_SUCCESS,
  UPDATE_ORDERS_FAILURE,
  UPDATE_ORDERS_REQUEST,
  UPDATE_ORDERS_SUCCESS,
} from "./ActionTypes";
const initialState = {
    orders: [],       // Danh sách đơn hàng
    loading: false,   // Trạng thái đang tải
    error: null,      // Lỗi nếu có
    page: 0,          // Trang hiện tại
    size: 10,         // Số phần tử trên mỗi trang
    totalElements: 0, // Tổng số phần tử
    totalPages: 0,    // Tổng số trang
    selectedOrder: null, // Chi tiết đơn hàng được chọn
    orderLoading: false, // Trạng thái loading cho chi tiết đơn hàng
    orderError: null,    // Lỗi khi lấy chi tiết đơn hàng
    updating: false,     // Trạng thái đang cập nhật đơn hàng
    updateError: null,   // Lỗi khi cập nhật đơn hàng
    updateSuccess: false, // Trạng thái cập nhật thành công
    totalRevenue: null,  // Tổng doanh thu
    revenueLoading: false, // Trạng thái đang tải tổng doanh thu
    revenueError: null,  // Lỗi khi tải tổng doanh thu
    totalOrders: null,   // Tổng số đơn hàng
    ordersLoading: false, // Trạng thái đang tải tổng số đơn hàng
    ordersError: null,   // Lỗi khi tải tổng số đơn hàng
};
export const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USERS_ORDERS_REQUEST:
      return { ...state, error: null, loading: true };
    case GET_USERS_ORDERS_SUCCESS:
      return { ...state, error: null, loading: false, orders: payload };
    case GET_USERS_ORDERS_FAILURE:
      return { ...state, error: payload, loading: false };

    case GET_ORDERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: payload.content, // Lấy danh sách đơn hàng từ payload
        page: payload.pageable.pageNumber,
        size: payload.pageable.pageSize,
        totalElements: payload.totalElements,
        totalPages: payload.totalPages,
      };

    case GET_ORDERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    // Lấy chi tiết đơn hàng theo ID
    case GET_ORDERSID_REQUEST:
      return {
        ...state,
        orderLoading: true,
        orderError: null,
        selectedOrder: null, // Reset chi tiết đơn hàng trước khi gọi API mới
      };

    case GET_ORDERSID_SUCCESS:
      return {
        ...state,
        orderLoading: false,
        selectedOrder: payload, // Lưu chi tiết đơn hàng từ API
        orderError: null,
      };

    case GET_ORDERSID_FAILURE:
      return {
        ...state,
        orderLoading: false,
        orderError: payload,
      };
    
      case UPDATE_ORDERS_REQUEST:
        return {
            ...state,
            updating: true,
            updateError: null,
            updateSuccess: false,
        };

    case UPDATE_ORDERS_SUCCESS:
        return {
            ...state,
            updating: false,
            updateError: null,
            updateSuccess: true,
            // Cập nhật trạng thái trong danh sách orders
            orders: state.orders.map((order) =>
                order.id === payload.id ? { ...order, orderStatus: payload.orderStatus } : order
            ),
        };

    case UPDATE_ORDERS_FAILURE:
        return {
            ...state,
            updating: false,
            updateError: payload,
            updateSuccess: false,
        };

        case GET_TOTAL_PRICE_ORDERS_REQUEST:
            return {
                ...state,
                revenueLoading: true,
                revenueError: null,
            };
        case GET_TOTAL_PRICE_ORDERS_SUCCESS:
            return {
                ...state,
                revenueLoading: false,
                totalRevenue: payload,
            };
        case GET_TOTAL_PRICE_ORDERS_FAILURE:
            return {
                ...state,
                revenueLoading: false,
                revenueError: payload,
            };

            case GET_TOTAL_ORDERS_REQUEST:
              return {
                  ...state,
                  ordersLoading: true,
                  ordersError: null,
              };
          case GET_TOTAL_ORDERS_SUCCESS:
              return {
                  ...state,
                  ordersLoading: false,
                  totalOrders: payload,
              };
          case GET_TOTAL_ORDERS_FAILURE:
              return {
                  ...state,
                  ordersLoading: false,
                  ordersError: payload,
              };

    default:
      return state;
  }
};

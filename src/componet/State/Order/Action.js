import { api } from "../../config/api";
import { CREATE_ORDER_FAILURE, CREATE_ORDER_REQUEST, CREATE_ORDER_SUCCESS, FILTE_TOTALORDERS_PRICE_FAILURE, FILTE_TOTALORDERS_PRICE_REQUEST, FILTE_TOTALORDERS_PRICE_SUCCESS, GET_ORDERS_FAILURE, GET_ORDERS_REQUEST, GET_ORDERS_SUCCESS, GET_ORDERSID_FAILURE, GET_ORDERSID_REQUEST, GET_ORDERSID_SUCCESS, GET_TOTAL_ORDERS_FAILURE, GET_TOTAL_ORDERS_REQUEST, GET_TOTAL_ORDERS_SUCCESS, GET_TOTAL_PRICE_ORDERS_FAILURE, GET_TOTAL_PRICE_ORDERS_REQUEST, GET_TOTAL_PRICE_ORDERS_SUCCESS, GET_USERS_ORDERS_FAILURE, GET_USERS_ORDERS_REQUEST, GET_USERS_ORDERS_SUCCESS, UPDATE_ORDERS_FAILURE, UPDATE_ORDERS_REQUEST, UPDATE_ORDERS_SUCCESS } from "./ActionTypes";

export const createOrder = (reqData) => {
    return async (dispatch) => {
        dispatch({type: CREATE_ORDER_REQUEST});
        try {
            const {data} = await api.post(`/api/order`, reqData.order,{
                headers:{
                    Authorization: `Bearer ${reqData.jwt}`,
                },
            });
            // Kiểm tra phản hồi từ backend và chuyển hướng người dùng đến URL thanh toán tương ứng
            if (data.vnpay_url) {
                window.location.href = data.vnpay_url;
            } else if (data.payment_url) {
                window.location.href = data.payment_url;
            } else if (data.paypal_url) {
                window.location.href = data.paypal_url;
            } else if (data.zalopay_url) {
                window.location.href = data.zalopay_url;
            } else if (data.momo_url) {
                window.location.href = data.momo_url;
            } else if (data.onepay_url) {  // Thêm điều kiện cho OnePay
                window.location.href = data.onepay_url;
            } else {
                console.log("No payment URL returned from backend", data);
            }
            console.log("created order data", data);
            dispatch({type:CREATE_ORDER_SUCCESS, payload:data});
        } catch (error) {
            console.log("error", error);
            dispatch({type:CREATE_ORDER_FAILURE, payload:error});
        }
    };
};
    

export const getUsersOrders = (jwt) => {
    return async (dispatch) => {
        dispatch({type: GET_USERS_ORDERS_REQUEST});
        try {
            const {data} = await api.get(`/api/order/user`, {
                headers:{
                    Authorization: `Bearer ${jwt}`,
                },
            });
            console.log("users order", data);
            dispatch({type: GET_USERS_ORDERS_SUCCESS, payload:data});
        } catch (error) {
            dispatch({type: GET_USERS_ORDERS_FAILURE, payload:error});
        }
    }
}

export const getOrders = (jwt, page = 0, size = 10) => {
    return async (dispatch) => {
        dispatch({ type: GET_ORDERS_REQUEST });
        try {
            const { data } = await api.get('/api/admin/orders', {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    page,
                    size,
                },
            });
            console.log('Orders data:', data);
            dispatch({ type: GET_ORDERS_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: GET_ORDERS_FAILURE,
                payload: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            });
        }
    };
};

export const getOrderById = (jwt, orderId) => {
    return async (dispatch) => {
        dispatch({ type: GET_ORDERSID_REQUEST });
        try {
            const { data } = await api.get(`/api/admin/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Order Detail:', data);
            dispatch({ type: GET_ORDERSID_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: GET_ORDERSID_FAILURE,
                payload: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            });
        }
    };
};

export const updateOrderStatus = (jwt, orderId, newStatus) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_ORDERS_REQUEST });
        try {
            const { data } = await api.put(
                `/api/admin/orders/${orderId}/status`,
                null,
                {
                    params: { status: newStatus },
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Trạng thái đơn hàng đã cập nhật:', data);
            dispatch({ type: UPDATE_ORDERS_SUCCESS, payload: data });
        } catch (error) {
            dispatch({
                type: UPDATE_ORDERS_FAILURE,
                payload: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
            });
        }
    };
};

export const getTotalPriceOrders = (jwt) => async (dispatch) => {
    dispatch({ type: GET_TOTAL_PRICE_ORDERS_REQUEST });

    try {
        const response = await api.get('/api/admin/orders/total-revenue', {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: GET_TOTAL_PRICE_ORDERS_SUCCESS,
            payload: response.data, // Tổng doanh thu trả về từ API
        });
    } catch (error) {
        dispatch({
            type: GET_TOTAL_PRICE_ORDERS_FAILURE,
            payload: error.message || 'Failed to fetch total revenue',
        });
    }
};

export const getTotalOrders = (jwt) => async (dispatch) => {
    dispatch({ type: GET_TOTAL_ORDERS_REQUEST });

    try {
        const response = await api.get('/api/admin/orders/total-orders', {
            headers: {
                Authorization: `Bearer ${jwt}`,
                'Content-Type': 'application/json',
            },
        });

        dispatch({
            type: GET_TOTAL_ORDERS_SUCCESS,
            payload: response.data, // Tổng số đơn hàng trả về từ API
        });
    } catch (error) {
        dispatch({
            type: GET_TOTAL_ORDERS_FAILURE,
            payload: error.message || 'Failed to fetch total orders',
        });
    }
};

export const filterTotalOrdersAndPrice = (startDate, endDate, jwt) => async (dispatch) => {
    try {
        dispatch({ type: FILTE_TOTALORDERS_PRICE_REQUEST });
        console.log("🔄 Đang gửi yêu cầu lấy tổng doanh thu và số đơn hàng...");

        const config = {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        };

        const { data } = await api.get(`/api/admin/orders/totalSalesAndOrders`, {
            params: { startDate, endDate },
            ...config,
        });

        console.log("✅ API thành công! Dữ liệu nhận được:", data);

        dispatch({
            type: FILTE_TOTALORDERS_PRICE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMessage = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        console.error("❌ API thất bại! Lỗi:", errorMessage);

        dispatch({
            type: FILTE_TOTALORDERS_PRICE_FAILURE,
            payload: errorMessage,
        });
    }
};

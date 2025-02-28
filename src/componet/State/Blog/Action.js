import { api } from "../../config/api";
import { CREATE_BLOG_FAILURE, CREATE_BLOG_REQUEST, CREATE_BLOG_SUCCESS, DELETE_BLOG_FAILURE, DELETE_BLOG_REQUEST, DELETE_BLOG_SUCCESS, GET_BLOG_FAILURE, GET_BLOG_REQUEST, GET_BLOG_SUCCESS, GETTOP3_BLOG_FAILURE, GETTOP3_BLOG_REQUEST, GETTOP3_BLOG_SUCCESS, UPDATE_BLOG_FAILURE, UPDATE_BLOG_REQUEST, UPDATE_BLOG_SUCCESS } from "./ActionType";

const getAuthHeader = () => {
    const jwt = localStorage.getItem('jwt'); // Giả sử JWT được lưu trong localStorage
    return {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
    };
};

/** 📌 1. Lấy Blog theo ID */
export const getBlogById = (id) => async (dispatch) => {
    dispatch({ type: GET_BLOG_REQUEST });
    try {
        const response = await api.get(`/api/admin/blog/${id}`, getAuthHeader());
        dispatch({ type: GET_BLOG_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_BLOG_FAILURE, payload: error.message });
    }
};

/** 📌 2. Thêm Blog mới */
export const createBlog = (formData, jwt) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_BLOG_REQUEST });
  
        try {
            console.log("📡 Gửi request đến API...");
  
            const { data } = await api.post('/api/admin/blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwt}`,
                },
            });
  
            console.log("✅ API Response:", data);
  
            dispatch({
                type: CREATE_BLOG_SUCCESS,
                payload: data,
            });
        } catch (error) {
            console.error("❌ API Error:", error);
            dispatch({
                type: CREATE_BLOG_FAILURE,
                payload: error.response?.data || error.message,
            });
        }
    };
  };
  


/** 📌 3. Cập nhật Blog */
export const updateBlog = (id, formData, jwt) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLOG_REQUEST });
  
        try {
            console.log(`📡 Gửi request cập nhật blog ID: ${id}...`);
  
            const { data } = await api.put(`/api/admin/blog/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${jwt}`,
                },
            });
  
            console.log("✅ API Response:", data);
  
            dispatch({
                type: UPDATE_BLOG_SUCCESS,
                payload: data,
            });
        } catch (error) {
            console.error("❌ API Error:", error);
            dispatch({
                type: UPDATE_BLOG_FAILURE,
                payload: error.response?.data || error.message,
            });
        }
    };
  };
  

/** 📌 4. Xóa Blog */
export const deleteBlog = (id) => async (dispatch) => {
    dispatch({ type: DELETE_BLOG_REQUEST });
    try {
        await api.delete(`/api/admin/blog/${id}`, getAuthHeader());
        dispatch({ type: DELETE_BLOG_SUCCESS, payload: id });
    } catch (error) {
        dispatch({ type: DELETE_BLOG_FAILURE, payload: error.message });
    }
};

/** 📌 5. Phân trang Blog */
export const getBlogsPaginated = (page = 0, size = 5) => async (dispatch) => {
    dispatch({ type: GET_BLOG_REQUEST });
    try {
        const response = await api.get(`/api/admin/blog/page?page=${page}&size=${size}`, getAuthHeader());
        dispatch({ type: GET_BLOG_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GET_BLOG_FAILURE, payload: error.message });
    }
};

export const getTop3Blogs = () => async (dispatch) => {
    dispatch({ type: GETTOP3_BLOG_REQUEST });
    try {
        const response = await api.get('/blog/getTop3New');
        dispatch({ type: GETTOP3_BLOG_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: GETTOP3_BLOG_FAILURE, payload: error.message });
    }
};


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { getTotalPriceOrders, getTotalOrders } from '../../componet/State/Order/Action';
import { countAvailableProducts, countTotalProducts } from '../../componet/State/Product/Action';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RestaurantDashboard = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const {
    totalRevenue, revenueLoading, revenueError,
    totalOrders, ordersLoading, ordersError,
    availableProductCount, productLoading, productError,
    totalProductCount
  } = useSelector((state) => ({
    totalRevenue: state.order.totalRevenue,
    revenueLoading: state.order.revenueLoading,
    revenueError: state.order.revenueError,
    totalOrders: state.order.totalOrders,
    ordersLoading: state.order.ordersLoading,
    ordersError: state.order.ordersError,
    availableProductCount: state.product.availableProductCount,
    productLoading: state.product.loading,
    productError: state.product.error,
    totalProductCount: state.product.productCount,
  }));

  // Gọi API lấy dữ liệu mặc định khi vào trang
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      dispatch(getTotalPriceOrders(jwt));
      dispatch(getTotalOrders(jwt));
      dispatch(countAvailableProducts({ jwt }));
      dispatch(countTotalProducts({ jwt }));
    } else {
      console.error('JWT not found in localStorage');
    }
  }, [dispatch]);

  return (
    <Box sx={{ padding: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        📊 Thống Kê
      </Typography>

      {/* Hiển thị trạng thái loading hoặc lỗi */}
      {revenueLoading && <Typography>Đang tải doanh thu...</Typography>}
      {revenueError && <Typography color="error">{revenueError}</Typography>}
      {ordersLoading && <Typography>Đang tải tổng số đơn hàng...</Typography>}
      {ordersError && <Typography color="error">{ordersError}</Typography>}
      {productLoading && <Typography>Đang tải số lượng sản phẩm...</Typography>}
      {productError && <Typography color="error">{productError}</Typography>}

      {/* Hàng đầu tiên: Tổng Doanh Thu + Tổng Đơn Hàng */}
      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">💵 Tổng Doanh Thu</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                {totalRevenue?.toLocaleString() || 0} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">📦 Tổng Đơn Hàng</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
                {totalOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Hàng thứ hai: Sản Phẩm Đang Bán + Tổng số sản phẩm */}
      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">🛍️ Sản Phẩm Đang Bán</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#D84315' }}>
                {availableProductCount !== null ? availableProductCount : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">📦 Tổng Số Sản Phẩm</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#FFA000' }}>
                {totalProductCount !== null ? totalProductCount : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantDashboard;

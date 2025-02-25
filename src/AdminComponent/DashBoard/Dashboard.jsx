import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { getTotalPriceOrders, getTotalOrders } from '../../componet/State/Order/Action';
import { countAvailableProducts } from '../../componet/State/Product/Action'; // Import action để đếm sản phẩm đang bán

const RestaurantDashboard = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const {
    totalRevenue,
    revenueLoading,
    revenueError,
    totalOrders,
    ordersLoading,
    ordersError,
    availableProductCount, // Lấy số lượng sản phẩm đang bán
    productLoading,
    productError,
  } = useSelector((state) => ({
    totalRevenue: state.order.totalRevenue, // Tổng doanh thu
    revenueLoading: state.order.revenueLoading, // Trạng thái đang tải doanh thu
    revenueError: state.order.revenueError, // Lỗi khi tải doanh thu
    totalOrders: state.order.totalOrders, // Tổng số đơn hàng
    ordersLoading: state.order.ordersLoading, // Trạng thái đang tải tổng số đơn hàng
    ordersError: state.order.ordersError, // Lỗi khi tải tổng số đơn hàng
    availableProductCount: state.product.availableProductCount, // Tổng số sản phẩm đang bán
    productLoading: state.product.loading, // Trạng thái loading khi lấy số lượng sản phẩm
    productError: state.product.error, // Lỗi khi lấy số lượng sản phẩm
  }));

  // Gọi API khi component được mount
  useEffect(() => {
    const jwt = localStorage.getItem('jwt'); // Lấy JWT từ localStorage
    if (jwt) {
      dispatch(getTotalPriceOrders(jwt)); // Gọi action lấy tổng doanh thu
      dispatch(getTotalOrders(jwt)); // Gọi action lấy tổng số đơn hàng
      dispatch(countAvailableProducts({ jwt })); // Gọi action lấy số lượng sản phẩm đang bán
    } else {
      console.error('JWT not found in localStorage');
    }
  }, [dispatch]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        📊 Thống Kê
      </Typography>
      {revenueLoading && <Typography>Đang tải doanh thu...</Typography>}
      {revenueError && <Typography color="error">{revenueError}</Typography>}
      {ordersLoading && <Typography>Đang tải tổng số đơn hàng...</Typography>}
      {ordersError && <Typography color="error">{ordersError}</Typography>}
      {productLoading && <Typography>Đang tải số lượng sản phẩm...</Typography>}
      {productError && <Typography color="error">{productError}</Typography>}

      <Grid container spacing={2}>
        {/* Tổng Doanh Thu */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">💵 Tổng Doanh Thu</Typography>
              <Typography variant="h4">
                {totalRevenue ? totalRevenue.toLocaleString() : 0} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng Số Đơn Hàng */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">📦 Tổng Đơn Hàng</Typography>
              <Typography variant="h4">
                {totalOrders !== null ? totalOrders : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tổng Số Khách Hàng */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">👥 Tổng Khách Hàng</Typography>
              <Typography variant="h4">300</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sản Phẩm Đang Bán */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">🛍️ Sản Phẩm Đang Bán</Typography>
              <Typography variant="h4">
                {availableProductCount !== null ? availableProductCount : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default RestaurantDashboard;

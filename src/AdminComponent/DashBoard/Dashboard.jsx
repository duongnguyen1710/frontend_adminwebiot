import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box, Button, TextField } from '@mui/material';
import { getTotalPriceOrders, getTotalOrders } from '../../componet/State/Order/Action';
import { countAvailableProducts } from '../../componet/State/Product/Action';
import { filterTotalOrdersAndPrice } from '../../componet/State/Order/Action'; // ✅ Import action filter

const RestaurantDashboard = () => {
  const dispatch = useDispatch();
  
  // State lưu trữ ngày bắt đầu và kết thúc để filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Lấy dữ liệu từ Redux store
  const {
    totalRevenue, revenueLoading, revenueError,
    totalOrders, ordersLoading, ordersError,
    availableProductCount, productLoading, productError,
    filteredTotalSales, filteredTotalOrders, filterLoading, filterError
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
    filteredTotalSales: state.order.filteredTotalSales, // ✅ Doanh thu sau khi lọc
    filteredTotalOrders: state.order.filteredTotalOrders, // ✅ Đơn hàng sau khi lọc
    filterLoading: state.order.filterLoading, // ✅ Trạng thái loading khi lọc
    filterError: state.order.filterError, // ✅ Lỗi khi lọc
  }));

  // Gọi API lấy dữ liệu mặc định khi vào trang
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      dispatch(getTotalPriceOrders(jwt));
      dispatch(getTotalOrders(jwt));
      dispatch(countAvailableProducts({ jwt }));
    } else {
      console.error('JWT not found in localStorage');
    }
  }, [dispatch]);

  // Hàm xử lý filter doanh thu & đơn hàng theo ngày
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
      return;
    }

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      dispatch(filterTotalOrdersAndPrice(`${startDate}T00:00:00`, `${endDate}T23:59:59`, jwt));
    }
  };

  // Hàm reload lại trang (hoặc gọi lại API lấy dữ liệu ban đầu)
  const handleReload = () => {
    window.location.reload(); // Cách đơn giản nhất để reload trang
    // Hoặc gọi lại các API ban đầu:
    // dispatch(getTotalPriceOrders(jwt));
    // dispatch(getTotalOrders(jwt));
    // dispatch(countAvailableProducts({ jwt }));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        📊 Thống Kê
      </Typography>

      {/* Ô nhập ngày và nút filter */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}>
        <TextField
          type="date"
          label="Từ ngày"
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          type="date"
          label="Đến ngày"
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFilter} disabled={filterLoading}>
          {filterLoading ? "Đang lọc..." : "Lọc"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReload}>
          🔄 Làm mới
        </Button>
      </Box>

      {/* Hiển thị trạng thái loading hoặc lỗi */}
      {revenueLoading && <Typography>Đang tải doanh thu...</Typography>}
      {revenueError && <Typography color="error">{revenueError}</Typography>}
      {ordersLoading && <Typography>Đang tải tổng số đơn hàng...</Typography>}
      {ordersError && <Typography color="error">{ordersError}</Typography>}
      {productLoading && <Typography>Đang tải số lượng sản phẩm...</Typography>}
      {productError && <Typography color="error">{productError}</Typography>}
      {filterError && <Typography color="error">{filterError}</Typography>}

      {/* Hàng đầu tiên: Tổng Doanh Thu + Tổng Đơn Hàng */}
      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">💵 Tổng Doanh Thu</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                {filteredTotalSales !== 0 ? filteredTotalSales.toLocaleString() : totalRevenue?.toLocaleString() || 0} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={5}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">📦 Tổng Đơn Hàng</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
                {filteredTotalOrders !== 0 ? filteredTotalOrders : totalOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Hàng thứ hai: Sản Phẩm Đang Bán */}
      <Grid container spacing={3} justifyContent="center" sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={8} md={5}>
          <Card sx={{ textAlign: 'center', boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6">🛍️ Sản Phẩm Đang Bán</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#D84315' }}>
                {availableProductCount !== null ? availableProductCount : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantDashboard;

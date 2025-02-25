import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box, Button, TextField } from '@mui/material';
import { getTotalPriceOrders, getTotalOrders } from '../../componet/State/Order/Action';
import { countAvailableProducts } from '../../componet/State/Product/Action';
import { filterTotalOrdersAndPrice } from '../../componet/State/Order/Action';
import { ToastContainer, toast } from 'react-toastify'; // ✅ Import ToastContainer & toast
import 'react-toastify/dist/ReactToastify.css';

const RestaurantDashboard = () => {
  const dispatch = useDispatch();

  // State lưu trữ ngày giờ bắt đầu và kết thúc để filter
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

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
    filteredTotalSales: state.order.filteredTotalSales,
    filteredTotalOrders: state.order.filteredTotalOrders,
    filterLoading: state.order.filterLoading,
    filterError: state.order.filterError,
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

  // Hàm xử lý filter doanh thu & đơn hàng theo ngày + giờ
  const handleFilter = () => {
    if (!startDateTime || !endDateTime) {
      toast.warn("⚠️ Vui lòng chọn ngày giờ bắt đầu và ngày giờ kết thúc!");
      return;
    }

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      dispatch(filterTotalOrdersAndPrice(startDateTime, endDateTime, jwt)).then(() => {
        if (filteredTotalSales === 0 && filteredTotalOrders === 0) {
          toast.info("🔍 Không có kết quả hợp lệ!");
        } else {
          toast.success("Kết quả tìm kiếm");
        }
      });
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <ToastContainer position="top-right" autoClose={3000} /> {/* ✅ Thêm ToastContainer */}
      
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        📊 Thống Kê
      </Typography>

      {/* Ô nhập ngày và giờ + nút filter */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 3 }}>
        <TextField
          type="datetime-local"
          label="Từ ngày & giờ"
          InputLabelProps={{ shrink: true }}
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
        />
        <TextField
          type="datetime-local"
          label="Đến ngày & giờ"
          InputLabelProps={{ shrink: true }}
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFilter} disabled={filterLoading}>
          {filterLoading ? "Đang lọc..." : "Lọc"}
        </Button>
        <Button
          variant="contained"
          onClick={() => window.location.reload()} // Tải lại trang
          sx={{
            backgroundColor: '#1976D2',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#1565C0',
            }
          }}
        >
          Làm mới
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

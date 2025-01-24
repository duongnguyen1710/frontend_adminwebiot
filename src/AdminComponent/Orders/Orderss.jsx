import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../../componet/State/Order/Action";

// Danh sách các phương thức thanh toán
const paymentTypes = {
  1: "VnPay",
  3: "Stripe",
  4: "Tiền mặt",
};
const paymentStatuses = ["Chưa thanh toán", "Đã thanh toán"];
const statusOptions = [
  "Chưa giải quyết",
  "Đang giao hàng",
  "Đã nhận hàng",
  "Hoàn thành",
];

// Màu sắc cho trạng thái đơn hàng
const statusColors = {
  "Chưa giải quyết": "warning", // Vàng
  "Đang giao hàng": "info", // Xanh nhạt
  "Đã nhận hàng": "primary", // Xanh đậm
  "Đã hoàn thành đơn": "success", // Xanh lá
};

const Orders = () => {
  const dispatch = useDispatch();
  const {
    orders,
    page,
    size,
    totalPages,
    loading,
    error,
    selectedOrder,
    orderLoading,
    updating,
    updateSuccess,
    updateError,
  } = useSelector((state) => state.order);

  const jwt = localStorage.getItem("jwt");
  const [currentPage, setCurrentPage] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hasUpdated, setHasUpdated] = useState(false);

  useEffect(() => {
    if (jwt) {
      dispatch(getOrders(jwt, currentPage, 10));
    }
  }, [dispatch, jwt, currentPage]);

  useEffect(() => {
    updateVisiblePages();
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (hasUpdated && updateSuccess) {
      alert("✅ Cập nhật trạng thái thành công!");
      setHasUpdated(false);
      setAnchorEl(null);
    }
    if (hasUpdated && updateError) {
      alert(`❌ Lỗi: ${updateError}`);
      setHasUpdated(false);
    }
  }, [updateSuccess, updateError, hasUpdated]);

  const updateVisiblePages = () => {
    const maxVisible = 3;
    let startPage = Math.max(0, currentPage - 1);
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(0, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    setVisiblePages(pages);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleOpenModal = (orderId) => {
    dispatch(getOrderById(jwt, orderId)); // Gọi API lấy chi tiết đơn hàng
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusSelect = (newStatus) => {
    if (selectedOrder) {
      dispatch(updateOrderStatus(jwt, selectedOrder.id, newStatus));
      setHasUpdated(true); // Đặt cờ đã thực hiện cập nhật
      setAnchorEl(null);
    }
  };

  return (
    <Box p={3}>
      <Card>
        <Typography variant="h5" sx={{ p: 2, textAlign: "center" }}>
          📦 Quản lý Đơn Hàng
        </Typography>

        {/* Loading */}
        {loading && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 4 }}
          >
            <CircularProgress />
          </Stack>
        )}

        {/* Error */}
        {error && (
          <Typography variant="h6" color="error" align="center" sx={{ p: 2 }}>
            ❌ {error}
          </Typography>
        )}

        {/* Danh sách đơn hàng */}
        {!loading && !error && (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày tạo</TableCell>
                    <TableCell>Phương thức thanh toán</TableCell>
                    <TableCell>Trạng thái thanh toán</TableCell>
                    <TableCell>Tổng số lượng</TableCell>
                    <TableCell>Tổng giá</TableCell>
                    <TableCell>Chi tiết</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} hover>
                      
                      <TableCell>
                        <Chip
                          label={order.orderStatus}
                          color={statusColors[order.orderStatus] || "default"}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.createAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                      {paymentTypes[order.paymentType] || "Không xác định"}
                        </TableCell>
                      <TableCell>
                        {paymentStatuses[order.statusPayment]}
                      </TableCell>
                      <TableCell>{order.totalItem}</TableCell>
                      <TableCell>
                        {order.totalPrice.toLocaleString()} VND
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleOpenModal(order.id)}
                        >
                          Xem
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Phân trang */}
            <Stack direction="row" justifyContent="center" spacing={1} p={2}>
              <Button onClick={() => handlePageChange(currentPage - 1)}>
                ←
              </Button>
              {visiblePages.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  variant={
                    currentPage === pageNumber ? "contained" : "outlined"
                  }
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber + 1}
                </Button>
              ))}
              <Button onClick={() => handlePageChange(currentPage + 1)}>
                →
              </Button>
            </Stack>
          </>
        )}

        {/* Modal Chi Tiết Đơn Hàng */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>📋 Chi Tiết Đơn Hàng</DialogTitle>
          <DialogContent>
            {orderLoading ? (
              <CircularProgress />
            ) : selectedOrder ? (
              <>
                <Typography variant="h6">📍 Địa chỉ giao hàng:</Typography>
                <Typography>
                  Họ tên: {selectedOrder.deliveryAddress.fullName}
                </Typography>
                <Typography>
                  Điện thoại: {selectedOrder.deliveryAddress.phone}
                </Typography>
                <Typography>
                  Địa chỉ: {selectedOrder.deliveryAddress.fullAddress}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">🛒 Sản phẩm:</Typography>
                {selectedOrder.items.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      p: 1,
                    }}
                  >
                    {/* Ảnh Sản Phẩm */}
                    <img
                      src={
                        item.product.images && item.product.images.length > 0
                          ? item.product.images[0]
                          : "https://via.placeholder.com/100"
                      }
                      alt={item.product.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                      }}
                    />

                    {/* Thông Tin Sản Phẩm */}
                    <Box>
                      <Typography>
                        <b>{item.product.name}</b> - {item.quantity} x{" "}
                        {item.totalPrice.toLocaleString()} VND
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Giá mỗi sản phẩm: {item.product.price.toLocaleString()}{" "}
                        VND
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">⚙️ Trạng thái đơn hàng:</Typography>
                <Button variant="outlined" onClick={handleStatusClick}>
                  {selectedOrder.orderStatus}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {statusOptions.map((status) => (
                    <MenuItem
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </Card>
    </Box>
  );
};

export default Orders;

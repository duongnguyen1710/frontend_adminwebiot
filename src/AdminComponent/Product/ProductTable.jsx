import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  deleteProduct,
  getProductRestaurantId,
  updateProduct,
  updateProductStatus,
} from "../../componet/State/Product/Action";
import {
  getCategory,
  getCategoryItems,
} from "../../componet/State/CategoryTest/Action";
import { toast, ToastContainer } from "react-toastify";

export default function ProductTable() {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant, product, category } = useSelector((store) => store);

  // State cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  // State cho popup
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    categoryItem: "",
    images: [],
    status: 1, // Mặc định là "Còn hàng"
    restaurantId: restaurant?.usersRestaurant?.id || null,
  });

  useEffect(() => {
    if (restaurant?.usersRestaurant?.id) {
      // Gọi API lấy sản phẩm
      dispatch(
        getProductRestaurantId({
          jwt,
          restaurantId: restaurant.usersRestaurant.id,
          page: currentPage,
          size: pageSize,
        })
      );

      // Gọi API lấy danh mục
      dispatch(
        getCategory({
          id: restaurant.usersRestaurant.id,
          jwt,
        })
      );
    }
  }, [dispatch, jwt, restaurant?.usersRestaurant?.id, currentPage, pageSize]);

  // Gọi API lấy danh mục con khi danh mục cha thay đổi
  useEffect(() => {
    if (formData.category) {
      dispatch(
        getCategoryItems({
          categoryId: formData.category,
          restaurantId: restaurant?.usersRestaurant?.id,
        })
      );
    }
  }, [dispatch, formData.category, restaurant?.usersRestaurant?.id]);

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    if (page >= 0 && page < product.pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Xử lý cập nhật trạng thái sản phẩm
  const handleUpdateStatus = (product) => {
    const newStatus = product.status === 1 ? 0 : 1; // Đảo trạng thái
    dispatch(updateProductStatus(product.id, newStatus, jwt))
      .then(() => {
        dispatch(
          getProductRestaurantId({
            jwt,
            restaurantId: restaurant.usersRestaurant.id,
            page: currentPage,
            size: pageSize,
          })
        );
        toast.success("✅ Cập nhật trạng thái thành công!");
      })
      .catch(() => {
        toast.error("❌ Cập nhật trạng thái thất bại!");
      });
  };
  

  // Xử lý mở/đóng popup
  const handleOpen = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      categoryItem: "",
      images: [],
      status: 1, // Mặc định là "Còn hàng"
      restaurantId: restaurant?.usersRestaurant?.id || null,
    });
    setOpen(true); // Mở popup
  };

  const handleClose = () => setOpen(false);

  // Xử lý thay đổi giá trị trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý nút "Tạo"
  const handleCreateProduct = () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price), // Chuyển thành số
      category: { id: formData.category }, // Đối tượng danh mục cha
      categoryItem: { id: formData.categoryItem }, // Đối tượng danh mục con
      images: formData.images, // Danh sách URL hình ảnh
      restaurantId: formData.restaurantId, // ID nhà hàng
    };

    // Kiểm tra dữ liệu trước khi gửi

    dispatch(createProduct(productData, jwt)).then(() => {
      handleClose(); // Đóng popup
      dispatch(
        getProductRestaurantId({
          jwt,
          restaurantId: restaurant.usersRestaurant.id,
          page: currentPage,
          size: pageSize,
        })
      ); // Cập nhật danh sách sản phẩm
    });
  };

  const handleEditProduct = (product) => {
    setFormData({
      id: product.id, // Thêm ID sản phẩm để phân biệt chỉnh sửa
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category?.id || "",
      categoryItem: product.categoryItem?.id || "",
      images: product.images || [],
      status: product.status,
      restaurantId: product.restaurantId,
    });
    setOpen(true); // Mở popup
  };

  const handleSaveProduct = () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      category: { id: formData.category },
      categoryItem: { id: formData.categoryItem },
      images: formData.images,
      restaurantId: formData.restaurantId,
      status: formData.status,
    };

    if (formData.id) {
      // Nếu đang sửa sản phẩm
      dispatch(updateProduct(formData.id, productData, jwt)).then(() => {
        handleClose();
        dispatch(
          getProductRestaurantId({
            jwt,
            restaurantId: restaurant.usersRestaurant.id,
            page: currentPage,
            size: pageSize,
          })
        );
      });
    } else {
      // Nếu đang tạo sản phẩm
      dispatch(createProduct(productData, jwt)).then(() => {
        handleClose();
        dispatch(
          getProductRestaurantId({
            jwt,
            restaurantId: restaurant.usersRestaurant.id,
            page: currentPage,
            size: pageSize,
          })
        );
      });
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      dispatch(deleteProduct(productId, jwt)).then(() => {
        // Cập nhật danh sách sản phẩm sau khi xóa
        dispatch(
          getProductRestaurantId({
            jwt,
            restaurantId: restaurant.usersRestaurant.id,
            page: currentPage,
            size: pageSize,
          })
        );
      });
    }
  };

  return (
    <Box>
      <ToastContainer />
      <Card className="mt-1">
        <CardHeader
          action={
            <IconButton onClick={handleOpen} aria-label="settings">
              <CreateIcon />
            </IconButton>
          }
          title={"Sản phẩm"}
          sx={{ pt: 2, alignItems: "center" }}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Ảnh</TableCell>
                <TableCell align="right">Tên sản phẩm</TableCell>
                <TableCell align="right">Danh mục cha</TableCell>
                <TableCell align="right">Danh mục con</TableCell>
                <TableCell align="right">Giá</TableCell>
                <TableCell align="right">Trạng thái</TableCell>
                <TableCell align="right">Cập nhật</TableCell>
                <TableCell align="right">Xóa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product.products.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Avatar src={item.images[0]} />
                  </TableCell>
                  <TableCell align="right">{item.name}</TableCell>
                  <TableCell align="right">
                    {item.category ? item.category.name : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {item.categoryItem ? (
                      Array.isArray(item.categoryItem) ? (
                        item.categoryItem.map((categoryItem) => (
                          <Chip
                            key={categoryItem.id}
                            label={categoryItem.name}
                          />
                        ))
                      ) : (
                        <Chip
                          key={item.categoryItem.id}
                          label={item.categoryItem.name}
                        />
                      )
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell align="right">{item.price} VND</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateStatus(item)} // ✅ Thêm xử lý cập nhật trạng thái
                      style={{
                        backgroundColor: item.status === 1 ? "green" : "red",
                      }}
                    >
                      {item.status === 1 ? "Còn Hàng" : "Hết Hàng"}
                    </Button>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditProduct(item)}
                    >
                      <CreateIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleDeleteProduct(item.id)} // Gọi hàm xóa khi nhấn
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Phân trang */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            &lt;
          </Button>
          {Array.from({ length: 3 }, (_, i) => {
            const page = Math.max(0, currentPage - 1) + i;
            return page < product.pagination.totalPages ? (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={page === currentPage ? "contained" : "outlined"}
              >
                {page + 1}
              </Button>
            ) : null;
          })}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= product.pagination.totalPages}
          >
            &gt;
          </Button>
        </Box>
      </Card>

      {/* Popup tạo sản phẩm */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {formData.id ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Tên sản phẩm"
            fullWidth
            margin="dense"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Mô tả"
            fullWidth
            margin="dense"
            value={formData.description}
            onChange={handleInputChange}
          />
          <TextField
            name="price"
            label="Giá"
            fullWidth
            margin="dense"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
          />
          <TextField
            name="category"
            label="Danh mục cha"
            fullWidth
            margin="dense"
            select
            value={formData.category}
            onChange={(e) => {
              const categoryId = e.target.value;
              setFormData((prev) => ({
                ...prev,
                category: categoryId,
                categoryItem: "",
              }));
              dispatch(
                getCategoryItems({
                  categoryId,
                  restaurantId: formData.restaurantId,
                })
              ); // Lấy danh mục con
            }}
          >
            {category?.category?.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="categoryItem"
            label="Danh mục con"
            fullWidth
            margin="dense"
            select
            value={formData.categoryItem}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, categoryItem: e.target.value }))
            }
            disabled={!formData.category}
          >
            {category?.categoryItems?.length > 0 ? (
              category.categoryItems.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                {formData.category
                  ? "Không có danh mục con"
                  : "Vui lòng chọn danh mục cha trước"}
              </MenuItem>
            )}
          </TextField>
          <Box mt={2}>
            <TextField
              name="images"
              label="Đường dẫn ảnh"
              fullWidth
              margin="dense"
              value={formData.images.join(", ")} // Hiển thị các đường dẫn dưới dạng chuỗi, ngăn cách bởi dấu phẩy
              onChange={(e) => {
                const imageUrls = e.target.value
                  .split(",")
                  .map((url) => url.trim());
                setFormData((prev) => ({ ...prev, images: imageUrls }));
              }}
              placeholder="Nhập các đường dẫn ảnh, cách nhau bằng dấu phẩy"
            />
            <Box mt={1} display="flex" flexDirection="column">
              {formData.images.length > 0 &&
                formData.images.map((img, index) => (
                  <Avatar
                    key={index}
                    src={img}
                    alt={`preview-${index}`}
                    sx={{ width: 56, height: 56, marginBottom: 1 }}
                  />
                ))}
            </Box>
          </Box>

          <TextField
            name="status"
            label="Trạng thái"
            fullWidth
            margin="dense"
            select
            value={formData.status}
            onChange={handleInputChange}
          >
            <MenuItem value={1}>Còn hàng</MenuItem>
            <MenuItem value={2}>Hết hàng</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveProduct}>
            {formData.id ? "Lưu" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import CreateCategoryParent from "./CreateCategoryParent";
import { deleteCategory, getCategory, getCategory1 } from "../../componet/State/CategoryTest/Action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function CategoryParentTable() {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // Dùng để lưu danh mục khi sửa
  const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
  const [pageSize] = useState(10); // Số mục trên mỗi trang
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang

  const dispatch = useDispatch();
  const { restaurant, category } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");

  // Gọi API lấy danh mục khi component mount hoặc khi phân trang thay đổi
  useEffect(() => {
    if (restaurant?.usersRestaurant?.id) {
      dispatch(
        getCategory1({
          id: restaurant.usersRestaurant.id,
          jwt,
          page: currentPage,
          size: pageSize,
        })
      ).then((response) => {
        setTotalPages(response.payload?.totalPages || 0); // Cập nhật tổng số trang
      });
    }
  }, [dispatch, restaurant?.usersRestaurant?.id, jwt, currentPage, pageSize]);

  // Mở Modal
  const handleOpen = () => {
    setSelectedCategory(null); // Reset dữ liệu sửa
    setOpen(true);
  };

  // Đóng Modal
  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
  };

  // Chỉnh sửa danh mục
  const handleEdit = (category) => {
    setSelectedCategory(category); // Lưu thông tin danh mục vào state
    setOpen(true); // Mở modal
  };

  // Thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage); // Cập nhật trang hiện tại
    }
  };

  return (
    <div>
      <Box>
        <Card className="mt-1">
          <CardHeader
            action={
              <IconButton onClick={handleOpen} aria-label="settings">
                <CreateIcon />
              </IconButton>
            }
            title={"Danh mục"}
            sx={{ pt: 2, alignItems: "center" }}
          />

          <TableContainer component={Paper}>
            <Table sx={{ minHeight: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">ID</TableCell>
                  <TableCell align="left">Tên</TableCell>
                  <TableCell align="center">Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category?.category?.length > 0 ? (
                  category.category.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.id}
                      </TableCell>
                      <TableCell align="left">{item.name}</TableCell>
                      <TableCell align="center">
                        {/* Nút Sửa */}
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(item)}
                        >
                          <EditIcon />
                        </IconButton>
                        {/* Nút Xóa */}
                        <IconButton
                          color="error"
                          onClick={() =>
                            dispatch(deleteCategory({ id: item.id, jwt }))
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Không có danh mục nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Phân trang */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Trang trước
          </Button>
          <Box mx={2}>
            Trang {currentPage + 1} / {totalPages}
          </Box>
          <Button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Trang sau
          </Button>
        </Box>

        {/* Modal Thêm/Sửa */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {/* Truyền selectedCategory nếu chỉnh sửa */}
            <CreateCategoryParent
              category={selectedCategory}
              onClose={handleClose}
            />
          </Box>
        </Modal>
      </Box>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import CreateIcon from "@mui/icons-material/Create";
import { getCategory1 } from "../../componet/State/CategoryTest/Action";

const CategoryParent = () => {
  const dispatch = useDispatch();
  const { category, pagination, loading } = useSelector(
    (state) => state.categoryTestReducer
  );

  const jwt = localStorage.getItem("jwt");
  const restaurantId = 1; // Thay bằng ID nhà hàng thực tế nếu có

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5; // Số danh mục mỗi trang

  useEffect(() => {
    // Gọi API lấy danh mục khi trang hoặc pageSize thay đổi
    dispatch(
      getCategory1({
        id: restaurantId,
        jwt,
        page: currentPage,
        size: pageSize,
      })
    );
  }, [dispatch, jwt, restaurantId, currentPage, pageSize]);

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title="Danh mục"
          action={
            <IconButton>
              <CreateIcon />
            </IconButton>
          }
        />

        {/* Hiển thị bảng danh mục */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="left">Tên danh mục</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : category.length > 0 ? (
                category.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell align="left">{category.id}</TableCell>
                    <TableCell align="left">{category.name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Không có danh mục nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Phân trang */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Trang trước
          </Button>
          <Box mx={2}>
            Trang {currentPage + 1} / {pagination.totalPages}
          </Box>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage + 1 >= pagination.totalPages}
          >
            Trang sau
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CategoryParent;

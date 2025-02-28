import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  deleteBlog,
  getBlogsPaginated,
  updateBlog,
} from "../../componet/State/Blog/Action";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const BlogManagement = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.blog
  );

  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingBlog, setEditingBlog] = useState({
    id: null,
    title: "",
    content: "",
    category: "",
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("");

  const categories = ["Tài liệu học tập", "Hướng dẫn thực hành", "Khác"];

  useEffect(() => {
    dispatch(getBlogsPaginated(page - 1, 5));
  }, [dispatch, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Xử lý Thêm Mới hoặc Cập Nhật Blog
  const handleAddOrUpdateBlog = () => {
    const formData = new FormData();

    // Gửi object blog dưới dạng JSON
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            title: editingBlog.title,
            content: editingBlog.content,
            category: editingBlog.category,
          }),
        ],
        { type: "application/json" }
      ) // Định dạng JSON chính xác
    );

    // Gửi ảnh nếu có
    if (selectedImages && selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append("images", image); // Gửi từng file ảnh lên
      });
    }

    // Lấy JWT từ localStorage
    const jwt = localStorage.getItem("jwt");

    // Gửi request tạo blog
    dispatch(createBlog(formData, jwt));

    setEditingBlog({
      id: null,
      title: "",
      content: "",
      category: "",
      images: [],
    });
    setSelectedImages([]);
    setOpenDialog(false);
    setIsEditMode(false);
  };

  const handleUpdateBlog = () => {
    const formData = new FormData();

    // Gửi object blog dưới dạng JSON
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            title: editingBlog.title,
            content: editingBlog.content,
            category: editingBlog.category,
            images: editingBlog.images, // Giữ ảnh cũ nếu không có ảnh mới
          }),
        ],
        { type: "application/json" }
      )
    );

    // Gửi ảnh mới nếu có
    if (selectedImages && selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Lấy JWT từ localStorage
    const jwt = localStorage.getItem("jwt");

    // Gửi request cập nhật blog
    dispatch(updateBlog(editingBlog.id, formData, jwt));

    setEditingBlog({
      id: null,
      title: "",
      content: "",
      category: "",
      images: [],
    });
    setSelectedImages([]);
    setOpenDialog(false);
    setIsEditMode(false);
  };

  const handleOpenDialog = (blog = null) => {
    if (blog) {
      setEditingBlog({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        category: blog.category,
        images: blog.images || [],
      });
      setSelectedImages([]);
      setIsEditMode(true);
    } else {
      setEditingBlog({ title: "", content: "", category: "", images: [] });
      setSelectedImages([]);
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  // Xử lý Upload Ảnh
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]);
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      dispatch(deleteBlog(id));
    }
  };

  const filteredBlogs = selectedFilterCategory
    ? blogs.filter((blog) => blog.category === selectedFilterCategory)
    : blogs;

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Quản lý Blog</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Lọc theo danh mục</InputLabel>
          <Select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            label="Lọc theo danh mục"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenDialog()}
        >
          Thêm Mới
        </Button>
      </div>

      <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Tiêu đề</strong>
              </TableCell>
              <TableCell>
                <strong>Danh mục</strong>
              </TableCell>
              <TableCell>
                <strong>Ngày tạo</strong>
              </TableCell>
              <TableCell>
                <strong>Ảnh</strong>
              </TableCell>
              <TableCell>
                <strong>Hành động</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{blog.category}</TableCell>
                <TableCell>{blog.createdAt}</TableCell>
                <TableCell>
                  {blog.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="blog"
                      style={{
                        width: "50px",
                        height: "50px",
                        marginRight: "5px",
                      }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    style={{ marginRight: "0.5rem" }}
                    onClick={() => handleOpenDialog(blog)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    style={{ marginRight: "0.5rem" }}
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {isEditMode ? "Chỉnh Sửa Blog" : "Thêm Mới Blog"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            margin="normal"
            value={editingBlog.title}
            onChange={(e) =>
              setEditingBlog({ ...editingBlog, title: e.target.value })
            }
          />
          <TextField
            label="Nội dung"
            fullWidth
            margin="normal"
            multiline
            rows={6} // Tăng số dòng hiển thị để nhập văn bản dài
            variant="outlined" // Kiểu ô nhập dễ nhìn hơn
            value={editingBlog.content}
            onChange={(e) =>
              setEditingBlog({ ...editingBlog, content: e.target.value })
            }
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={editingBlog.category}
              onChange={(e) =>
                setEditingBlog({ ...editingBlog, category: e.target.value })
              }
              label="Danh mục"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input type="file" multiple onChange={handleImageUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button
            onClick={isEditMode ? handleUpdateBlog : handleAddOrUpdateBlog}
            variant="contained"
            color="primary"
          >
            {isEditMode ? "Cập Nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BlogManagement;

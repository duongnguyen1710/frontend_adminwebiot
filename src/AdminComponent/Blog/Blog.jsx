import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, deleteBlog, getBlogsPaginated, updateBlog } from '../../componet/State/Blog/Action';
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
} from '@mui/material';

const BlogManagement = () => {
    const dispatch = useDispatch();
    const { blogs, loading, error, currentPage, totalPages } = useSelector((state) => state.blog);

    const [page, setPage] = useState(1); // Trang hiện tại (bắt đầu từ 1)
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // Chế độ chỉnh sửa
    const [editingBlog, setEditingBlog] = useState({
        id: null,
        title: '',
        content: '',
        category: '',
        images: [],
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedFilterCategory, setSelectedFilterCategory] = useState('');
    // Danh mục có sẵn
    const categories = [
        'Tài liệu học tập',
        'Hướng dẫn thực hành',
        'Khác'
    ];

    // Fetch Blogs mỗi khi page thay đổi
    useEffect(() => {
        dispatch(getBlogsPaginated(page - 1, 5)); // Backend page bắt đầu từ 0
    }, [dispatch, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    // Xử lý Thêm Mới hoặc Sửa Blog
    const handleAddOrUpdateBlog = () => {
        const updatedBlog = {
            ...editingBlog,
            images: selectedImages.map((file) => URL.createObjectURL(file)),
        };

        if (isEditMode) {
            dispatch(updateBlog(editingBlog.id, updatedBlog));
        } else {
            dispatch(createBlog(updatedBlog));
        }

        setEditingBlog({ id: null, title: '', content: '', category: '', images: [] });
        setSelectedImages([]);
        setOpenDialog(false);
        setIsEditMode(false);
    };

    // Mở Dialog Thêm/Sửa Blog
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
            setEditingBlog({ title: '', content: '', category: '', images: [] });
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

    // Xử lý Xóa Blog
    const handleDeleteBlog = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            dispatch(deleteBlog(id));
        }
    };

     // Lọc Blog theo danh mục
     const filteredBlogs = selectedFilterCategory
     ? blogs.filter((blog) => blog.category === selectedFilterCategory)
     : blogs;

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ textAlign: 'center' }}>Quản lý Blog</h1>

            {/* Nút Thêm Mới */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
            }}>
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

            {/* Bảng Blog */}
            <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Tiêu đề</strong></TableCell>
                            <TableCell><strong>Danh mục</strong></TableCell>
                            <TableCell><strong>Ngày tạo</strong></TableCell>
                            <TableCell><strong>Ảnh</strong></TableCell>
                            <TableCell><strong>Hành động</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {blogs.map((blog) => (
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
                                            style={{ width: '50px', height: '50px', marginRight: '5px' }}
                                        />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        style={{ marginRight: '0.5rem' }}
                                        onClick={() => handleOpenDialog(blog)}
                                    >
                                        Sửa
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        style={{ marginRight: '0.5rem' }}
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

            {/* Phân Trang */}
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}
            />

            {/* Dialog Thêm/Sửa Blog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{isEditMode ? 'Chỉnh Sửa Blog' : 'Thêm Mới Blog'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Tiêu đề"
                        fullWidth
                        margin="normal"
                        value={editingBlog.title}
                        onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                    />
                    <TextField
                        label="Nội dung"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                        value={editingBlog.content}
                        onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            value={editingBlog.category}
                            onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                            label="Danh mục"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <input type="file" multiple onChange={handleImageUpload} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button onClick={handleAddOrUpdateBlog} variant="contained" color="primary">
                        {isEditMode ? 'Cập Nhật' : 'Thêm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BlogManagement;

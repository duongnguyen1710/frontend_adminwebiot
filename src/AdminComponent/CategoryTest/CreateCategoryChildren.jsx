import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategoryItem } from "../../componet/State/CategoryTest/Action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategoryChildren = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant, category } = useSelector((store) => store);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      restaurantId: restaurant.usersRestaurant.id,
    };
    dispatch(createCategoryItem({ data, jwt }))
      .then(() => {
        toast.success("Thêm mới thành công!", { autoClose: 5000 });
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.", { autoClose: 5000 });
      });
    console.log(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="">
      <div>
        <h1 className="text-gray-400 text-center text-xl pb-10">
          Thêm mới danh mục con
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Tên danh mục con"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          ></TextField>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Danh mục cha</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.categoryId}
              label="Category"
              onChange={handleInputChange}
              name="categoryId"
            >
              {category.category.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" type="submit">
            Hoàn tất
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateCategoryChildren;
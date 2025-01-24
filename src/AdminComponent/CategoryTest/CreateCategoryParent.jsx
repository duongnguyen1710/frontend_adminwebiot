import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../../componet/State/CategoryTest/Action";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateCategoryParent = () => {
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { restaurant } = useSelector((store) => store);

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      restaurantId: restaurant.usersRestaurant.id,
    };
    console.log(formData);
    dispatch(createCategory({ data, jwt }))
      .then(() => {
        toast.success("Thêm mới thành công!", { autoClose: 5000 });
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.", { autoClose: 5000 });
      });
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
          Thêm mới danh mục{" "}
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Tên danh mục"
            variant="outlined"
            onChange={handleInputChange}
            value={formData.name}
          ></TextField>
          <Button variant="contained" type="submit">
            Hoàn tất
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateCategoryParent;
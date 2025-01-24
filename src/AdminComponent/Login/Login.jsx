import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginUser } from '../../componet/State/Authentication/Action';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const values = { email, password };
    dispatch(loginUser({ userData: values, navigate }));
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Xin chào quản trị viên</h2>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email} // Liên kết giá trị email từ state
            onChange={(e) => setEmail(e.target.value)} // Cập nhật state khi thay đổi
            required
          />
        </div>
        <div className="input-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password} // Liên kết giá trị password từ state
            onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi thay đổi
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;

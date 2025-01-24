import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from '../AdminComponent/Admin/Admin';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default AdminRoute;

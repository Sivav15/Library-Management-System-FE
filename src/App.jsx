import React from 'react'
import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import UserLayout from './layout/UserLayout';
import Books from './pages/Books';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Admin_ProtectedRoute from './protected route/Admin_ProtectedRoute';
import User_ProtectedRoute from './protected route/User_ProtectedRoute';


function App() {

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <Admin_ProtectedRoute>
        <AdminLayout />
      </Admin_ProtectedRoute>,
      children: [
        {
          path: "",
          element: <Navigate to="/admin/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "/user",
      element: <User_ProtectedRoute>
        <UserLayout />
      </User_ProtectedRoute>,
      children: [
        {
          path: "",
          element: <Navigate to="/user/books" replace />,
        },
        {
          path: "books",
          element: <Books />,
        },
      ],
    },
    {
      path: "*",
      element: <div>Not found</div>,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);



  return (
    <RouterProvider router={router} />
  )
}

export default App
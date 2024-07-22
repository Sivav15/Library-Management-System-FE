import React from 'react'
import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import UserLayout from './layout/UserLayout';
import Books from './pages/Books';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLayout from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';


function App() {

  const router = createBrowserRouter([
    {
      path: "/admin",
      element: <AdminLayout />,
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
      path: "/books",
      element: <UserLayout />,
      children: [
        {
          path: "",  // Relative path, equivalent to "/books"
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
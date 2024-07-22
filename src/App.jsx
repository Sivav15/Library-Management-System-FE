import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        // {
        //   path: "/",
        //   element: <Navigate to="/task" replace />,
        // },
        {
          path: "task",
          element:
            <AuthProtectedRoute>
              <Task />
            </AuthProtectedRoute>
          ,
        },
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        // {
        //   path: "*",
        //   element: <NotFound />,
        // },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
import AdminLayout from "@/layout/adminLayout";
import MainLayout from "@/layout/mainLayout";
import Books from "@/pages/admin/books";
import Orders from "@/pages/admin/orders";
import Users from "@/pages/admin/users";
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Role } from "@/types/user.type";
import Genres from "@/pages/admin/genres";

const router = createBrowserRouter([

  {
    path: '/',
    element: <MainLayout />,
    children: [
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'signup',
          element: <Signup />
        }
    ]
  },
  {
    path: 'admin',
    // element: (
    //   <ProtectedRoute allowedRoles={[Role.ADMIN]}>
    //     <AdminLayout />
    //   </ProtectedRoute>
    // ),
    element: (
        <AdminLayout />
    ),
    children: [
      {
        path: 'books',
        element: <Books />
      },
      {
        path: 'genres',
        element: <Genres />
      },
      {
        path: 'orders',
        element: <Orders />
      },
      {
        path: 'users',
        element: <Users />
      }
    ]
  }
]);

const AppRoutes = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default AppRoutes;

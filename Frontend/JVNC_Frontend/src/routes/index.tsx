import AdminLayout from "@/layout/adminLayout";
import MainLayout from "@/layout/mainLayout";
import Books from "@/pages/admin/books";
import Categories from "@/pages/admin/categories";
import Orders from "@/pages/admin/orders";
import Users from "@/pages/admin/users";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        // Add your main layout routes here
        // index: true,
        // element: <HomePage />
      }
    ]
  },
  {
    path: 'admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'books',
        element: <Books />
      },
      {
        path: 'categories',
        element: <Categories />
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

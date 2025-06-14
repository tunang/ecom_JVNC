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
import Genre from "@/pages/product/genre";
import ProductDetail from "@/pages/product/detail";
import Cart from "@/pages/cart";
import Profile from "@/pages/profile";
import HomePage from "@/pages/home";
import Checkout from "@/pages/checkout";
import SearchPage from "@/pages/search";
import OrdersPage from "@/pages/order";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'login',
          element: <Login />
        },
        {
          path: 'signup',
          element: <Signup />
        },
        {
          path: 'genre/:genreId',
          element: <Genre />
        },
        {
          path: 'product/:productId',
          element: <ProductDetail />
        },
        {
          path: 'cart',
          element: <Cart />
        },
        {
          path: 'checkout',
          element: <Checkout />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'orders',
          element: <OrdersPage />
        },
        {
          path: 'search',
          element: <SearchPage />
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

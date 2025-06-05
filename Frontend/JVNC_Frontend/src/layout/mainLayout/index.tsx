import { Link, Navigate, Outlet } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutGrid,
  Lock,
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  User2,
  UserPlus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Role } from "@/types/user.type";
import { useNavigate } from "react-router-dom";
import { logoutRequest } from "@/store/slices/authSlice";
import { useEffect } from "react";
import { fetchGenresRequest } from "@/store/slices/genreSlice";
const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { genres } = useAppSelector((state) => state.genre);

  useEffect(() => {
    dispatch(fetchGenresRequest({ page: 1, size: 10 }));
  }, [dispatch]);
  const handleLogin = () => {
    console.log("Login");
  };
  const handleSignup = () => {
    console.log("Signup");
  };
  return (
    <div>
      <nav className="flex items-center justify-around shadow-md">
        <div className="flex items-center">
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Popover>
            <PopoverTrigger>
              <LayoutGrid className="w-8 h-8" />
            </PopoverTrigger>
            <PopoverContent className="w-full flex flex-col gap-2 mt-4 ">
              <div className="grid grid-cols-3 gap-2">
              {genres.map((genre) => (
                <Link to={`/genre/${genre.genreId}`}>
                  <Button variant="outline" className="w-full">{genre.name}</Button>
                </Link>
              ))}

              </div>
            </PopoverContent>
          </Popover>
          <Input type="book" placeholder="Tìm kiếm sách" />
          <Button type="submit" variant="outline">
            <Search />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <Popover>
              <PopoverTrigger>
                <User className="w-8 h-8" />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2 w-42 mt-4">
                <Link to="/login">
                  <Button onClick={handleLogin} className="w-full">
                    <LogIn className="w-4 h-4 mr-2" />
                    Đăng nhập
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button
                    onClick={handleSignup}
                    variant="outline"
                    className="w-full"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Đăng ký
                  </Button>
                </Link>
              </PopoverContent>
            </Popover>
          )}

          {isAuthenticated && (
            <Popover>
              <PopoverTrigger>
                <User className="w-8 h-8" />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2 w-42 mt-4">
                <Link to="/signup">
                  <Button
                    onClick={handleSignup}
                    variant="outline"
                    className="w-full"
                  >
                    <User2 className="w-4 h-4 mr-2" />
                    Tài khoản
                  </Button>
                </Link>

                <Link to="/login">
                  <Button
                    onClick={handleLogin}
                    variant="outline"
                    className="w-full"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Đơn hàng
                  </Button>
                </Link>

                <Button
                  onClick={() => dispatch(logoutRequest())}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </Button>
              </PopoverContent>
            </Popover>
          )}

          <Popover>
            <PopoverTrigger>
              <ShoppingCart className="w-8 h-8" />
            </PopoverTrigger>
            <PopoverContent>Place content for the popover here.</PopoverContent>
          </Popover>

          {isAuthenticated && user?.role === Role.ADMIN && (
            <Link to="/admin">
              <Button onClick={handleLogin} className="w-full">
                <Lock className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default MainLayout;

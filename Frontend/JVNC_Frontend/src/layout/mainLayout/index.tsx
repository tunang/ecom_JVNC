import { Link, Navigate, Outlet } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import ScrollToTop from "@/components/ScrollToTop";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { genres } = useAppSelector((state) => state.genre);
  const { totalItems } = useAppSelector((state) => state.cart);

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
      <ScrollToTop />
      <nav className="flex items-center justify-between px-6 py-2 shadow-md bg-white">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="logo"
            className="w-20 h-20 hover:scale-105 transition-transform"
          />
        </div>

        {/* Search Section */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl mx-8">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <LayoutGrid className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mt-2">
              <div className="grid grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <Link key={genre.genreId} to={`/genre/${genre.genreId}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      {genre.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex-1">
            <Input 
              type="text" 
              placeholder="Tìm kiếm sách, tác giả..." 
              className="w-full"
            />
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Search className="w-5 h-5" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative hover:bg-gray-100"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-red-500 hover:bg-red-500"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
            </Button>
          </div>

          {/* User Authentication */}
          {!isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 mt-2">
                <div className="flex flex-col gap-2">
                  <Link to="/login">
                    <Button onClick={handleLogin} className="w-full justify-start">
                      <LogIn className="w-4 h-4 mr-2" />
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      onClick={handleSignup}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Đăng ký
                    </Button>
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {isAuthenticated && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 mt-2">
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-sm">Xin chào,</p>
                    <p className="text-sm text-gray-600 truncate">{user?.name}</p>
                  </div>
                  <Link to="/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User2 className="w-4 h-4 mr-2" />
                      Tài khoản của tôi
                      </Button>
                  </Link>
                  <Link to="/orders">
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="w-4 h-4 mr-2" />
                      Đơn hàng của tôi
                    </Button>
                  </Link>

                  <div className="border-t pt-2">
                    <Button
                      onClick={() => dispatch(logoutRequest())}
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Admin Panel Link */}
          {isAuthenticated && user?.role === Role.ADMIN && (
            <Link to="/admin">
              <Button variant="outline" size="icon" title="Admin Panel">
                <Lock className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="mx-4 md:mx-8 lg:mx-16 mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

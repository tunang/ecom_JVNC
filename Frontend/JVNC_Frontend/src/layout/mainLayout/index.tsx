import { Link, Outlet } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Lock,
  LogIn,
  Package,
  Search,
  ShoppingCart,
  User,
  UserPlus,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppSelector } from "@/store/hooks";
import { Role } from "@/types/user.type";
const MainLayout = () => {
  const {user, isAuthenticated} = useAppSelector((state) => state.auth);
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
          <img src={logo} alt="logo" className="w-20 h-20" />
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input type="book" placeholder="Search book" />
          <Button type="submit" variant="outline">
            <Search />
          </Button>
        </div>
        <div className="flex items-center gap-4">
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

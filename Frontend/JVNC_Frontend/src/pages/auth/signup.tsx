import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { custom, z } from "zod";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, UserPlus } from "lucide-react"; // Import icons
import { toast } from "sonner";
import { registerRequest, sendOtpRequest } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const formSchema = z.object({
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 số",
  }),
  name: z.string().min(1, {
    message: "Tên không được để trống",
  }),
  otp: z.string().min(6, {
    message: "OTP phải có 6 ký tự",
  }),
});

const Signup = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSendError, setOtpSendError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onTouched",
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      name: "",
      otp: "",
    },
  });

  const watchEmail = form.watch("email");

  // Navigate to home if registration successful
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Đăng ký thành công!");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Show error if registration failed
  useEffect(() => {
    if (error && !sendingOtp) {
      toast.error(error);
    }
  }, [error, sendingOtp]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const { email, password, name, phone, otp } = data;
      dispatch(registerRequest({ email, password, name, phone, otp }));
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đăng ký");
    }
  }

  const handleSendOTP = async () => {
    const email = form.getValues("email");
    
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    const emailError = form.formState.errors.email;
    if (emailError) {
      toast.error("Email không hợp lệ");
      return;
    }

    setSendingOtp(true);
    setOtpSendError(null);
    
    dispatch(sendOtpRequest({ email }));
    
    // Use a timeout to handle the response since we can't directly await saga actions
    setTimeout(() => {
      setSendingOtp(false);
      if (!error) {
        setOtpSent(true);
        toast.success("OTP đã được gửi đến email của bạn");
      } else {
        setOtpSendError("Gửi OTP thất bại. Vui lòng thử lại.");
        toast.error("Gửi OTP thất bại");
      }
    }, 1500);
  };

  return (
    <>
      <div className="flex h-screen w-screen justify-center">
        <Card className="absolute w-96 mt-20">
          <CardHeader className="flex items-center">
            <CardTitle className="text-3xl">Đăng ký</CardTitle>
            {/* <CardDescription>One HaUI</CardDescription> */}
          </CardHeader>
          <CardContent className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nhập email" 
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            // Reset OTP sent state when email changes
                            if (otpSent && e.target.value !== field.value) {
                              setOtpSent(false);
                              form.setValue("otp", "");
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>OTP</FormLabel>
                        <div className="flex flex-row gap-2">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Nhập mã OTP"
                              {...field}
                              disabled={!otpSent}
                            />
                          </FormControl>
                          <Button 
                            type="button"
                            onClick={handleSendOTP}
                            disabled={sendingOtp || !watchEmail || !!form.formState.errors.email}
                            variant="outline"
                            className="whitespace-nowrap"
                          >
                            {sendingOtp ? "Đang gửi..." : otpSent ? "Gửi lại" : "Gửi OTP"}
                          </Button>
                        </div>
                        <FormMessage />
                        {otpSendError && (
                          <p className="text-sm text-red-500">{otpSendError}</p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !otpSent}
                  className="w-full"
                >
                  {isLoading
                    ? "Đang đăng ký..."
                    : "Đăng ký"}
                </Button>

                <Link to="/login" className="w-full block text-center text-blue-600 hover:underline">
                  Đã có tài khoản? Đăng nhập
                </Link>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="justify-center">
            {/* <CardDescription>Copyright 2024 © HaUI</CardDescription> */}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Signup;

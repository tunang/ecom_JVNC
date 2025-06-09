import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { z } from 'zod';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react'; // Import icons
import { toast } from 'sonner';
import { loginRequest, clearError } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const formSchema = z.object({
  email: z.string().email({
    message: 'Email không hợp lệ',
  }),
  password: z.string().min(1, {
    message: 'Mật khẩu không được để trống',
  }),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Navigate to home if login successful
  useEffect(() => {
    if (isAuthenticated) {
      toast.success('Đăng nhập thành công!');
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Show error if login failed
  useEffect(() => {
    if (error) {
      toast.error(error);
      // Clear error after showing it
      dispatch(clearError());
    }
  }, [error, dispatch]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const { email, password } = data;
      dispatch(loginRequest({ email, password }));
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng nhập');
    }
  }

  return (
    <>
      <div className="flex h-screen w-screen justify-center">
        <Card className="absolute w-96 mt-20">
          <CardHeader className="flex items-center">
            <CardTitle className="text-3xl">Đăng nhập</CardTitle>
            {/* <CardDescription>One HaUI</CardDescription> */}
          </CardHeader>
          <CardContent className="">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
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
                            type={showPassword ? 'text' : 'password'} 
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
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>

                <Link to="/signup" className="w-full block text-center text-blue-600 hover:underline">
                  Chưa có tài khoản? Đăng ký
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

export default Login;

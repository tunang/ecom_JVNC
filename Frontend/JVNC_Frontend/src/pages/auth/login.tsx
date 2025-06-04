import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { custom, z } from 'zod';


import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react'; // Import icons
import { toast } from 'sonner';
import { loginRequest } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';

const formSchema = z.object({
  email: z.string().min(1, {
    message: 'Email không được để trống',
  }),
  password: z.string().min(1, {
    message: 'Mật khẩu không được để trống',
  }),
});

const Login = () => {

  const dispatch = useAppDispatch();

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


  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const { email, password } = data;
      dispatch(loginRequest({ email, password }));
      toast(<div>A custom toast with default styling</div>)
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      toast(<div>A custom toast with default styling</div>)
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
                        <Input placeholder="" {...field} />
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
                          <Input type={showPassword ? 'text' : 'password'} placeholder="" {...field} />
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
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                  {form.formState.isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
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

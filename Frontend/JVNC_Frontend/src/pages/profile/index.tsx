import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateProfileRequest } from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Calendar,
  Shield,
  Edit,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { formatDate } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(1, 'Tên không được để trống'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),
  password: z.string().optional(),
  profilePicture: z.any().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isLoading, error } = useAppSelector((state) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone,
        password: '',
      });
      setImagePreview(user.profilePicture);
    }
  }, [user, form]);



  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file ảnh');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(user?.profilePicture || null);
  };

  const onSubmit = (data: ProfileFormData) => {
    const updateData: any = {
      name: data.name,
      phone: data.phone,
    };

    // Only include password if user entered one
    if (data.password && data.password.trim()) {
      updateData.password = data.password;
    }

    // Include profile picture if changed
    if (imageFile) {
      updateData.profilePicture = imageFile;
    }

    dispatch(updateProfileRequest(updateData));
    
    toast.success('Đang cập nhật thông tin...');
    setIsEditing(false);
    
    // Clear password field after submit
    form.setValue('password', '');
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({
      name: user?.name || '',
      phone: user?.phone || '',
      password: '',
    });
    setImagePreview(user?.profilePicture || null);
    setImageFile(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Đăng nhập để xem thông tin
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập để xem và chỉnh sửa thông tin cá nhân.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/login')} className="w-full">
              Đăng nhập
            </Button>
            <Button onClick={() => navigate('/signup')} variant="outline" className="w-full">
              Tạo tài khoản mới
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Thông tin cá nhân
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin tài khoản và cài đặt của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Ảnh đại diện
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {/* Profile Picture */}
                <div className="relative w-32 h-32 mx-auto">
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=128&background=6366f1&color=ffffff`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <label htmlFor="profile-image" className="cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                          <Camera className="h-5 w-5" />
                        </div>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {isEditing && imageFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Xóa ảnh mới
                  </Button>
                )}

                {/* User Info */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user?.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <Badge 
                      variant={user?.role === 'Admin' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user?.role === 'Admin' ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Quản trị viên
                        </>
                      ) : (
                        'Người dùng'
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Tham gia {formatDate(user?.createdAt || '')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Thông tin chi tiết
                  </CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleCancel} 
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                      <Button 
                        onClick={form.handleSubmit(onSubmit)}
                        size="sm"
                        disabled={isLoading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? 'Đang lưu...' : 'Lưu'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Email không thể thay đổi
                      </p>
                    </div>

                    <Separator />

                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Họ và tên
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              className={!isEditing ? 'bg-gray-50' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={!isEditing}
                              className={!isEditing ? 'bg-gray-50' : ''}
                              placeholder="0123456789"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    {isEditing && (
                      <>
                        <Separator />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Mật khẩu mới (để trống nếu không thay đổi)
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Nhập mật khẩu mới"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-gray-500">
                                Mật khẩu phải có ít nhất 6 ký tự
                              </p>
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Submit Button for Mobile */}
                    {isEditing && (
                      <div className="flex gap-3 lg:hidden">
                        <Button 
                          type="button"
                          onClick={handleCancel} 
                          variant="outline"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Hủy
                        </Button>
                        <Button 
                          type="submit"
                          disabled={isLoading}
                          className="flex-1"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {isLoading ? 'Đang lưu...' : 'Lưu'}
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>

                {/* Error Display */}
                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Stats */}
            {/* <Card className="mt-6">
              <CardHeader>
                <CardTitle>Thống kê tài khoản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Đơn hàng</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Sách yêu thích</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Điểm tích lũy</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">0</div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
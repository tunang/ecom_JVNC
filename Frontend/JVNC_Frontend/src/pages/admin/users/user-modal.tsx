import { FormMessage } from "@/components/ui/form";

import { FormControl } from "@/components/ui/form";

import { FormLabel } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";

import { FormField } from "@/components/ui/form";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { User } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";

interface UserModalProps {
  modalProps?: {
    mode: "read" | "create" | "edit";
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  user?: User;
  onClose?: () => void;
}

export const FormSchema = z.object({
  id: z.string().optional(),
  name: z.string({ required_error: "Mã sinh viên không được để trống" }),
  phone: z
    .string()
    .refine((v) => v.length === 10, {
      message: "Số điện thoại phải có 10 chữ số",
    })
    .optional(),
  password: z.string({ required_error: "Mật khẩu không được để trống" }),
  image: z.any().optional(),
  role: z.string().optional(),
  profilePicture: z.string().nullable().optional(),
});


const UserModal = ({ modalProps, user, onClose }: UserModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { mode, onSubmit } = modalProps || {
    mode: "create",
    onSubmit: async (data: z.infer<typeof FormSchema>) => {
      try {
        // Process image if it exists
        let processedData = { ...data };
        if (imageFile) {
          // Convert image to base64 or handle as needed
          const reader = new FileReader();
          reader.onloadend = () => {
            processedData.profilePicture = reader.result as string;
          };
          reader.readAsDataURL(imageFile);
          
          // Wait for file reading to complete
          await new Promise((resolve) => {
            reader.onloadend = () => {
              processedData.profilePicture = reader.result as string;
              resolve(void 0);
            };
          });
        }
        
        // useAppDispatch(createUser(processedData));
        form.reset();
        setImagePreview(null);
        setImageFile(null);
        toast(
          <div>
            <h1>Thêm sinh viên thành công</h1>
            <p>Sinh viên đã được thêm vào hệ thống</p>
          </div>
        );
        onClose?.();
      } catch (error) {
        toast(
          <div>
            <h1>Thêm sinh viên thất bại</h1>
            <p>Vui lòng thử lại sau</p>
          </div>
        );
      }
    },
  };

  const title = {
    read: "Thông tin người dùng",
    create: "Thêm người dùng mới",
    edit: "Sửa thông tin người dùng",
  }[mode];

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onTouched",
    resolver: zodResolver(FormSchema),
    defaultValues: mode === "create" ? {
      name: "",
      phone: "",
      password: "",
      role: "User",
      profilePicture: null,
    } : {
      ...user,
      profilePicture: user?.profilePicture || null,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      form.setValue("image", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("image", null);
    form.setValue("profilePicture", null);
    setImagePreview(null);
    setImageFile(null);
  };

  // Custom form submit handler to process image
  const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      let processedData = { ...data };
      
      // If there's a new image file, pass the file object directly
      if (imageFile) {
        processedData.image = imageFile;
        // Remove profilePicture since we're sending the file as 'image'
        delete processedData.profilePicture;
      } else if (imagePreview && !imageFile) {
        // Keep existing image if no new file is selected
        processedData.profilePicture = imagePreview;
      }
      
      await onSubmit(processedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Set initial image preview if user has an existing image
  useEffect(() => {
    if (user?.profilePicture && mode !== "create") {
      setImagePreview(user.profilePicture);
    }
  }, [user, mode]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {mode !== "read" && (
          <DialogDescription>
            Thay đổi thông tin lớp học tại đây. Nhấn Lưu để cập nhật.
          </DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vai trò</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn vai trò" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh đại diện</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {mode !== "read" && (
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file:mr-4 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      )}
                      {imagePreview && (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          {mode !== "read" && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={removeImage}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            
          </div>
          {mode !== "read" && (
            <DialogFooter>
              <Button type="submit" className="mt-2">
                {form.formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          )}
        </form>
      </Form>
    </DialogContent>
  );
};

export default UserModal;

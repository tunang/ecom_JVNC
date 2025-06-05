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

import type { Book } from "@/types/book.type";
import type { Genre } from "@/types/genre.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGenresRequest } from "@/store/slices/genreSlice";

interface BookModalProps {
  modalProps?: {
    mode: "read" | "create" | "edit";
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  book?: Book;
  onClose?: () => void;
}

export const FormSchema = z.object({
  bookId: z.number().optional(),
  title: z.string({ required_error: "Tiêu đề không được để trống" }).min(1, "Tiêu đề không được để trống"),
  author: z.string({ required_error: "Tác giả không được để trống" }).min(1, "Tác giả không được để trống"),
  description: z.string({ required_error: "Mô tả không được để trống" }).min(1, "Mô tả không được để trống"),
  price: z.number({ required_error: "Giá không được để trống" }).min(0, "Giá phải lớn hơn 0"),
  stock: z.number({ required_error: "Số lượng không được để trống" }).min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  genreId: z.number({ required_error: "Thể loại không được để trống" }),
  coverImage: z.any().optional(),
  imageUrl: z.string().optional(),
});

const BookModal = ({ modalProps, book, onClose }: BookModalProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const { genres } = useAppSelector(state => state.genre);

  const { mode, onSubmit } = modalProps || {
    mode: "create",
    onSubmit: async (data: z.infer<typeof FormSchema>) => {
      try {
        form.reset();
        setImagePreview(null);
        setImageFile(null);
        toast(
          <div>
            <h1>Thêm sách thành công</h1>
            <p>Sách đã được thêm vào hệ thống</p>
          </div>
        );
        onClose?.();
      } catch (error) {
        toast(
          <div>
            <h1>Thêm sách thất bại</h1>
            <p>Vui lòng thử lại sau</p>
          </div>
        );
      }
    },
  };

  const title = {
    read: "Thông tin sách",
    create: "Thêm sách mới",
    edit: "Sửa thông tin sách",
  }[mode];

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onTouched",
    resolver: zodResolver(FormSchema),
    defaultValues: mode === "create" ? {
      title: "",
      author: "",
      description: "",
      price: 0,
      stock: 0,
      genreId: 0,
    } : {
      ...book,
      genreId: book?.genre?.genreId || 0,
      imageUrl: book?.imageUrl || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      form.setValue("coverImage", file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    form.setValue("coverImage", null);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      let processedData = { ...data };
      
      // If there's a new image file, pass the file object directly
      if (imageFile) {
        processedData.coverImage = imageFile;
      } else if (imagePreview && !imageFile) {
        // Keep existing image if no new file is selected
        processedData.imageUrl = imagePreview;
      }
      
      await onSubmit(processedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Fetch genres when modal opens
  useEffect(() => {
    dispatch(fetchGenresRequest({ page: 1, size: 100 }));
  }, [dispatch]);

  // Set initial image preview if book has an existing image
  useEffect(() => {
    if (book?.imageUrl && mode !== "create") {
      setImagePreview(book.imageUrl);
    }
  }, [book, mode]);

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {mode !== "read" && (
          <DialogDescription>
            Thay đổi thông tin sách tại đây. Nhấn Lưu để cập nhật.
          </DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nhập tiêu đề sách..."
                      disabled={mode === "read"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tác giả</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nhập tên tác giả..."
                      disabled={mode === "read"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      placeholder="Nhập mô tả sách..."
                      disabled={mode === "read"}
                      rows={3}
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VNĐ)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="0"
                        disabled={mode === "read"}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number"
                        placeholder="0"
                        disabled={mode === "read"}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="genreId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thể loại</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    defaultValue={field.value?.toString()}
                    disabled={mode === "read"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thể loại" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre.genreId} value={genre.genreId.toString()}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ảnh bìa</FormLabel>
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

export default BookModal;

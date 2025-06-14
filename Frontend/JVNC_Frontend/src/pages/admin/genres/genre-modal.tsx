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

import type { Genre } from "@/types/genre.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface GenreModalProps {
  modalProps?: {
    mode: "read" | "create" | "edit";
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  genre?: Genre;
  onClose?: () => void;
}

export const FormSchema = z.object({
  genreId: z.number().optional(),
  name: z.string({ required_error: "Tên thể loại không được để trống" }).min(1, "Tên thể loại không được để trống"),
});

const GenreModal = ({ modalProps, genre, onClose }: GenreModalProps) => {
  const { mode, onSubmit } = modalProps || {
    mode: "create",
    onSubmit: async (data: z.infer<typeof FormSchema>) => {
      try {
        form.reset();
        toast(
          <div>
            <h1>Thêm thể loại thành công</h1>
            <p>Thể loại đã được thêm vào hệ thống</p>
          </div>
        );
        onClose?.();
      } catch (error) {
        toast(
          <div>
            <h1>Thêm thể loại thất bại</h1>
            <p>Vui lòng thử lại sau</p>
          </div>
        );
      }
    },
  };

  const title = {
    read: "Thông tin thể loại",
    create: "Thêm thể loại mới",
    edit: "Sửa thông tin thể loại",
  }[mode];

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onTouched",
    resolver: zodResolver(FormSchema),
    defaultValues: mode === "create" ? {
      name: "",
    } : {
      ...genre,
    },
  });

  const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {mode !== "read" && (
          <DialogDescription>
            Thay đổi thông tin thể loại tại đây. Nhấn Lưu để cập nhật.
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
                  <FormLabel>Tên thể loại</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nhập tên thể loại..."
                      disabled={mode === "read"}
                    />
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

export default GenreModal;

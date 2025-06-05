"use client"

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type Book } from "@/types/book.type";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import BookModal, { FormSchema } from "./book-modal";
import { useAppDispatch } from "@/store/hooks";
import { deleteBookRequest, updateBookRequest } from "@/store/slices/bookSlice";
import type { z } from "zod";

const DeleteAction: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useAppDispatch();
  return (
    <DeleteDialog
      title="Xóa"
      onConfirm={() => {
        console.log(book);
        dispatch(deleteBookRequest({ bookId: book.bookId }));
        toast.success('Xóa sách thành công!');
      }}
    />
  );
};

const EditAction: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useAppDispatch();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sửa</Button>
      </DialogTrigger>
      <BookModal
        modalProps={{
          mode: 'edit',
          onSubmit: async (data: z.infer<typeof FormSchema>) => {
            try {
              dispatch(updateBookRequest({ id: book.bookId, book: data }));
              toast.success('Cập nhật sách thành công!');
            } catch (error) {
              toast.error('Cập nhật thất bại!');
            }
          },
        }}
        book={book}
      />
    </Dialog>
  );
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "bookId",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "imageUrl",
    header: "Ảnh bìa",
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      return imageUrl ? (
        <img 
          src={imageUrl} 
          alt={row.original.title}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs text-gray-500">No Image</span>
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    size: 250,
  },
  {
    accessorKey: "author",
    header: "Tác giả",
    size: 200,
  },
  {
    accessorKey: "genre.name",
    header: "Thể loại",
    cell: ({ row }) => row.original.genre?.name || "N/A",
    size: 200,
  },
  {
    accessorKey: "price",
    header: "Giá (VNĐ)",
    cell: ({ row }) => {
      const price = row.original.price;
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
      }).format(price);
    },
    size: 150,
  },
  {
    accessorKey: "stock",
    header: "Số lượng",
    size: 100,
  },
  {
    accessorKey: 'edit-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <EditAction book={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
  {
    accessorKey: 'delete-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <DeleteAction book={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
];
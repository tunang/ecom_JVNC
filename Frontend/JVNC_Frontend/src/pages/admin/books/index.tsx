import TablePage from "@/components/ui/data-table";
import { columns } from "./columns";
import { type Book } from "@/types/book.type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchBooksRequest, createBookRequest } from "@/store/slices/bookSlice";
import BookModal, { FormSchema } from "./book-modal";
import { toast } from "sonner";
import type { z } from "zod";

const Books = () => {
  const { books: data, isLoading, error } = useAppSelector(state => state.book);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooksRequest({ page: 1, size: 10 }));
  }, [dispatch]);
  
  console.log(data);

  return (
    <div className="container w-full">
      <TablePage 
        Modal={BookModal} 
        modalProps={{
          mode: 'create',
          onSubmit: async (data: z.infer<typeof FormSchema>) => {
            try {
              dispatch(createBookRequest(data));
              toast.success('Thêm sách thành công!');
            } catch (error) {
              toast.error('Thêm sách thất bại!');
            }
          },
        }}
        columns={columns} 
        data={data} 
        title="Quản lý sách" 
        loading={isLoading}
      />
    </div>
  );
};

export default Books;
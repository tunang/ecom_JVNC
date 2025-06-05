import TablePage from "@/components/ui/data-table";
import { columns } from "./columns";
import { type Genre } from "@/types/genre.type";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { fetchGenresRequest, createGenreRequest } from "@/store/slices/genreSlice";
import GenreModal, { FormSchema } from "./genre-modal";
import { toast } from "sonner";
import type { z } from "zod";

const Genres = () => {
  const { genres: data, isLoading, error } = useAppSelector(state => state.genre);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchGenresRequest({ page: 1, size: 10 }));
  }, [dispatch]);
  
  console.log(data);

  return (
    <div className="container w-full">
      <TablePage 
        Modal={GenreModal} 
        modalProps={{
          mode: 'create',
          onSubmit: async (data: z.infer<typeof FormSchema>) => {
            try {
              dispatch(createGenreRequest({ name: data.name }));
              toast.success('Thêm thể loại thành công!');
            } catch (error) {
              toast.error('Thêm thể loại thất bại!');
            }
          },
        }}
        columns={columns} 
        data={data} 
        title="Quản lý thể loại" 
        loading={isLoading}
      />
    </div>
  );
};

export default Genres;
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type Genre } from "@/types/genre.type";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import GenreModal, { FormSchema } from "./genre-modal";
import { useAppDispatch } from "@/store/hooks";
import { deleteGenreRequest, updateGenreRequest } from "@/store/slices/genreSlice";
import type { z } from "zod";

const DeleteAction: React.FC<{ genre: Genre }> = ({ genre }) => {
  const dispatch = useAppDispatch();
  return (
    <DeleteDialog
      title="Xóa"
      onConfirm={() => {
        console.log(genre);
        dispatch(deleteGenreRequest({ genreId: genre.genreId }));
        toast.success('Xóa thể loại thành công!');
      }}
    />
  );
};

const EditAction: React.FC<{ genre: Genre }> = ({ genre }) => {
  const dispatch = useAppDispatch();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sửa</Button>
      </DialogTrigger>
      <GenreModal
        modalProps={{
          mode: 'edit',
          onSubmit: async (data: z.infer<typeof FormSchema>) => {
            try {
              dispatch(updateGenreRequest({ id: genre.genreId, genre: data }));
              toast.success('Cập nhật thể loại thành công!');
            } catch (error) {
              toast.error('Cập nhật thất bại!');
            }
          },
        }}
        genre={genre}
      />
    </Dialog>
  );
};

export const columns: ColumnDef<Genre>[] = [
  {
    accessorKey: "genreId",
    header: "ID",
    size: 80,
  },
  {
    accessorKey: "name",
    header: "Tên thể loại",
    size: 300,
  },
  {
    accessorKey: 'edit-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <EditAction genre={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
  {
    accessorKey: 'delete-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <DeleteAction genre={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
];

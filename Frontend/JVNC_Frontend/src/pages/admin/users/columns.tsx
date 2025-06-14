import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type User } from "@/types/user.type"
import type { ColumnDef } from "@tanstack/react-table"
import { Delete, Edit, Trash } from "lucide-react"
import { toast } from "sonner";
import UserModal, { FormSchema } from "./user-modal";
import { useAppDispatch } from "@/store/hooks";
import { deleteUserRequest, updateUserRequest } from "@/store/slices/userSlice";
import type { z } from "zod";
const DeleteAction: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useAppDispatch();
  return (
    <DeleteDialog
      title="Xóa"
      onConfirm={() => {
        console.log(user);
        dispatch(deleteUserRequest({userId: user.userId}));
        toast.success('Xóa thành công!');
      }}
    />
  );
};

const EditAction: React.FC<{ user: User }> = ({ user }) => {
  const dispatch = useAppDispatch();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sửa</Button>
      </DialogTrigger>
      <UserModal
        modalProps={{
          mode: 'edit',
          onSubmit: async (data: z.infer<typeof FormSchema>) => {
            try {
              dispatch(updateUserRequest({id: user.userId, user: data}));
              toast(<div></div>);
            } catch (error) {
              toast.success('Sửa thất bại!');
            }
          },
        }}
        user={user}
      />
    </Dialog>
  );
};
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "userId",
    header: "User ID",
    size: 60,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 230,
  },
  {
    accessorKey: "name",
    header: "Name",   
    size: 250,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    size: 150,
  },
  {
    accessorKey: "role", 
    header: "Role",
    size: 80,
  },
  {
    accessorKey: "profilePicture",
    header: "Profile Picture",
    size: 180,
    cell: ({ row }) => (
      <img
        src={row.getValue("profilePicture")}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover mx-auto"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 180,
  },
  {
    accessorKey: 'edit-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <EditAction user={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
  {
    accessorKey: 'delete-action',
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => <DeleteAction user={row.original} />,
    enableSorting: false,
    enableHiding: false,
    size: 100,
  },
]

import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { Role, type User } from "@/types/user.type";

const Users = () => {
    const data: User[] = [
        {
          user_id: 1,
          email: 'john.doe@example.com',
          name: 'John Doe',
          phone: '123-456-7890',
          password: 'hashedpassword123',
          role: Role.USER,
          profile_picture: null,
          created_at: '2024-10-01T09:00:00Z',
        },
        {
          user_id: 2,
          email: 'jane.admin@example.com',
          name: 'Jane Admin',
          phone: '555-678-1234',
          password: 'adminpassword456',
          role: Role.ADMIN,
          profile_picture: 'https://example.com/images/jane.jpg',
          created_at: '2024-11-15T14:30:00Z',
        },
        {
          user_id: 3,
          email: 'alice.user@example.com',
          name: 'Alice Smith',
          phone: '987-654-3210',
          password: 'alicepass789',
          role: Role.USER,
          profile_picture: null,
          created_at: '2025-01-10T08:45:00Z',
        },
      ];
  return (
    <div className="container w-full">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Users;

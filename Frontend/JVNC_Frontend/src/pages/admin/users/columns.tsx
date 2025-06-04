"use client"

import { type User } from "@/types/user.type"
import type { ColumnDef } from "@tanstack/react-table"
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "user_id",
    header: "User ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",   
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "password",
    header: "Password",
  },
  {
    accessorKey: "role", 
    header: "Role",
  },
  {
    accessorKey: "profile_picture",
    header: "Profile Picture",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
  {
    accessorKey:"",
    header:"Function"
  }
]
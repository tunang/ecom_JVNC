export type User = {
  userId: number;
  email: string;
  name: string;
  phone: string;
  password: string;
  role: string; // typically 'User' or 'Admin', etc.
  profilePicture: string | null; // nullable since it's optional
  createdAt: string; // or Date if parsed
};
export enum Role {
  USER = 'User',
  ADMIN = 'Admin',
}

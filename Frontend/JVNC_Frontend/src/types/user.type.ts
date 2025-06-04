export type User = {
  user_id: number;
  email: string;
  name: string;
  phone: string;
  password: string;
  role: string; // typically 'User' or 'Admin', etc.
  profile_picture: string | null; // nullable since it's optional
  created_at: string; // or Date if parsed
};
export enum Role {
  USER = 'User',
  ADMIN = 'Admin',
}

import { UserRole } from '../enums/role.enum';

export interface UserDto {
  id: string;
  email: string;
  role: UserRole;
  subscription_status: string;
  created_at: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
}

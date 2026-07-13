import type { UserRole } from '../enums/role.enum.js';
export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
export interface CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}
export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
}
//# sourceMappingURL=user.dto.d.ts.map
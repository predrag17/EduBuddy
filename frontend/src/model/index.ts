export type UserDto = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
};

export type MaterialDto = {
  id: number;
  subject: string;
  description: string;
  file: string;
  isProcessed: boolean;
  category: CategoryDto;
  uploadedAt: string;
  user: UserDto;
};

export type CategoryDto = {
  id: number;
  name: string;
};

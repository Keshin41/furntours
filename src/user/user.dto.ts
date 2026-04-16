import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UpdateProfileSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  nickname: z.string().min(1),
  email: z.email(),
  address: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
});

const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}

export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {}
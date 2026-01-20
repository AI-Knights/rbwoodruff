import { z } from 'zod';

export const JobFormSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().min(10, 'Requirements must be detailed'),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  location: z.string().min(2, 'Location is required'),
  is_remote: z.boolean(),
  salary_min: z
    .string()
    .min(1, 'Minimum salary is required')
    .refine((val) => /^\d+$/.test(val.trim()), 'Only numbers allowed')
    .refine((val) => Number(val) >= 0, 'Minimum salary must be ≥ 0'),
  salary_max: z
    .string()
    .min(1, 'Maximum salary is required')
    .refine((val) => /^\d+$/.test(val.trim()), 'Only numbers allowed')
    .refine((val) => Number(val) >= 0, 'Maximum salary must be ≥ 0'),
  skills_required: z.string().min(1, 'At least one skill required'),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  number_of_openings: z.string().min(1, 'At least 1 opening').refine((val) => Number(val) >= 1, 'Must be ≥ 1'),
  status: z.enum(['active', 'draft', 'closed']).default('active'),
})
.superRefine((data, ctx) => {
  const min = Number(data.salary_min);
  const max = Number(data.salary_max);
  if (max < min) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Maximum salary must be ≥ minimum salary',
      path: ['salary_max'],
    });
  }
  if (!data.is_remote && data.location.trim() === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Location is required for on-site jobs',
      path: ['location'],
    });
  }
});

export type JobFormData = z.infer<typeof JobFormSchema>;
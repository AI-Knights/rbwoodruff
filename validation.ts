import z from "zod";

export const formSchema = z
  .object({
    company_name: z
      .string()
      .min(3, { message: "Company name must be at least 3 characters" })
      .max(20, { message: "Company name cannot exceed 20 characters" })
      .regex(/^[a-zA-Z0-9\s'&-]+$/, {
        message: "Only letters, numbers, spaces, and & ' - are allowed",
      }),

    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" }),

    office_location: z
      .string()
      .min(4, { message: "Location must be at least 4 characters" })
      .max(30, { message: "Location cannot exceed 30 characters" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),

    confirm_password: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
// export const trainerSignUp = z
//   .object({
//     full_name: z
//       .string()
//       .min(3, { message: "Company name must be at least 3 characters" })
//       .max(20, { message: "Company name cannot exceed 20 characters" })
//       .regex(/^[a-zA-Z0-9\s'&-]+$/, {
//         message: "Only letters, numbers, spaces, and & ' - are allowed",
//       }),

//     email: z
//       .string()
//       .email({ message: "Please enter a valid email address" })
//       .min(1, { message: "Email is required" }),

//     password: z
//       .string()
//       .min(8, { message: "Password must be at least 8 characters" })
//       .regex(/[A-Z]/, {
//         message: "Password must contain at least one uppercase letter",
//       })
//       .regex(/[a-z]/, {
//         message: "Password must contain at least one lowercase letter",
//       })
//       .regex(/[0-9]/, { message: "Password must contain at least one number" })
//       .regex(/[^A-Za-z0-9]/, {
//         message: "Password must contain at least one special character",
//       }),

//     confirm_password: z
//       .string()
//       .min(1, { message: "Please confirm your password" }),
//   })
//   .refine((data) => data.password === data.confirm_password, {
//     message: "Passwords do not match",
//     path: ["confirm_password"],
//   });

export const forgotPassword = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
});

export const signIn = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export const createNewPassworSchema = z
  .object({
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),

    confirm_password: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const trainerStep1Schema = z
  .object({
    full_name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const trainerStep2Schema = z.object({
  specialization: z.string().min(2, "Specialization is required"),
  experience: z.string().min(1, "Experience is required"),
  skills: z.string().min(2, "Add at least one skill"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
});

export const trainerSignUp = trainerStep1Schema.merge(trainerStep2Schema);

export const agencyStep1Schema = z
  .object({
    representative_name: z
      .string()
      .min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    agency_id: z.string().min(3, "Agency ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export const agencyStep2Schema = z.object({
  agency_name: z.string().min(2, "Agency name is required"),
  address: z.string().min(5, "Address is required"),
  documents: z
    .array(z.instanceof(File))
    .min(1, "At least one document is required")
    .refine(
      (files) =>
        files.every((file) =>
          [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
            "image/png",
            "image/jpeg",
          ].includes(file.type)
        ),
      {
        message: "Only PDF, DOCX, PNG, or JPG files are allowed",
      }
    ),
});


export const cloudinaryDocumentSchema = z.object({
  secure_url: z.string().url(),
  document_public_id: z.string().min(1),
});

export const agencySignUpSchema = z.object({
  // Step 1 fields
  representative_name: z.string().min(2),
  email: z.string().email(),
  agency_id: z.string().min(1),
  password: z.string().min(8),

  // Step 2 fields
  agency_name: z.string().min(2),
  address: z.string().min(5),

 
  documents: z
    .array(cloudinaryDocumentSchema)
    .min(1, "At least one document is required"),
});

export type AgencySignUpFinal = z.infer<typeof agencySignUpSchema>;

export type CloudinaryDocument = z.infer<typeof cloudinaryDocumentSchema>;


export const agencySignUp = agencyStep1Schema.merge(agencyStep2Schema);

export type AgencyStep1 = z.infer<typeof agencyStep1Schema>;
export type AgencyStep2 = z.infer<typeof agencyStep2Schema>;
export type AgencyFull = z.infer<typeof agencySignUp>;

export type TrainerStep1 = z.infer<typeof trainerStep1Schema>;
export type TrainerStep2 = z.infer<typeof trainerStep2Schema>;
export type TrainerFull = z.infer<typeof trainerSignUp>;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  job_count: number;
  training_count: number;
  created_at: string;
  updated_at: string;
}

export type CategoriesResponse = Category[];

export interface CreateCategoryBody {
  name: string;
}

export interface UpdateCategoryBody {
  name: string;
}

export interface DeleteCategoryResponse {
  message: string;
}
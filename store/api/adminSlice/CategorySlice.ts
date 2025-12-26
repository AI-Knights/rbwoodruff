import { CategoriesResponse, Category, CreateCategoryBody, DeleteCategoryResponse, UpdateCategoryBody } from "@/types/admin/category.type";
import { api } from "../ApiSlice";


export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => '/admin-panel/categories/',
      providesTags: ["Category"]
    }),

    createCategory: builder.mutation<Category, CreateCategoryBody>({
      query: (body) => ({
        url: '/admin-panel/categories/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Category"]
    }),

    updateCategory: builder.mutation<Category, { id: string; body: UpdateCategoryBody }>({
      query: ({ id, body }) => ({
        url: `/admin-panel/categories/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ["Category"]
    }),

    deleteCategory: builder.mutation<DeleteCategoryResponse, string>({
      query: (id) => ({
        url: `/admin-panel/categories/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
import { useQuery } from '@tanstack/react-query'
import { getAllCategories, getCategoryById } from '../services/categoryService'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  })
}

export const useCategoryById = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  })
}
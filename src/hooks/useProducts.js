import { useQuery } from '@tanstack/react-query'
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from '../services/productService'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  })
}

export const useProductById = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  })
}

export const useProductsByCategory = (categoryId) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => getProductsByCategory(categoryId),
    enabled: !!categoryId,
  })
}

export const useSearchProducts = (keyword) => {
  return useQuery({
    queryKey: ['products', 'search', keyword],
    queryFn: () => searchProducts(keyword),
    enabled: !!keyword && keyword.length > 1,
    staleTime: 1000 * 60 * 2,
  })
}
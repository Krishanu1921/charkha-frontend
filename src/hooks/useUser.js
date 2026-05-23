import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../services/userService'
import toast from 'react-hot-toast'

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['profile'])
      toast.success('Profile updated successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update profile')
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to change password')
    },
  })
}

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  })
}

export const useAddAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses'])
      toast.success('Address added successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to add address')
    },
  })
}

export const useUpdateAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ addressId, addressData }) =>
      updateAddress(addressId, addressData),
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses'])
      toast.success('Address updated successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update address')
    },
  })
}

export const useDeleteAddress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries(['addresses'])
      toast.success('Address deleted successfully')
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete address')
    },
  })
}
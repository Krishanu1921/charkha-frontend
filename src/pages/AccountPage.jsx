import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useAddresses,
  useAddAddress,
  useDeleteAddress,
} from '../hooks/useUser'
import BottomNavBar from '../components/common/BottomNavBar'
import ROUTES from '../constants/routes'
import {
  User,
  Lock,
  MapPin,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  ArrowLeft,
  Edit2,
  ShoppingBag,
} from 'lucide-react'

export default function AccountPage() {
  const navigate       = useNavigate()
  const { user, logout } = useAuth()

  const [activeSection, setActiveSection] = useState(null)

  const { data: profile, isLoading: profileLoading } = useProfile()
  const { data: addresses = [] }                      = useAddresses()
  const { mutate: updateProfile, isPending: updating }     = useUpdateProfile()
  const { mutate: changePassword, isPending: changingPwd } = useChangePassword()
  const { mutate: addAddress, isPending: addingAddress }   = useAddAddress()
  const { mutate: deleteAddress }                          = useDeleteAddress()

  const handleLogout = async () => {
    await logout()
    navigate(ROUTES.ONBOARDING, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Header ── */}
      <div
        className="bg-white px-5 pt-12 pb-6 sticky top-0 z-40"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-3">
          {activeSection && (
            <button
              onClick={() => setActiveSection(null)}
              className="w-9 h-9 bg-gray-50 border border-gray-100
                rounded-full flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
          )}
          <h1
            className="text-lg font-bold text-[#1a1a1a]"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {activeSection === 'editProfile'    ? 'Edit Profile'
            : activeSection === 'changePassword' ? 'Change Password'
            : activeSection === 'addresses'      ? 'My Addresses'
            : activeSection === 'addAddress'     ? 'Add Address'
            : 'My Account'}
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Main menu ── */}
        {!activeSection && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-5 pt-5"
          >
            {/* Profile card */}
            {profileLoading ? (
              <div className="bg-white rounded-2xl h-24 animate-pulse mb-5" />
            ) : (
              <div className="bg-white rounded-2xl p-4 flex items-center
                gap-4 shadow-sm mb-5">
                <div className="w-14 h-14 rounded-full bg-orange-100
                  flex items-center justify-center text-2xl font-bold
                  text-[#FF6B35]">
                  {profile?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1a1a1a]">{profile?.name}</p>
                  <p className="text-xs text-gray-400">{profile?.email}</p>
                  <p className="text-xs text-gray-400">{profile?.phone}</p>
                </div>
                <button
                  onClick={() => setActiveSection('editProfile')}
                  className="w-8 h-8 bg-orange-50 rounded-full flex
                    items-center justify-center"
                >
                  <Edit2 size={14} className="text-[#FF6B35]" />
                </button>
              </div>
            )}

            {/* Menu items */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
              <MenuItem
                icon={<User size={18} />}
                label="Edit Profile"
                onClick={() => setActiveSection('editProfile')}
              />
              <MenuItem
                icon={<Lock size={18} />}
                label="Change Password"
                onClick={() => setActiveSection('changePassword')}
              />
              <MenuItem
                icon={<MapPin size={18} />}
                label="My Addresses"
                badge={addresses.length}
                onClick={() => setActiveSection('addresses')}
              />
              <MenuItem
                icon={<ShoppingBag size={18} />}
                label="My Orders"
                onClick={() => navigate(ROUTES.MY_ORDERS)}
              />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-white rounded-2xl p-4 flex items-center
                gap-3 shadow-sm text-red-400"
            >
              <LogOut size={18} />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </motion.div>
        )}

        {/* ── Edit Profile ── */}
        {activeSection === 'editProfile' && (
          <motion.div
            key="editProfile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-5"
          >
            <EditProfileForm
              profile={profile}
              onSubmit={(data) => updateProfile(data)}
              loading={updating}
            />
          </motion.div>
        )}

        {/* ── Change Password ── */}
        {activeSection === 'changePassword' && (
          <motion.div
            key="changePassword"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-5"
          >
            <ChangePasswordForm
              onSubmit={(data) => changePassword(data)}
              loading={changingPwd}
            />
          </motion.div>
        )}

        {/* ── Addresses ── */}
        {activeSection === 'addresses' && (
          <motion.div
            key="addresses"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-5"
          >
            <div className="flex flex-col gap-3">
              {addresses.length === 0 ? (
                <div className="text-center py-10 text-gray-300">
                  <MapPin size={48} className="mx-auto mb-3 text-gray-200" />
                  <p className="text-sm">No addresses yet</p>
                </div>
              ) : (
                addresses.map((address) => (
                  <AddressCard
                    key={address._id}
                    address={address}
                    onDelete={() => deleteAddress(address._id)}
                  />
                ))
              )}

              <button
                onClick={() => setActiveSection('addAddress')}
                className="w-full bg-white rounded-2xl p-4 flex items-center
                  justify-center gap-2 shadow-sm border-2 border-dashed
                  border-gray-200 text-[#FF6B35]"
              >
                <Plus size={18} />
                <span className="text-sm font-semibold">Add New Address</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Add Address ── */}
        {activeSection === 'addAddress' && (
          <motion.div
            key="addAddress"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-5 pt-5"
          >
            <AddAddressForm
              onSubmit={(data) => {
                addAddress(data, {
                  onSuccess: () => setActiveSection('addresses'),
                })
              }}
              loading={addingAddress}
            />
          </motion.div>
        )}

      </AnimatePresence>

      <BottomNavBar />
    </div>
  )
}

// ── Menu item ────────────────────────────────────────────────
function MenuItem({ icon, label, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4
        border-b border-gray-50 last:border-0"
    >
      <span className="text-[#FF6B35]">{icon}</span>
      <span className="flex-1 text-sm font-medium text-left text-[#1a1a1a]">
        {label}
      </span>
      {badge > 0 && (
        <span className="bg-orange-100 text-[#FF6B35] text-xs font-bold
          px-2 py-0.5 rounded-full mr-2">
          {badge}
        </span>
      )}
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  )
}

// ── Address card ─────────────────────────────────────────────
function AddressCard({ address, onDelete }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-semibold text-[#1a1a1a]">
              {address.fullName}
            </p>
            {address.isDefault && (
              <span className="bg-orange-100 text-[#FF6B35] text-[10px]
                font-bold px-2 py-0.5 rounded-full">
                Default
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {address.street}, {address.city}, {address.state} -{' '}
            {address.postalCode}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{address.phone}</p>
        </div>
        <button onClick={onDelete} className="p-1 ml-2">
          <Trash2 size={16} className="text-gray-300
            hover:text-red-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}

// ── Edit Profile form ────────────────────────────────────────
function EditProfileForm({ profile, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: profile?.name || '',
      phone: profile?.phone || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Full Name" error={errors.name}>
        <input
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl
            px-4 py-3.5 text-sm text-gray-700 outline-none
            focus:border-[#FF6B35] transition-all"
          {...register('name', { required: 'Name is required' })}
        />
      </FormField>

      <FormField label="Phone" error={errors.phone}>
        <input
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl
            px-4 py-3.5 text-sm text-gray-700 outline-none
            focus:border-[#FF6B35] transition-all"
          {...register('phone', {
            required: 'Phone is required',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Enter a valid 10-digit number',
            },
          })}
        />
      </FormField>

      <SubmitButton loading={loading}>Save Changes</SubmitButton>
    </form>
  )
}

// ── Change Password form ─────────────────────────────────────
function ChangePasswordForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <FormField label="Current Password" error={errors.currentPassword}>
        <input
          type="password"
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl
            px-4 py-3.5 text-sm text-gray-700 outline-none
            focus:border-[#FF6B35] transition-all"
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
        />
      </FormField>

      <FormField label="New Password" error={errors.newPassword}>
        <input
          type="password"
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl
            px-4 py-3.5 text-sm text-gray-700 outline-none
            focus:border-[#FF6B35] transition-all"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
      </FormField>

      <FormField label="Confirm Password" error={errors.confirmPassword}>
        <input
          type="password"
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl
            px-4 py-3.5 text-sm text-gray-700 outline-none
            focus:border-[#FF6B35] transition-all"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) =>
              val === watch('newPassword') || 'Passwords do not match',
          })}
        />
      </FormField>

      <SubmitButton loading={loading}>Change Password</SubmitButton>
    </form>
  )
}

// ── Add Address form ─────────────────────────────────────────
function AddAddressForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { country: 'India', isDefault: false },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Full Name" error={errors.fullName}>
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl
              px-4 py-3.5 text-sm text-gray-700 outline-none
              focus:border-[#FF6B35] transition-all"
            {...register('fullName', { required: 'Required' })}
          />
        </FormField>
        <FormField label="Phone" error={errors.phone}>
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl
              px-4 py-3.5 text-sm text-gray-700 outline-none
              focus:border-[#FF6B35] transition-all"
            {...register('phone', { required: 'Required' })}
          />
        </FormField>
      </div>

      <FormField label="Street" error={errors.street}>
        <input
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl
            px-4 py-3.5 text-sm text-gray-700 outline-none
            focus:border-[#FF6B35] transition-all"
          {...register('street', { required: 'Required' })}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="City" error={errors.city}>
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl
              px-4 py-3.5 text-sm text-gray-700 outline-none
              focus:border-[#FF6B35] transition-all"
            {...register('city', { required: 'Required' })}
          />
        </FormField>
        <FormField label="State" error={errors.state}>
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl
              px-4 py-3.5 text-sm text-gray-700 outline-none
              focus:border-[#FF6B35] transition-all"
            {...register('state', { required: 'Required' })}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Postal Code" error={errors.postalCode}>
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl
              px-4 py-3.5 text-sm text-gray-700 outline-none
              focus:border-[#FF6B35] transition-all"
            {...register('postalCode', { required: 'Required' })}
          />
        </FormField>
        <FormField label="Country" error={errors.country}>
          <input
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl
              px-4 py-3.5 text-sm text-gray-700 outline-none
              focus:border-[#FF6B35] transition-all"
            {...register('country', { required: 'Required' })}
          />
        </FormField>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          className="accent-[#FF6B35]"
          {...register('isDefault')}
        />
        <label htmlFor="isDefault" className="text-sm text-gray-500">
          Set as default address
        </label>
      </div>

      <SubmitButton loading={loading}>Save Address</SubmitButton>
    </form>
  )
}

// ── Reusable form field ──────────────────────────────────────
function FormField({ label, error, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error.message}</p>
      )}
    </div>
  )
}

// ── Submit button ────────────────────────────────────────────
function SubmitButton({ children, loading }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      className="w-full bg-[#FF6B35] text-white font-bold py-4
        rounded-2xl mt-2 disabled:opacity-60 flex items-center
        justify-center gap-2"
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30
            border-t-white rounded-full animate-spin" />
          Please wait...
        </>
      ) : children}
    </motion.button>
  )
}
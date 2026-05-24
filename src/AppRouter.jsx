import { Routes, Route } from 'react-router-dom'
import OnboardingPage from './pages/OnboardingPage'
import CreateAccountPage from './pages/CreateAccountPage'
import HomeFeedPage from './pages/HomeFeedPage'
import CartPage from './pages/CartPage'
import MyOrdersPage from './pages/MyOrdersPage'
import VirtualTrialPage from './pages/VirtualTrialPage'
import PaymentPage from './pages/PaymentPage'
import OrderConfirmedPage from './pages/OrderConfirmedPage'
import SellHomePage from './pages/SellHomePage'
import ListClothesPage from './pages/ListClothesPage'
import ListingSuccessPage from './pages/ListingSuccessPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import ProtectedRoute from './components/ProtectedRoute'
import ROUTES from './constants/routes'
import AccountPage from './pages/AccountPage'
import CategoriesPage from './pages/CategoriesPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.ONBOARDING}       element={<OnboardingPage />} />
      <Route path={ROUTES.SIGNUP}           element={<CreateAccountPage />} />
      <Route path={ROUTES.HOME}             element={<ProtectedRoute><HomeFeedPage /></ProtectedRoute>} />
      <Route path={ROUTES.ACCOUNT}             element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path={ROUTES.CATEGORIES}             element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path={ROUTES.MY_ORDERS}             element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />
      <Route path={ROUTES.CART}             element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path={ROUTES.VIRTUAL_TRIAL}    element={<ProtectedRoute><VirtualTrialPage /></ProtectedRoute>} />
<Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
      <Route path={ROUTES.ORDER_CONFIRMED}  element={<ProtectedRoute><OrderConfirmedPage /></ProtectedRoute>} />
      <Route path={ROUTES.SELL_HOME}        element={<ProtectedRoute><SellHomePage /></ProtectedRoute>} />
      <Route path={ROUTES.LIST_CLOTHES}     element={<ProtectedRoute><ListClothesPage /></ProtectedRoute>} />
      <Route path={ROUTES.LISTING_SUCCESS}  element={<ProtectedRoute><ListingSuccessPage /></ProtectedRoute>} />
      <Route path={ROUTES.TERMS}            element={<TermsPage />} />
      <Route path={ROUTES.PRIVACY}          element={<PrivacyPage />} />
    </Routes>
  )
};
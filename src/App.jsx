import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminLogin from './Components/AdminLogin.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';
import AdminLayout from './Components/Layout/AdminLayout.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import AdminDashboard from './Components/Pages/AdminPages/AdminDashboard.jsx';
import MemberList from './Components/Pages/AdminPages/members/List.jsx';
import Update from './Components/Pages/AdminPages/members/Update.jsx';
import PaymentPlanManagerList from './Components/Pages/AdminPages/Holiday Camps/PaymentPlanManager.jsx';
import AddPaymentPlanGroup from './Components/Pages/AdminPages/Holiday Camps/AddPaymentPlanGroup.jsx';
import { MemberProvider } from './Components/Pages/AdminPages/contexts/MemberContext.jsx';

import DiscountsList from './Components/Pages/AdminPages/Discounts/List.jsx';

import './App.css';

const AuthRoutes = () => {
  const location = useLocation();
  const isForgot = location.pathname === '/admin-ForgotPassword';

  return (
    <div className='login-container'>
      <div className={`login-container-inner ${isForgot ? 'forgetPass' : ''}`}>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-ForgotPassword" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const isAuthRoute = ['/admin-login', '/admin-ForgotPassword'].includes(location.pathname);

  if (isAuthRoute) return <AuthRoutes />;

  const protectedElement = (Component) => (
    <AdminLayout>
      <ProtectedRoute>{Component}</ProtectedRoute>
    </AdminLayout>
  );

  return (
    <Routes>
      <Route path="/" element={protectedElement(<AdminDashboard />)} />
      <Route path="/members" element={protectedElement(<MemberList />)} />
      <Route path="/members/update" element={protectedElement(<Update />)} />
      <Route path="/holiday-camps/payment-planManager" element={protectedElement(<PaymentPlanManagerList />)} />
      <Route path="/holiday-camps/add-payment-plan-group" element={protectedElement(<AddPaymentPlanGroup />)} />
      <Route path="/discounts/list" element={protectedElement(<DiscountsList />)} />
    
    </Routes>
  );
};


function App() {
  return (
    <Router>
      <MemberProvider>
        <AppRoutes />
      </MemberProvider>
    </Router>
  );
}

export default App;

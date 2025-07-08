import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminLogin from './Components/AdminLogin.jsx';
import AdminDashboard from './Components/Pages/AdminPages/AdminDashboard.jsx';
import AdminLayout from './Components/Layout/AdminLayout.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import ForgotPassword  from './Components/ForgotPassword.jsx';
import './App.css';
import MemberList from './Components/Pages/AdminPages/members/List.jsx';
import Update from './Components/Pages/AdminPages/members/Update.jsx';


import PaymentPlanManagerList from './Components/Pages/AdminPages/Holiday Camps/PaymentPlanManager.jsx';
import AddPaymentPlanGroup from './Components/Pages/AdminPages/Holiday Camps/AddPaymentPlanGroup.jsx';

function AppRoutes() {
  const location = useLocation();
const isAuthRoute = ['/admin-login', '/admin-ForgotPassword'].includes(location.pathname);
const isForgotPassword = location.pathname === '/admin-ForgotPassword';

if (isAuthRoute) {
  return (
    <div className='login-container'>
      <div className={`login-container-inner ${isForgotPassword ? 'forgetPass' : ''}`}>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-ForgotPassword" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  );
}

  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminLayout>
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          </AdminLayout>
        }
      />
      <Route
        path="/members"
        element={
          <AdminLayout>
            <ProtectedRoute>
              <MemberList />
            </ProtectedRoute>
          </AdminLayout>
        }
      />
       <Route
        path="/holiday-camps/payment-planManager"
        element={
          <AdminLayout>
            <ProtectedRoute>
              <PaymentPlanManagerList />
            </ProtectedRoute>
          </AdminLayout>
        }
      />
        <Route
        path="/holiday-camps/add-payment-plan-group"
        element={
          <AdminLayout>
            <ProtectedRoute>
              <AddPaymentPlanGroup />
            </ProtectedRoute>
          </AdminLayout>
        }
      />
      <Route
        path="/members/update"
        element={
          <AdminLayout>
            <ProtectedRoute>
              <Update />
            </ProtectedRoute>
          </AdminLayout>
        }
      />
      {/* Add other routes similarly */}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

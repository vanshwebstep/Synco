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
import { PaymentPlanContextProvider } from './Components/Pages/AdminPages/contexts/PaymentPlanContext.jsx';
import { DiscountContextProvider } from './Components/Pages/AdminPages/contexts/DiscountContext.jsx';


import DiscountsList from './Components/Pages/AdminPages/Discounts/List.jsx';
import DiscountCreate from './Components/Pages/AdminPages/Discounts/Create.jsx';

import './App.css';
import Notification from './Components/Pages/AdminPages/notification/Notification.jsx';
import NotificationList from './Components/Pages/AdminPages/notification/NotificationList.jsx';
import { NotificationProvider } from './Components/Pages/AdminPages/contexts/NotificationContext.jsx';
import List from './Components/Pages/AdminPages/venus/List.jsx';
import { VenueProvider } from './Components/Pages/AdminPages/contexts/VenueContext.jsx';

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
      <Route path="/notification" element={protectedElement(<Notification />)} />
      <Route path="/notification-list" element={protectedElement(<NotificationList />)} />
      <Route path="/discounts/list" element={protectedElement(<DiscountsList />)} />
      <Route path="/discounts/create" element={protectedElement(<DiscountCreate />)} />
      <Route path="/weekly-classes/venues" element={protectedElement(<List />)} />

    </Routes>
  );
};


function App() {
  return (
    <Router>
      <NotificationProvider>
        <VenueProvider>
          <MemberProvider>
            <PaymentPlanContextProvider>
              <DiscountContextProvider>
                <AppRoutes />
              </ DiscountContextProvider>
            </ PaymentPlanContextProvider>
          </MemberProvider>
        </VenueProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;

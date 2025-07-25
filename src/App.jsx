// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import AdminLogin from './Components/AdminLogin.jsx';
import ResetPassword from './Components/ResetPassword.jsx';

import ForgotPassword from './Components/ForgotPassword.jsx';
import AdminLayout from './Components/Layout/AdminLayout.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';

import Dashboard from './Components/Pages/Dashboard.jsx';
import MemberList from './Components/Pages/AdminPages/members/List.jsx';
import Update from './Components/Pages/AdminPages/members/Update.jsx';
import PaymentPlanManagerList from './Components/Pages/AdminPages/Holiday Camps/PaymentPlanManager.jsx';
import AddPaymentPlanGroup from './Components/Pages/AdminPages/Holiday Camps/AddPaymentPlanGroup.jsx';
import DiscountsList from './Components/Pages/AdminPages/discounts/list.jsx';
import DiscountCreate from './Components/Pages/AdminPages/discounts/create.jsx';
import Notification from './Components/Pages/AdminPages/notification/Notification.jsx';
import NotificationList from './Components/Pages/AdminPages/notification/NotificationList.jsx';
import List from './Components/Pages/AdminPages/venus/List.jsx';
import FindAClass from './Components/Pages/AdminPages/Weekly Classes/Find a class/List.jsx';
import ClassSchedule from './Components/Pages/AdminPages/venus/Class Schedule/List.jsx';
import Pending from './Components/Pages/AdminPages/venus/Class Schedule/View Session/pending.jsx';
import Completed from './Components/Pages/AdminPages/venus/Class Schedule/View Session/completed.jsx';
import Cancel from './Components/Pages/AdminPages/venus/Class Schedule/View Session/cancel.jsx';

import TermDateList from './Components/Pages/AdminPages/Weekly Classes/Term And Condition/List.jsx';
import TermDateCreate from './Components/Pages/AdminPages/Weekly Classes/Term And Condition/Create.jsx';

import TermDateUpdate from './Components/Pages/AdminPages/Weekly Classes/Term And Condition/Update.jsx';
import SessionPlanList from './Components/Pages/AdminPages/Holiday Camps/Session plan library/list.jsx';
import SessionPlanCreate from './Components/Pages/AdminPages/Holiday Camps/Session plan library/Create.jsx';
import SessionPlanPreview from './Components/Pages/AdminPages/Holiday Camps/Session plan library/Preview.jsx';

import { MemberProvider } from './Components/Pages/AdminPages/contexts/MemberContext.jsx';
import { PaymentPlanContextProvider } from './Components/Pages/AdminPages/contexts/PaymentPlanContext.jsx';
import { DiscountContextProvider } from './Components/Pages/AdminPages/contexts/DiscountContext.jsx';
import { SessionPlanContextProvider } from './Components/Pages/AdminPages/contexts/SessionPlanContext.jsx';
import { NotificationProvider } from './Components/Pages/AdminPages/contexts/NotificationContext.jsx';
import { VenueProvider } from './Components/Pages/AdminPages/contexts/VenueContext.jsx';
import { ClassScheduleProvider } from './Components/Pages/AdminPages/contexts/ClassScheduleContent.jsx';
import { TermDatesSessionProvider } from './Components/Pages/AdminPages/contexts/TermDatesSessionContext.jsx';
import { FindClassProvider } from './Components/Pages/AdminPages/contexts/FindClassContext.jsx';

import './App.css';

// ----------------- ALLOWED PATHS -----------------
const getAllowedBasePathsFromMenu = (items, role) => {
  return items
    .filter(item => !item.role || item.role.includes(role))
    .map(item => item.link)
    .filter(Boolean);
};

// ----------------- AUTH ROUTES -----------------
const AuthRoutes = () => {
  const location = useLocation();
  const isForgot = location.pathname === '/admin-ForgotPassword';

  return (
    <div className='login-container'>
      <div className={`login-container-inner ${isForgot ? 'forgetPass' : ''}`}>
        <Routes>
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-ForgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </div>
    </div>
  );
};

// ----------------- MAIN ROUTES -----------------
const AppRoutes = () => {
  const location = useLocation();
  const isAuth = ['/admin-login', '/reset-password', '/admin-ForgotPassword'].includes(location.pathname);

  if (isAuth) return <AuthRoutes />;

  return (
    <Routes>
      <Route path="/" element={<AdminLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AdminLayout>} />
      <Route path="/dashboard" element={<AdminLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AdminLayout>} />
      <Route path="/members/List" element={<AdminLayout><ProtectedRoute><MemberList /></ProtectedRoute></AdminLayout>} />
      <Route path="/members/update" element={<AdminLayout><ProtectedRoute><Update /></ProtectedRoute></AdminLayout>} />

      <Route path="/holiday-camps/payment-planManager" element={<AdminLayout><ProtectedRoute><PaymentPlanManagerList /></ProtectedRoute></AdminLayout>} />
      <Route path="/holiday-camps/add-payment-plan-group" element={<AdminLayout><ProtectedRoute><AddPaymentPlanGroup /></ProtectedRoute></AdminLayout>} />

      <Route path="/notification" element={<AdminLayout><ProtectedRoute><Notification /></ProtectedRoute></AdminLayout>} />
      <Route path="/notification-list" element={<AdminLayout><ProtectedRoute><NotificationList /></ProtectedRoute></AdminLayout>} />

      <Route path="/holiday-camps/discounts/list" element={<AdminLayout><ProtectedRoute><DiscountsList /></ProtectedRoute></AdminLayout>} />
      <Route path="/holiday-camps/discounts/create" element={<AdminLayout><ProtectedRoute><DiscountCreate /></ProtectedRoute></AdminLayout>} />

      <Route path="/weekly-classes/venues" element={<AdminLayout><ProtectedRoute><List /></ProtectedRoute></AdminLayout>} />
      <Route path="/weekly-classes/find-a-class" element={<AdminLayout><ProtectedRoute><FindAClass /></ProtectedRoute></AdminLayout>} />

      <Route path="/weekly-classes/venues/class-schedule" element={<AdminLayout><ProtectedRoute><ClassSchedule /></ProtectedRoute></AdminLayout>} />
      <Route path="/weekly-classes/venues/class-schedule/Sessions/pending" element={<AdminLayout><ProtectedRoute><Pending /></ProtectedRoute></AdminLayout>} />
      <Route path="/weekly-classes/venues/class-schedule/Sessions/completed" element={<AdminLayout><ProtectedRoute><Completed /></ProtectedRoute></AdminLayout>} />
      <Route path="/weekly-classes/venues/class-schedule/Sessions/cancel" element={<AdminLayout><ProtectedRoute><Cancel /></ProtectedRoute></AdminLayout>} />

      <Route path="/weekly-classes/term-dates/list" element={<AdminLayout><ProtectedRoute><TermDateList /></ProtectedRoute></AdminLayout>} />
      <Route path="/weekly-classes/term-dates/create" element={<AdminLayout><ProtectedRoute><TermDateCreate /></ProtectedRoute></AdminLayout>} />
      <Route path="/weekly-classes/term-dates/update" element={<AdminLayout><ProtectedRoute><TermDateUpdate /></ProtectedRoute></AdminLayout>} />

      <Route path="/holiday-camps/session-plan-list" element={<AdminLayout><ProtectedRoute><SessionPlanList /></ProtectedRoute></AdminLayout>} />
      <Route path="/holiday-camps/session-plan-create" element={<AdminLayout><ProtectedRoute><SessionPlanCreate /></ProtectedRoute></AdminLayout>} />
      <Route path="/holiday-camps/session-plan-preview" element={<AdminLayout><ProtectedRoute><SessionPlanPreview /></ProtectedRoute></AdminLayout>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};


// ----------------- APP WRAPPER -----------------
function App() {
  return (
    <Router basename="/demo/synco">
      <NotificationProvider>
        <VenueProvider>
          <MemberProvider>
            <PaymentPlanContextProvider>
              <DiscountContextProvider>
                <SessionPlanContextProvider>
                  <TermDatesSessionProvider>
                    <ClassScheduleProvider>
                      <FindClassProvider>
                        <AppRoutes />
                      </FindClassProvider>
                    </ClassScheduleProvider>
                  </TermDatesSessionProvider>
                </SessionPlanContextProvider>
              </DiscountContextProvider>
            </PaymentPlanContextProvider>
          </MemberProvider>
        </VenueProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;

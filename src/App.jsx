// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import AdminLogin from './Components/AdminLogin.jsx';
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
import SessionPlanList from './Components/Pages/AdminPages/Holiday Camps/Session plan library/list.jsx';
import SessionPlanCreate from './Components/Pages/AdminPages/Holiday Camps/Session plan library/Create.jsx';
import SessionPlanPreview from './Components/Pages/AdminPages/Holiday Camps/Session plan library/Preview.jsx';

import { MemberProvider } from './Components/Pages/AdminPages/contexts/MemberContext.jsx';
import { PaymentPlanContextProvider } from './Components/Pages/AdminPages/contexts/PaymentPlanContext.jsx';
import { DiscountContextProvider } from './Components/Pages/AdminPages/contexts/DiscountContext.jsx';
import { SessionPlanContextProvider } from './Components/Pages/AdminPages/contexts/SessionPlanContext.jsx';
import { NotificationProvider } from './Components/Pages/AdminPages/contexts/NotificationContext.jsx';
import { VenueProvider } from './Components/Pages/AdminPages/contexts/VenueContext.jsx';

import './App.css';

// ----------------- MENU CONFIG -----------------
const commonRole = ['Admin', 'user', 'Member','Agent' ,'Super Admin'];

const menuItems = [
  {
    title: 'Dashboard',
    icon: '/SidebarLogos/Dashboard.png',
    iconHover: '/SidebarLogos/DashboardH.png',
    link: '/',
    role: commonRole
  },
  {
    title: 'Weekly Classes',
    icon: '/SidebarLogos/WeeklyClasses.png',
    iconHover: '/SidebarLogos/WeeklyClassesH.png',
    link: '/weekly-classes',
    role: commonRole,
    subItems: [
       { title: 'Find a class', link: '/weekly-classes/find-a-class', role: commonRole },
      { title: 'Venues', link: '/weekly-classes/venues' },
      { title: 'Class Schedule', link: '/weekly-classes/venues/class-schedule' },
      { title: 'View Session Plans', link: '/weekly-classes/venues/class-schedule/view-session-plans' },
      { title: 'Term Dates & Session Plan mapping', link: '/weekly-classes/term-dates/list' }
    ]
  },
    {
    title: 'One to One',
    icon: '/SidebarLogos/OneTOOne.png',
    iconHover: '/SidebarLogos/OneTOOneH.png',
    role: commonRole,
    subItems: [
      {
        title: 'Leads',
        subItems: [
          { title: 'Leads Database', link: '/notification-list', role: commonRole },
          { title: 'Add New Lead', link: '#', role: commonRole }
        ]
      },
      {
        title: 'Sales',
        subItems: [
          { title: 'Sale X', link: '/one-to-one/sales/x', role: commonRole },
          { title: 'Sale Y', link: '/one-to-one/sales/y', role: commonRole }
        ]
      }
    ]
  },
  {
    title: 'Holiday Camps',
    icon: '/SidebarLogos/Holiday.png',
    iconHover: '/SidebarLogos/HolidayH.png',
    link: '/holiday-camps',
    role: commonRole,
    subItems: [
      { title: 'Session Plan Library', link: '/holiday-camps/session-plan-list', role: commonRole },
      { title: 'Payment Plan Manager', link: '/holiday-camps/payment-planManager', role: commonRole },
      { title: 'Add Payment Plan Group', link: '/holiday-camps/add-payment-plan-group', role: commonRole },
      { title: 'Discounts', link: '/holiday-camps/discounts/list', role: commonRole }
    ]
  },
  {
    title: 'Notification',
    icon: '/SidebarLogos/Notification.png',
    iconHover: '/SidebarLogos/NotificationH.png',
    link: '/notification-list',
    role: commonRole
  },
  {
    title: 'Administration',
    icon: '/SidebarLogos/Admistration.png',
    iconHover: '/SidebarLogos/AdmistrationH.png',
    link: '/members',
    role: ['Admin','Super Admin']
  }
];

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
        </Routes>
      </div>
    </div>
  );
};

// ----------------- MAIN ROUTES -----------------
const AppRoutes = () => {
  const location = useLocation();
  const isAuth = ['/admin-login', '/admin-ForgotPassword'].includes(location.pathname);

  if (isAuth) return <AuthRoutes />;

  return (
    <Routes>
      <Route path="/" element={<AdminLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AdminLayout>} />
      <Route path="/dashboard" element={<AdminLayout><ProtectedRoute><Dashboard /></ProtectedRoute></AdminLayout>} />
      <Route path="/members" element={<AdminLayout><ProtectedRoute><MemberList /></ProtectedRoute></AdminLayout>} />
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
                <AppRoutes />
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

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
import Unauthorized from './Components/Unauthorized.jsx';

// Import all your pages
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

// Import all context providers
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

// Define roles
const commonRole = ['Admin', 'user', 'Member', 'Agent', 'Super Admin'];

// Role-based route component
const RoleBasedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("role");
  console.log('userRole',userRole)
  console.log('allowedRoles',allowedRoles)
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

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
      {/* Public routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Role-based routes */}
      <Route path="/" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={commonRole}>
              <Dashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/dashboard" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={commonRole}>
              <Dashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/members/List" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Super Admin']}>
              <MemberList />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/members/update" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Super Admin']}>
              <Update />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/holiday-camps/payment-planManager" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <PaymentPlanManagerList />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/holiday-camps/add-payment-plan-group" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <AddPaymentPlanGroup />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/notification" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={commonRole}>
              <Notification />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/notification-list" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={commonRole}>
              <NotificationList />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/holiday-camps/discounts/list" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <DiscountsList />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/holiday-camps/discounts/create" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <DiscountCreate />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/weekly-classes/venues" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <List />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/weekly-classes/find-a-class" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Call Agent']}>
              <FindAClass />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/weekly-classes/venues/class-schedule" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Ops Manager', 'Coach']}>
              <ClassSchedule />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/weekly-classes/venues/class-schedule/Sessions/pending" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Ops Manager', 'Coach']}>
              <Pending />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/weekly-classes/venues/class-schedule/Sessions/completed" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Ops Manager', 'Coach']}>
              <Completed />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/weekly-classes/venues/class-schedule/Sessions/cancel" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Ops Manager', 'Coach']}>
              <Cancel />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/weekly-classes/term-dates/list" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Super Admin']}>
              <TermDateList />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/weekly-classes/term-dates/create" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Super Admin']}>
              <TermDateCreate />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/weekly-classes/term-dates/update" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin', 'Super Admin']}>
              <TermDateUpdate />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

      <Route path="/holiday-camps/session-plan-list" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <SessionPlanList />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/holiday-camps/session-plan-create" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <SessionPlanCreate />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />
      
      <Route path="/holiday-camps/session-plan-preview" element={
        <AdminLayout>
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['Admin']}>
              <SessionPlanPreview />
            </RoleBasedRoute>
          </ProtectedRoute>
        </AdminLayout>
      } />

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

// Menu items configuration

export const menuItems = [
  {
    title: 'Dashboard',
    icon: '/demo/synco/SidebarLogos/Dashboard.png',
    iconHover: '/demo/synco/SidebarLogos/DashboardH.png',
    link: '/',
    role: commonRole
  },
  {
    title: 'Weekly Classes',
    icon: '/demo/synco/SidebarLogos/WeeklyClasses.png',
    iconHover: '/demo/synco/SidebarLogos/WeeklyClassesH.png',
    role: commonRole,
    subItems: [
      { title: 'Find a class', link: '/weekly-classes/find-a-class', role: ['Admin', 'Call Agent'] },
      { title: 'Venues', link: '/weekly-classes/venues', role: ['Admin'] },
      { title: 'Term Dates & Session Plan mapping', link: '/weekly-classes/term-dates/list', role: ['Admin'] },
    ]
  },
  {
    title: 'One to One',
    icon: '/demo/synco/SidebarLogos/OneTOOne.png',
    iconHover: '/demo/synco/SidebarLogos/OneTOOneH.png',
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
    icon: '/demo/synco/SidebarLogos/Holiday.png',
    iconHover: '/demo/synco/SidebarLogos/HolidayH.png',
    role:  ['Admin'],
    subItems: [
      { title: 'Session Plan Library', link: '/holiday-camps/session-plan-list', role: ['Admin'] },
      { title: 'Payment Plan Manager', link: '/holiday-camps/payment-planManager', role: ['Admin'] },
      { title: 'Discounts', link: '/holiday-camps/discounts/list', role: ['Admin'] }
    ]
  },
  {
    title: 'Birthday parties',
    icon: '/demo/synco/SidebarLogos/Birthday.png',
    iconHover: '/demo/synco/SidebarLogos/BirthdayH.png',
    role: commonRole,
    subItems: [
      { title: 'Party 1', link: '#', role: commonRole },
      { title: 'Party 2', link: '#', role: commonRole }
    ]
  },
  {
    title: 'Club',
    icon: '/demo/synco/SidebarLogos/Club.png',
    iconHover: '/demo/synco/SidebarLogos/ClubH.png',
    role: commonRole,
    subItems: [
      {
        title: 'Session A',
        subItems: [
          { title: 'Slot 1', link: '#', role: commonRole },
          { title: 'Slot 2', link: '#', role: commonRole }
        ]
      },
      {
        title: 'Session B',
        subItems: [
          { title: 'Slot 3', link: '#', role: commonRole },
          { title: 'Slot 4', link: '#', role: commonRole }
        ]
      },
      { title: 'Session C', link: '#', role: commonRole }
    ]
  },
  { title: 'Merchandise', icon: '/demo/synco/SidebarLogos/Merchandise.png', iconHover: '/demo/synco/SidebarLogos/MerchandiseH.png', link: '#', role: commonRole },
  { title: 'Email management', icon: '/demo/synco/SidebarLogos/Management.png', iconHover: '/demo/synco/SidebarLogos/ManagementH.png', link: '#', role: commonRole },
  {
    title: 'Surveys',
    icon: '/demo/synco/SidebarLogos/Survey.png',
    iconHover: '/demo/synco/SidebarLogos/SurveyH.png',
    role: commonRole,
    subItems: [
      { title: 'Survey 1', link: '#', role: commonRole },
      { title: 'Survey 2', link: '#', role: commonRole }
    ]
  },
  {
    title: 'Email marketing',
    icon: '/demo/synco/SidebarLogos/Marketing.png',
    iconHover: '/demo/synco/SidebarLogos/MarketingH.png',
    role: commonRole,
    subItems: [
      { title: 'Campaign 1', link: '#', role: commonRole },
      { title: 'Campaign 2', link: '#', role: commonRole }
    ]
  },
  {
    title: 'Recruitment',
    icon: '/demo/synco/SidebarLogos/Recruitment.png',
    iconHover: '/demo/synco/SidebarLogos/RecruitmentH.png',
    role: commonRole,
    subItems: [
      { title: 'Job 1', link: '#', role: commonRole },
      { title: 'Job 2', link: '#', role: commonRole }
    ]
  },
  {
    title: 'Reports',
    icon: '/demo/synco/SidebarLogos/Reports.png',
    iconHover: '/demo/synco/SidebarLogos/ReportsH.png',
    role: commonRole,
    subItems: [
      { title: 'Report 1', link: '#', role: commonRole },
      { title: 'Report 2', link: '#', role: commonRole }
    ]
  },
  {
    title: 'Marketing reports',
    icon: '/demo/synco/SidebarLogos/MarketingReports.png',
    iconHover: '/demo/synco/SidebarLogos/MarketingReportsH.png',
    role: commonRole,
    subItems: [
      { title: 'Report A', link: '#', role: commonRole },
      { title: 'Report B', link: '#', role: commonRole }
    ]
  },
  {
    title: 'Recruitment reports',
    icon: '/demo/synco/SidebarLogos/ReqReports.png',
    iconHover: '/demo/synco/SidebarLogos/ReqReportsH.png',
    link: '#',
    role: commonRole
  },
  {
    title: 'Synco Chat',
    icon: '/demo/synco/SidebarLogos/bubble-chat.png',
    iconHover: '/demo/synco/SidebarLogos/bubble-chatH.png',
    link: '#',
    role: commonRole
  },
  {
    title: 'Templates',
    icon: '/demo/synco/SidebarLogos/Template.png',
    iconHover: '/demo/synco/SidebarLogos/TemplateH.png',
    link: '#',
    role: commonRole
  },
  {
    title: 'Administration',
    icon: '/demo/synco/SidebarLogos/Admistration.png',
    iconHover: '/demo/synco/SidebarLogos/AdmistrationH.png',
    link: '/members/List',
    role: ['Admin', 'Super Admin']
  }
];
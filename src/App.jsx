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
import MemberList from './Components/Pages/AdminPages/configuration/members/List.jsx';
import Update from './Components/Pages/AdminPages/configuration/members/Update.jsx';
import SubscriptiontPlanManagerList from './Components/Pages/AdminPages/configuration/Weekly Classes/Subscription plan manager/SubscriptionPlanManager.jsx';
import AddMembershipPlanGroup from './Components/Pages/AdminPages/configuration/Weekly Classes/Subscription plan manager/AddMembershipPlanGroup.jsx';
import DiscountsList from './Components/Pages/AdminPages/configuration/discounts/list.jsx';
import DiscountCreate from './Components/Pages/AdminPages/configuration/discounts/create.jsx';
import Notification from './Components/Pages/AdminPages/notification/Notification.jsx';
import NotificationList from './Components/Pages/AdminPages/notification/NotificationList.jsx';
import List from './Components/Pages/AdminPages/configuration/Weekly Classes/venus/List.jsx';
import FindAClass from './Components/Pages/AdminPages/Configuration/Weekly Classes/Find a class/List.jsx';
import BookFreeTrial from './Components/Pages/AdminPages/Configuration/Weekly Classes/Find a class/Book a free trial/list.jsx'
import BookMembership from './Components/Pages/AdminPages/Configuration/Weekly Classes/Find a class/Book a Membership/list.jsx'
import ClassSchedule from './Components/Pages/AdminPages/Configuration/Weekly Classes/venus/Class Schedule/List.jsx';
import Pending from './Components/Pages/AdminPages/configuration/Weekly Classes/venus/Class Schedule/View Session/pending.jsx';
import Completed from './Components/Pages/AdminPages/configuration/Weekly Classes/venus/Class Schedule/View Session/completed.jsx';
import Cancel from './Components/Pages/AdminPages/configuration/Weekly Classes/venus/Class Schedule/View Session/cancel.jsx';
import TermDateList from './Components/Pages/AdminPages/configuration/Weekly Classes/Term And Condition/List.jsx';
import TermDateCreate from './Components/Pages/AdminPages/configuration/Weekly Classes/Term And Condition/Create.jsx';
import TermDateUpdate from './Components/Pages/AdminPages/configuration/Weekly Classes/Term And Condition/Update.jsx';
import SessionPlanList from './Components/Pages/AdminPages/configuration/Weekly Classes/Session plan library/list.jsx';
import SessionPlanCreate from './Components/Pages/AdminPages/configuration/Weekly Classes/Session plan library/Create.jsx';
import SessionPlanPreview from './Components/Pages/AdminPages/configuration/Weekly Classes/Session plan library/Preview.jsx';
import TrialLists from './Components/Pages/AdminPages/Configuration/Weekly Classes/Trials/List.jsx';
import AddMembers from './Components/Pages/AdminPages/Configuration/Weekly Classes/All Members/List.jsx';
import MembershipSales from './Components/Pages/AdminPages/Configuration/Weekly Classes/All Members/membershipSales.jsx';
import AccountInformation from './Components/Pages/AdminPages/Configuration/Weekly Classes/Find a class/Book a free trial/Account Information Book Free Trial/list.jsx';
import PermissionRole from './Components/Pages/AdminPages/Configuration/Permissions/list.jsx';
// import { AccountInformationMembership } from './Components/Pages/AdminPages/Configuration/Weekly Classes/All Members/Account Information Book Membership/List.jsx';

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
import { BookFreeTrialProvider } from './Components/Pages/AdminPages/contexts/BookAFreeTrialContext.jsx';

import './App.css';
import { PermissionProvider } from './Components/Pages/AdminPages/Common/permission.jsx';
import AccountInfoBookMembership from './Components/Pages/AdminPages/Configuration/Weekly Classes/All Members/Account Information Book Membership/List.jsx';
import SeeDetails from './Components/Pages/AdminPages/Configuration/Weekly Classes/All Members/See Details/list.jsx';
import AddtoWaitingList from './Components/Pages/AdminPages/Configuration/Weekly Classes/Find a class/Add to Waiting List/List.jsx';
// Define roles
const commonRole = ['Admin', 'user', 'Member', 'Agent', 'Super Admin'];

// Role-based route component
const RoleBasedRoute = ({ children }) => {
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
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Dashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Dashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/members/List" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <MemberList />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/members/update" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Update />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/subscription-planManager" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SubscriptiontPlanManagerList />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/add-subscription-plan-group" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AddMembershipPlanGroup />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/notification" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Notification />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/notification-list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <NotificationList />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/holiday-camps/discounts/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <DiscountsList />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/holiday-camps/discounts/create" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <DiscountCreate />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/venues" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <List />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/find-a-class" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <FindAClass />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuration/weekly-classes/find-a-class/book-a-free-trial/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BookFreeTrial />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
       <Route path="/configuration/weekly-classes/find-a-class/add-to-waiting-list/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AddtoWaitingList />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuration/weekly-classes/find-a-class/book-a-membership/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BookMembership />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuration/weekly-classes/find-a-class/book-a-free-trial/account-info/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AccountInformation />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuration/weekly-classes/venues/class-schedule" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <ClassSchedule />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/venues/class-schedule/Sessions/pending" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Pending />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/venues/class-schedule/Sessions/completed" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Completed />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/venues/class-schedule/Sessions/cancel" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Cancel />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/term-dates/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <TermDateList />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/term-dates/create" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <TermDateCreate />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/term-dates/update" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <TermDateUpdate />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/session-plan-list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SessionPlanList />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/session-plan-create" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SessionPlanCreate />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/configuration/weekly-classes/session-plan-preview" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SessionPlanPreview />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuration/weekly-classes/trial/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <TrialLists />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuration/weekly-classes/all-members/list" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AddMembers />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/configuration/weekly-classes/all-members/membership-sales" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <MembershipSales />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
       <Route path="/configuration/weekly-classes/all-members/account-info" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AccountInfoBookMembership />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
        <Route path="/configuration/weekly-classes/all-members/see-details" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SeeDetails />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/permission" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <PermissionRole />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />


      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

// ----------------- APP WRAPPER -----------------
function App() {
  return (
    <Router basename="/demo/synco/">

      <NotificationProvider>
        <VenueProvider>
          <MemberProvider>
            <PaymentPlanContextProvider>
              <DiscountContextProvider>
                <SessionPlanContextProvider>
                  <TermDatesSessionProvider>
                    <ClassScheduleProvider>
                      <FindClassProvider>
                        <BookFreeTrialProvider>
                          <PermissionProvider>
                            <AppRoutes />
                          </PermissionProvider>
                        </BookFreeTrialProvider>
                      </FindClassProvider>
                    </ClassScheduleProvider>
                  </TermDatesSessionProvider>
                </SessionPlanContextProvider>
              </DiscountContextProvider>
            </PaymentPlanContextProvider>
          </MemberProvider>
        </VenueProvider>
      </NotificationProvider>
    </Router >
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
      { title: 'Find a class', link: '/configuration/weekly-classes/find-a-class', role: ['Admin', 'Call Agent'] },
      { title: 'Venues', link: '/configuration/weekly-classes/venues', role: ['Admin'] },
      { title: 'Term Dates & Session Plan mapping', link: '/configuration/weekly-classes/term-dates/list', role: ['Admin'] },
      { title: 'Trials', link: '/configuration/weekly-classes/trial/list', role: ['Admin'] },
      { title: 'All Members', link: '/configuration/weekly-classes/all-members/list', role: ['Admin'] },
      { title: 'All Members', link: '/configuration/weekly-classes/all-members/membership-sales', role: ['Admin'] },

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
    role: ['Admin'],
    subItems: [
      { title: 'Session Plan Library', link: '/configuration/weekly-classes/session-plan-list', role: ['Admin'] },
      { title: 'Subscription Plan Manager', link: '/configuration/weekly-classes/subscription-planManager', role: ['Admin'] },
      { title: 'Discounts', link: '/configuration/holiday-camps/discounts/list', role: ['Admin'] }
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
    link: '/configuration/members/List',
    role: ['Admin', 'Super Admin']
  }
];
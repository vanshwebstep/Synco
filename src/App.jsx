// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';

import AdminLogin from './Components/AdminLogin.jsx';
import ResetPassword from './Components/ResetPassword.jsx';
import ForgotPassword from './Components/ForgotPassword.jsx';
import AdminLayout from './Components/Layout/AdminLayout.jsx';
import PermissionProtectedRoute from './PermissionProtectedRoute.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import Unauthorized from './Components/Unauthorized.jsx';
import Test from './Test.jsx';
import { renderProtectedRoute } from "./RenderProtectedRoute";

// Import all your pages
import Dashboard from './Components/Pages/Dashboard.jsx';
import MemberList from './Components/Pages/AdminPages/members/List.jsx';
import Update from './Components/Pages/AdminPages/members/Update.jsx';
import SubscriptiontPlanManagerList from './Components/Pages/AdminPages/configuration/Weekly Classes/Subscription plan manager/SubscriptionPlanManager.jsx';
import AddMembershipPlanGroup from './Components/Pages/AdminPages/configuration/Weekly Classes/Subscription plan manager/AddMembershipPlanGroup.jsx';
import DiscountsList from './Components/Pages/AdminPages/discounts/list.jsx';
import DiscountCreate from './Components/Pages/AdminPages/discounts/create.jsx';
import Notification from './Components/Pages/AdminPages/notification/Notification.jsx';
import NotificationList from './Components/Pages/AdminPages/notification/NotificationList.jsx';
import List from './Components/Pages/AdminPages/configuration/Weekly Classes/venus/List.jsx';
import FindAClass from './Components/Pages/AdminPages/Weekly Classes/Find a class/List.jsx';
import BookFreeTrial from './Components/Pages/AdminPages/Weekly Classes/Find a class/Book a free trial/list.jsx'
import BookMembership from './Components/Pages/AdminPages/Weekly Classes/Find a class/Book a Membership/list.jsx'
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
import TrialLists from './Components/Pages/AdminPages/Weekly Classes/Trials/List.jsx';
import AddMembers from './Components/Pages/AdminPages/Weekly Classes/All Members/List.jsx';
import MembershipSales from './Components/Pages/AdminPages/Weekly Classes/All Members/membershipSales.jsx';
import AccountInformation from './Components/Pages/AdminPages/Weekly Classes/Find a class/Book a free trial/Account Information Book Free Trial/list.jsx';
import PermissionRole from './Components/Pages/AdminPages/Permissions/list.jsx';
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
import { PermissionProvider, usePermission } from './Components/Pages/AdminPages/Common/permission.jsx';
import AccountInfoBookMembership from './Components/Pages/AdminPages/Weekly Classes/All Members/Account Information Book Membership/List.jsx';
import SeeDetails from './Components/Pages/AdminPages/Weekly Classes/All Members/See Details/list.jsx';
import AddtoWaitingList from './Components/Pages/AdminPages/Weekly Classes/Find a class/Add to Waiting List/AddtoWaitingList.jsx';
import WaitingList from './Components/Pages/AdminPages/Weekly Classes/Find a class/Add to Waiting List/List.jsx';
import AccountInfoWaitingList from './Components/Pages/AdminPages/Weekly Classes/Find a class/Add to Waiting List/Account Information Waiting List/List.jsx';
import Capacity from './Components/Pages/AdminPages/Weekly Classes/Capacity/list.jsx';
import CancellationList from './Components/Pages/AdminPages/Weekly Classes/Cancellation/list.jsx';
import AccountInfoCancellation from './Components/Pages/AdminPages/Weekly Classes/Cancellation/Account Information Cancellation/list.jsx';
import { BookFreeTrialLoaderProvider } from './Components/Pages/AdminPages/contexts/BookAFreeTrialLoaderContext.jsx';
import KeyInfomation from './Components/Pages/AdminPages/Weekly Classes/Key Information/KeyInfomation.jsx';
// Define roles
import Account from './Components/Pages/AdminPages/Weekly Classes/account-information/Account.jsx';
import Preview from './Components/Pages/AdminPages/configuration/Weekly Classes/Session plan library/Preview.jsx';
import MainTable from './Components/Pages/AdminPages/Weekly Classes/account-information/MainTable.jsx';
import { AccountsInfoProvider } from './Components/Pages/AdminPages/contexts/AccountsInfoContext.jsx';
import SessionPlan from './Components/Pages/AdminPages/one-to-one/Session plan/SessionPlan.jsx';
import Create from './Components/Pages/AdminPages/one-to-one/Session plan/Create.jsx';
import OnetoOneUpdate from './Components/Pages/AdminPages/one-to-one/Session plan/Update.jsx';

import SessionPreview from './Components/Pages/AdminPages/one-to-one/Session plan/SessionPreview.jsx';
// import LeadsDashboard from './Components/Pages/AdminPages/one-to-one/LeadsDashboard.jsx';
// import SalesDashboard from './Components/Pages/AdminPages/one-to-one/SalesDashboard.jsx';
import BookingForm from './Components/Pages/AdminPages/one-to-one/Sales/Booking/BookingForm.jsx';
import Leads from './Components/Pages/AdminPages/one-to-one/Sales/Front Pages/Leads.jsx';
import AccountMain from './Components/Pages/AdminPages/one-to-one/Sales/Info/AccountMain.jsx';
import SeeDetailsAccount from './Components/Pages/AdminPages/one-to-one/SeeDetailsAccount.jsx';
import CreateLead from './Components/Pages/AdminPages/Weekly Classes/leads/CreateLead.jsx';
import Lead from './Components/Pages/AdminPages/Weekly Classes/leads/Lead.jsx';
import { LeadsContextProvider } from './Components/Pages/AdminPages/contexts/LeadsContext.jsx';
import AccountInfo from './Components/Pages/AdminPages/Weekly Classes/leads/leadsInfo/AccountInfo.jsx';
import MembersDashboard from './Components/Pages/AdminPages/reports/MembersDashboard.jsx';
import TrialsDashboard from './Components/Pages/AdminPages/reports/TrialsDashboard.jsx';
import SaleDashboard from './Components/Pages/AdminPages/reports/SaleDashboard.jsx';
import CapacityDashboard from './Components/Pages/AdminPages/reports/CapacityDashboard.jsx';
import AttendanceDashboard from './Components/Pages/AdminPages/reports/AttendanceDashboard.jsx';
import CancellationDashboard from './Components/Pages/AdminPages/reports/CancellationDashboard.jsx';
import WeeklyDashboard from './Components/Pages/AdminPages/reports/WeeklyDashboard.jsx';
import Reports from './Components/Pages/AdminPages/one-to-one/Reports.jsx';
import BirthdaySessionPlan from './Components/Pages/AdminPages/Birthday Parties/Session plan/SessionPlan.jsx';
import BirthdaySessionPreview from './Components/Pages/AdminPages/Birthday Parties/Session plan/SessionPreview.jsx';
import BirthdayCreate from './Components/Pages/AdminPages/Birthday Parties/Session plan/Create.jsx';
import BirthdayLeads from './Components/Pages/AdminPages/Birthday Parties/Sales/Front Pages/Leads.jsx';
import BirthdayBookingForm from './Components/Pages/AdminPages/Birthday Parties/Sales/Booking/BookingForm.jsx';
import BirthdayUpdate from './Components/Pages/AdminPages/Birthday Parties/Session plan/Update.jsx';
import BirthdayReports from './Components/Pages/AdminPages/Birthday Parties/Reports.jsx';
import AccountMainBirthDay from './Components/Pages/AdminPages/Birthday Parties/Sales/Info/AccountMainBirthday.jsx';
import SeeDetailsAccountBirthday from './Components/Pages/AdminPages/Birthday Parties/Sales/Info/SeeDetailsAccountBirthday.jsx';

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
  const { checkPermission } = usePermission();

  useEffect(() => {
    const container = document.getElementById("scrollable-content");
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth", // change to "auto" if you don’t want animation
      });
    }
  }, [location.pathname]);
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

      <Route path="/members/list"
        element={renderProtectedRoute(MemberList, [
          { module: "member", action: "view-listing" },
        ])} />

      <Route
        path="/members/update"
        element={renderProtectedRoute(Update, [
          { module: "member", action: "update" },
        ])}
      />
      <Route
        path="/weekly-classes/account-information"
        element={renderProtectedRoute(Account, [{ module: "account-information", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/subscription-planManager"
        element={renderProtectedRoute(SubscriptiontPlanManagerList, [{ module: "payment-plan", action: "view-listing" }, { module: "payment-group", action: "view-listing" }])}
      />

      <Route
        path="/weekly-classes/add-subscription-plan-group"
        element={renderProtectedRoute(AddMembershipPlanGroup, [{ module: "payment-group", action: "create" }])}
      />

      <Route
        path="/notification"
        element={renderProtectedRoute(Notification, [{ module: "notification", action: "view-listing" }])}
      />
      <Route
        path="/notification-list"
        element={renderProtectedRoute(NotificationList, [{ module: "notification", action: "view-listing" }])}
      />
      <Route
        path="/holiday-camps/discounts/list"
        element={renderProtectedRoute(DiscountsList, [{ module: "discount", action: "view-listing" }])}
      />

      <Route
        path="/holiday-camps/discounts/create"
        element={renderProtectedRoute(DiscountCreate, [{ module: "discount", action: "create" }])}
      />

      <Route
        path="/configuration/weekly-classes/venues"
        element={renderProtectedRoute(List, [{ module: "venue", action: "view-listing" }])}
      />

      <Route
        path="/weekly-classes/find-a-class"
        element={renderProtectedRoute(FindAClass, [{ module: "find-class", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/find-a-class/book-a-free-trial"
        element={renderProtectedRoute(BookFreeTrial, [{ module: "book-free-trial", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/find-a-class/add-to-waiting-list"
        element={renderProtectedRoute(AddtoWaitingList, [{ module: "add-waiting-list", action: "create" }])}
      />
      <Route
        path="/weekly-classes/find-a-class/add-to-waiting-list/list"
        element={renderProtectedRoute(WaitingList, [{ module: "add-waiting-list", action: "create" }])}
      />
      <Route
        path="/weekly-classes/find-a-class/book-a-membership"
        element={renderProtectedRoute(BookMembership, [{ module: "book-membership", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/trial/find-a-class/book-a-free-trial/account-info/list"
        element={renderProtectedRoute(AccountInformation, [{ module: "book-free-trial", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/cancellation/account-info/list"
        element={renderProtectedRoute(AccountInfoCancellation, [{ module: "cancellation", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/cancellation"
        element={renderProtectedRoute(CancellationList, [{ module: "cancellation", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/venues/class-schedule"
        element={renderProtectedRoute(ClassSchedule, [{ module: "class-schedule", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/venues/class-schedule/Sessions/viewSessions"
        element={renderProtectedRoute(Pending, [{ module: "class-schedule", action: "view-listing" }])}
      />

      <Route
        path="/configuration/weekly-classes/venues/class-schedule/Sessions/completed"
        element={renderProtectedRoute(Completed, [{ module: "class-schedule", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/venues/class-schedule/Sessions/cancel"
        element={renderProtectedRoute(Cancel, [{ module: "class-schedule", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/term-dates/list"
        element={renderProtectedRoute(TermDateList, [{ module: "term-group", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/term-dates/create"
        element={renderProtectedRoute(TermDateCreate, [{ module: "term-group", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/term-dates/update"
        element={renderProtectedRoute(TermDateUpdate, [{ module: "term-group", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/session-plan-list"
        element={renderProtectedRoute(SessionPlanList, [{ module: "session-plan-group", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/session-plan-preview"
        element={renderProtectedRoute(Preview, [{ module: "session-plan-group", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/session-plan-create"
        element={renderProtectedRoute(SessionPlanCreate, [{ module: "session-plan-group", action: "view-listing" }])}
      />
      <Route
        path="/configuration/weekly-classes/session-plan-preview"
        element={renderProtectedRoute(SessionPlanPreview, [{ module: "session-plan-group", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/trial/list"
        element={renderProtectedRoute(TrialLists, [{ module: "book-free-trial", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/all-members/list"
        element={renderProtectedRoute(AddMembers, [{ module: "book-membership", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/all-members/membership-sales"
        element={renderProtectedRoute(MembershipSales, [{ module: "book-membership", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/all-members/account-info"
        element={renderProtectedRoute(AccountInfoBookMembership, [{ module: "book-membership", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/add-to-waiting-list/account-info"
        element={renderProtectedRoute(AccountInfoWaitingList, [{ module: "waiting-list", action: "view-listing" }])}
      />
      <Route
        path="/test"
        element={renderProtectedRoute(Test)}
      />
      <Route
        path="/weekly-classes/capacity"
        element={renderProtectedRoute(Capacity, [{ module: "capacity", action: "view-listing" }])}
      />
      <Route
        path="/weekly-classes/all-members/see-details"
        element={renderProtectedRoute(SeeDetails, [{ module: "book-membership", action: "view-listing" }])}
      />
      <Route
        path="/KeyInfomation"
        element={renderProtectedRoute(KeyInfomation, [{ module: "key-information", action: "view-listing" }])}
      />
      <Route
        path="/permission"
        element={renderProtectedRoute(PermissionRole, [{ module: "admin-role", action: "view-listing" }])}
      />

      <Route path="/weekly-classes/members-info" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <MainTable />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/weekly-classes/account-information" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Account />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one/reports" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Reports />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Leads />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one/session-plan" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SessionPlan />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one/session-plan-create" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <Create />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one/session-plan-update" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <OnetoOneUpdate />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one/session-plan-preview" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SessionPreview />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/one-to-one/leads/booking-form" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BookingForm />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one/sales/account-information" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AccountMain />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/one-to-one/sales/account-information/see-details" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SeeDetailsAccount />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/weekly-classes/central-leads" element={
        <LeadsContextProvider>

          <ProtectedRoute>
            <AdminLayout>
              <RoleBasedRoute>
                <Lead />
              </RoleBasedRoute>
            </AdminLayout>
          </ProtectedRoute>

        </LeadsContextProvider>
      } />
      <Route path="/weekly-classes/central-leads/create" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <CreateLead />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AccountInfo />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />

      <Route path="/reports/members" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <MembersDashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/trials" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <TrialsDashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/sales" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SaleDashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/class-capacity" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <CapacityDashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/attendance" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AttendanceDashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/cancellations" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <CancellationDashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/weekly-classes/central-leads/accont-info" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AccountInfo />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports/weekly-classes" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <WeeklyDashboard />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />


      {/* birthday  */}
      <Route path="/birthday-party/session-plan" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BirthdaySessionPlan />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/birthday-party/session-plan-preview" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BirthdaySessionPreview />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/birthday-party/session-plan-create" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BirthdayCreate />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
         <Route path="/birthday-party/session-plan-update" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BirthdayUpdate />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/birthday-party/leads" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BirthdayLeads />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
      <Route path="/birthday-party/leads/booking-form" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BirthdayBookingForm />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
         <Route path="/birthday-party/reports" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <BirthdayReports />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
         <Route path="/birthday-party/sales/account-information" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <AccountMainBirthDay />
            </RoleBasedRoute>
          </AdminLayout>
        </ProtectedRoute>
      } />
         <Route path="/birthday-party/sales/account-information/see-details" element={
        <ProtectedRoute>
          <AdminLayout>
            <RoleBasedRoute>
              <SeeDetailsAccountBirthday />
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
        <AccountsInfoProvider>
          <LeadsContextProvider>


            <VenueProvider>
              <MemberProvider>
                <PaymentPlanContextProvider>
                  <DiscountContextProvider>
                    <SessionPlanContextProvider>
                      <TermDatesSessionProvider>
                        <ClassScheduleProvider>
                          <FindClassProvider>
                            <BookFreeTrialProvider>
                              <BookFreeTrialLoaderProvider>
                                <PermissionProvider>
                                  <AppRoutes />
                                </PermissionProvider>
                              </BookFreeTrialLoaderProvider>
                            </BookFreeTrialProvider>
                          </FindClassProvider>
                        </ClassScheduleProvider>
                      </TermDatesSessionProvider>
                    </SessionPlanContextProvider>
                  </DiscountContextProvider>
                </PaymentPlanContextProvider>
              </MemberProvider>
            </VenueProvider>
          </LeadsContextProvider>
        </AccountsInfoProvider>
      </NotificationProvider>
    </Router >
  );
}

export default App;


import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import HeaderBanner from '../Pages/AdminPages/HeaderBanner';
import { useAccountsInfo } from '../Pages/AdminPages/contexts/AccountsInfoContext';



const AdminLayout = ({ children }) => {

  const { historyActiveTab } = useAccountsInfo();
  const routeTitleMap = {
    '/': { title: 'Dashboard', icon: "/demo/synco/members/Category.png" },
    '/admin-forgotpassword': { title: 'One to One', icon: "/demo/synco/members/Category.png" },
    '/merchandise': { title: 'Merchandise', icon: "/demo/synco/members/Category.png" },
    '/email-management': { title: 'Email Management', icon: "/demo/synco/members/Category.png" },
    '/recruitment-reports': { title: 'Recruitment Reports', icon: "/demo/synco/members/Category.png" },
    '/templates': { title: 'Templates', icon: "/demo/synco/members/Category.png" },
    '/synco-chat': { title: 'Synco Chat', icon: "/demo/synco/members/Category.png" },
    '/demo/synco/members/s': { title: 'Admin Panel', icon: "/demo/synco/members/Category.png" },
    '/configuration/weekly-classes/subscription-planManager': { title: 'Subscription Plan Manager', icon: "/demo/synco/images/icons/subscriptionplanIcon.png" },
    '/weekly-classes/add-subscription-plan-group': { title: 'Subscription Plan Manager', icon: "/demo/synco/images/icons/subscriptionplanIcon.png" },
    '/holiday-camps/discounts/list': { title: 'Discounts', icon: "/demo/synco/images/icons/subscriptionplanIcon.png" },
    '/notification': { title: 'Notifications', icon: '/demo/synco/members/Notification.png' },
    '/configuration/weekly-classes/term-dates/list': { title: 'Term Dates & Session Plan Mapping', icon: '/demo/synco/members/termCondition.png' },
    '/weekly-classes/term-dates/Create': { title: 'Term Dates & Session Plan Mapping', icon: '/demo/synco/members/termCondition.png' },
    '/configuration/weekly-classes/venues/class-schedule': { title: 'Class Schedule ', icon: '/demo/synco/members/ClassSchedule.png' },
    '/configuration/weekly-classes/session-plan-list': { title: 'Session Plan Library ', icon: '/demo/synco/members/Document.png' },
    '/configuration/weekly-classes/session-plan-preview': { title: 'Session Plan Library ', icon: '/demo/synco/members/Document.png' },
    '/configuration/weekly-classes/session-plan-create': { title: 'Session Plan Library ', icon: '/demo/synco/members/Document.png' },
    '/configuration/weekly-classes/venues': { title: 'Venues', icon: '/demo/synco/members/Location.png' },
    '/weekly-classes/find-a-class': { title: 'Find a Class', icon: '/demo/synco/members/FindClass.png' },
    '/weekly-classes/find-a-class/book-a-free-trial': { title: 'Book a FREE Trial', icon: '/demo/synco/members/Buy.png' },
    '/weekly-classes/trial/list': { title: 'Trialists', icon: '' },
    '/weekly-classes/all-members/list': { title: 'All Members', icon: '/demo/synco/members/allMembers.png' },
    '/weekly-classes/find-a-class/book-a-membership': { title: 'Book a Membership', icon: '/demo/synco/members/bookMembership.png' },
    '/weekly-classes/trial/find-a-class/book-a-free-trial/account-info/list': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/weekly-classes/all-members/membership-sales': { title: 'Membership Sales', icon: '/demo/synco/members/Profile.png' },
    '/weekly-classes/find-a-class/add-to-waiting-list': { title: 'Add to Waiting List', icon: '/demo/synco/members/waiting.png' },
    '/weekly-classes/find-a-class/add-to-waiting-list/list': { title: ' Waiting List', icon: '/demo/synco/members/waiting.png' },
    '/weekly-classes/capacity': { title: 'Capacity', icon: '/demo/synco/members/Capacity.png' },
    '/weekly-classes/cancellation': { title: 'Cancellations', icon: '/demo/synco/members/Cancellations.png' },
    '/weekly-classes/all-members/account-info': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/permission': { title: 'Permissions', icon: '/demo/synco/members/Profile.png' },
    '/demo/synco/members/List': { title: 'Admin Panel', icon: '/demo/synco/members/Category.png' },
    '/demo/synco/members/update': { title: 'Admin Panel', icon: '/demo/synco/members/Category.png' },
    '/KeyInfomation': { title: 'Key Information', icon: '/demo/synco/members/Category.png' },
    '/weekly-classes/cancellation/account-info/list': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/weekly-classes/term-dates/create': { title: 'Term Dates & Session Plan Mapping', icon: '/demo/synco/members/termCondition.png' },
    '/weekly-classes/account-information': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/weekly-classes/members-info': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/weekly-classes/cancellation/account-info/': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/weekly-classes/add-to-waiting-list': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/one-to-one': { title: 'One to One ', icon: '/demo/synco/members/Profile.png' },
    '/one-to-one/reports': { title: 'One to One Reports', icon: '/demo/synco/members/Profile.png' },
    '/one-to-one?tab=Leads': { title: 'One to One Leads', icon: '/demo/synco/members/Profile.png' },
    '/one-to-one?tab=Sales': { title: 'One to One Sales', icon: '/demo/synco/members/Profile.png' },
    '/reports/members': { title: 'Members ', icon: '/demo/synco/reportsIcons/report.png' },
    '/reports/trials': { title: 'Trials and conversions ', icon: '/demo/synco/reportsIcons/report.png' },
    '/reports/sales': { title: 'Sales', icon: '/demo/synco/reportsIcons/report.png' },
    '/reports/class-capacity': { title: 'Class Capacity', icon: '/demo/synco/reportsIcons/report.png' },
    '/reports/attendance': { title: 'Student Attendance', icon: '/demo/synco/reportsIcons/report.png' },
    '/reports/cancellations': { title: 'Cancellations', icon: '/demo/synco/reportsIcons/report.png' },
    '/reports/weekly-classes': { title: 'Parent Feedback', icon: '/demo/synco/reportsIcons/report.png' },
    '/one-to-one/session-plan-preview': { title: 'One to One Session Plans  ', icon: '/demo/synco/members/Document.png' },
    '/one-to-one/session-plan': { title: 'One to One Session Plans  ', icon: '/demo/synco/members/Document.png' },
    '/weekly-classes/central-leads': { title: 'Lead Database', icon: '/demo/synco/members/leadsicon.png' },
    '/weekly-classes/central-leads/create': { title: 'Add a New Lead', icon: '/demo/synco/members/leadsicon.png' },
    '/weekly-classes/central-leads/accont-info': { title: 'Account information', icon: '/demo/synco/members/Profile.png' },
    '/birthday-party/session-plan': { title: 'Birthday Party Session Plans  ', icon: '/demo/synco/members/Document.png' },
    '/birthday-party/leads': { title: 'Birthday Party ', icon: '/demo/synco/members/BirthdayIcon.png' },
    '/birthday-party/reports': { title: 'Birthday Party Reports ', icon: '/demo/synco/members/BirthdayIcon.png' },
    '/one-to-one/leads/booking-form': { title: 'Book a One to One Package ', icon: '/demo/synco/members/bookMembership.png' },
    '/one-to-one/sales/account-information': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/birthday-party/leads/booking-form': { title: 'Book a Birthday Party ', icon: '/demo/synco/members/BirthdayIcon.png' },
    '/birthday-party/sales/account-information': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
    '/holiday-camp/reports': { title: 'Holiday Camps Report', icon: '/demo/synco/members/Profile.png' },
    
    '/configuration/holiday-camp/venues': { title: 'Holiday Camp Venues ', icon: '/demo/synco/members/Location.png' },
    '/configuration/holiday-camp/venues/class-schedule': { title: 'Class Schedule', icon: '/demo/synco/members/ClassSchedule.png' },
    '/configuration/holiday-camp/terms': { title: 'Holiday Camp Dates & Session Plan Mapping', icon: '/demo/synco/members/termCondition.png' },
    '/configuration/holiday-camp/session-plan': { title: 'Session Plan Library', icon: '/demo/synco/members/Document.png' },
    '/configuration/holiday-camp/subscription-plan-group': { title: 'Payment Plan Manager', icon: '/demo/synco/images/icons/subscriptionplanIcon.png' },
    '/configuration/holiday-camp/discount': { title: 'Discounts', icon: '/demo/synco/images/icons/subscriptionplanIcon.png' },
    '/holiday-camp/find-a-camp': { title: 'Find a Holiday Camp', icon: '/demo/synco/images/icons/subscriptionplanIcon.png' },
    '/holiday-camp/find-a-camp/book-camp': { title: 'Book a Holiday Camp', icon: '/demo/synco/members/bookMembership.png' },
    '/templates/create': { title: 'Communication Templates', icon: "/demo/synco/members/Notification.png" },
    '/templates/list': { title: 'Text/Email Communications', icon: "/demo/synco/members/Notification.png" },
    '/templates/settingList': { title: 'Communication Templates', icon: "/demo/synco/members/Notification.png" },
    '/administration/file-manager': { title: 'Folders/Assets', icon: "/demo/synco/members/Category.png" },
    '/recruitment/lead': { title: 'Recruitment', icon: "/demo/synco/members/recruitment.png" },

  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const [profileOpen, setProfileOpen] = useState(false);


  const location = useLocation();
  const fullPath = location.pathname + location.search;

  // find best match
  let routeInfo =
    Object.entries(routeTitleMap)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([route]) => fullPath.startsWith(route))?.[1]
    || { title: 'Admin Panel', icon: '/demo/synco/members/Category.png' };

  // 🔥 override if historyActiveTab condition is met
  if (historyActiveTab === "History Of Payments") {
    routeInfo = {
      title: "History Payments",
      icon: '/demo/synco/images/icons/Wallet.png'
    };
  }

  const { title, icon: Icon } = routeInfo;
  return (
    <div className="mainLayout flex overflow-hidden max-h-[100vh] overflow-y-auto">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 w-full flex flex-col px-6 bg-gray-50 md:w-10/12 fixerhe">
        <Header
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <div className="overflow-y-auto scrollbar-hide" id='scrollable-content'>
          {!['/', '/holiday-camps/discounts/create'].includes(location.pathname) && (
            <HeaderBanner title={title} icon={Icon} />
          )}

          <main className="flex-1  py-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

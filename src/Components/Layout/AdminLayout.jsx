import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import HeaderBanner from '../Pages/AdminPages/HeaderBanner';

const routeTitleMap = {
  '/': { title: 'Dashboard', icon: "/demo/synco/members/Category.png" },
  '/admin-forgotpassword': { title: 'One to One', icon: "/demo/synco/members/Category.png" },
  '/merchandise': { title: 'Merchandise', icon: "/demo/synco/members/Category.png" },
  '/email-management': { title: 'Email Management', icon: "/demo/synco/members/Category.png" },
  '/recruitment-reports': { title: 'Recruitment Reports', icon: "/demo/synco/members/Category.png" },
  '/templates': { title: 'Templates', icon: "/demo/synco/members/Category.png" },
  '/synco-chat': { title: 'Synco Chat', icon: "/demo/synco/members/Category.png" },
  '/members': { title: 'Admin Panel', icon: "/demo/synco/members/Category.png" },
  '/configuration/weekly-classes/subscription-planManager': { title: 'Subscription Plan Manager', icon: "/demo/synco/icons/subscriptionplanIcon.png" },
  '/configuration/weekly-classes/add-subscription-plan-group': { title: 'Subscription Plan Manager', icon: "/demo/synco/icons/subscriptionplanIcon.png" },
  '/configuration/holiday-camps/discounts/list': { title: 'Discounts', icon: "/demo/synco/icons/subscriptionplanIcon.png" },
  '/notification': { title: 'Notifications', icon: '/demo/synco/members/Notification.png' },
  '/configuration/weekly-classes/term-dates/list': { title: 'Term Dates & Session Plan Mapping', icon: '/demo/synco/members/termCondition.png' },
  '/configuration/weekly-classes/term-dates/Create': { title: 'Term Dates & Session Plan Mapping', icon: '/demo/synco/members/termCondition.png' },
  '/configuration/weekly-classes/venues/class-schedule': { title: 'Class Schedule ', icon: '/demo/synco/members/ClassSchedule.png' },
  '/configuration/weekly-classes/session-plan-list': { title: 'Session Plan Library ', icon: '/demo/synco/members/Document.png' },
  '/configuration/weekly-classes/session-plan-preview': { title: 'Session Plan Library ', icon: '/demo/synco/members/Document.png' },
  '/configuration/weekly-classes/session-plan-create': { title: 'Session Plan Library ', icon: '/demo/synco/members/Document.png' },
  '/configuration/weekly-classes/venues': { title: 'Venues', icon: '/demo/synco/members/Location.png' },
  '/configuration/weekly-classes/find-a-class': { title: 'Find a Class', icon: '/demo/synco/members/FindClass.png' },
  '/configuration/weekly-classes/find-a-class/book-a-free-trial': { title: 'Book a FREE Trial', icon: '/demo/synco/members/Buy.png' },
  '/configuration/weekly-classes/trial/list': { title: 'Triallists', icon: '' },
  '/configuration/weekly-classes/all-members/list': { title: 'All Members', icon: '/demo/synco/members/allMembers.png' },
  '/configuration/weekly-classes/find-a-class/book-a-membership': { title: 'Book a Membership', icon: '/demo/synco/members/bookMembership.png' },
  '/configuration/weekly-classes/find-a-class/book-a-free-trial/account-info/list': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
  '/configuration/weekly-classes/all-members/membership-sales': { title: 'Membership Sales', icon: '/demo/synco/members/Profile.png' },
  '/configuration/weekly-classes/find-a-class/add-to-waiting-list': { title: 'Add to Waiting List', icon: '/demo/synco/members/waiting.png' },
  '/configuration/weekly-classes/find-a-class/add-to-waiting-list/list': { title: ' Waiting List', icon: '/demo/synco/members/waiting.png' },
  '/configuration/weekly-classes/capacity': { title: 'Capacity', icon: '/demo/synco/members/Capacity.png' },
  '/configuration/weekly-classes/cancellation': { title: 'Cancellations', icon: '/demo/synco/members/Cancellations.png' },
  '/configuration/weekly-classes/all-members/account-info': { title: 'Account Information', icon: '/demo/synco/members/Profile.png' },
  '/permission': { title: 'Permissions ', icon: '/demo/synco/members/Profile.png' },

};

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const [profileOpen, setProfileOpen] = useState(false);

  const routeInfo =
    Object.entries(routeTitleMap)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([route]) => location.pathname.startsWith(route))?.[1]
    || { title: 'Admin Panel', icon: '/demo/synco/members/Category.png' };
      const { title, icon: Icon } = routeInfo;

  return (
    <div className="flex">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 w-full flex flex-col px-6 bg-gray-50 md:w-10/12 fixerhe">
        <Header
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
<div className="overflow-y-auto scrollbar-hide">
  {!['/', '/configuration/holiday-camps/discounts/create'].includes(location.pathname) && (
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

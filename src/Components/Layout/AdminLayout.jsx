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
  '/holiday-camps/payment-planManager': { title: 'Payment Plan Manager', icon: "/demo/synco/members/Category.png" },
  '/holiday-camps/add-payment-plan-group': { title: 'Add Payment Plan Group', icon: "/demo/synco/members/Category.png" },
  '/holiday-camps/discounts/list': { title: 'Discounts', icon: "/demo/synco/members/Category.png" },
  '/notification': { title: 'Notifications', icon: '/demo/synco/members/Notification.png' },
  '/weekly-classes/term-dates/list': { title: 'Term Dates & Session Plan Mapping', icon: '/demo/synco/members/Category.png' },
  '/weekly-classes/term-dates/create': { title: 'Term Dates & Session Plan Mapping', icon: '/demo/synco/members/Category.png' },
  '/weekly-classes/venues/class-schedule': { title: 'Class Schedule ', icon: '/demo/synco/members/Category.png' },
  '/holiday-camps/session-plan-list': { title: 'Session Plan Library ', icon: '/demo/synco/members/Document.png' },
  '/weekly-classes/venues': { title: 'Venues', icon: '/demo/synco/members/Category.png' },

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
      <div className="flex-1 w-full flex flex-col px-6 bg-gray-50 md:w-10/12">
        <Header
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

  {!['/', '/holiday-camps/discounts/create'].includes(location.pathname) && (
          <HeaderBanner title={title} icon={Icon} />
        )}

        <main className="flex-1 overflow-y-auto py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

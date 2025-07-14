import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import HeaderBanner from '../Pages/AdminPages/HeaderBanner';

const routeTitleMap = {
  '/': { title: 'Dashboard', icon: "/members/Category.png" },
  '/admin-forgotpassword': { title: 'One to One', icon: "/members/Category.png" },
  '/merchandise': { title: 'Merchandise', icon: "/members/Category.png" },
  '/email-management': { title: 'Email Management', icon: "/members/Category.png" },
  '/recruitment-reports': { title: 'Recruitment Reports', icon: "/members/Category.png" },
  '/templates': { title: 'Templates', icon: "/members/Category.png" },
  '/synco-chat': { title: 'Synco Chat', icon: "/members/Category.png" },
  '/members': { title: 'Admin Panel', icon: "/members/Category.png" },
  '/holiday-camps/payment-planManager': { title: 'Payment Plan Manager', icon: "/members/Category.png" },
  '/holiday-camps/add-payment-plan-group': { title: 'Add Payment Plan Group', icon: "/members/Category.png" },
  '/discounts/list': { title: 'Discounts', icon: "/members/Category.png" },
  '/notification': { title: 'Notifications', icon: '/members/Notification.png' },
  '/weekly-classes/term-dates/list': { title: 'Term Dates & Session Plan Mapping', icon: '/members/Category.png' },
  '/weekly-classes/term-dates/create': { title: 'Term Dates & Session Plan Mapping', icon: '/members/Category.png' },
  '/weekly-classes/venues/class-schedule': { title: 'Class Schedule ', icon: '/members/Category.png' },

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
    || { title: 'Admin Panel', icon: '/members/Category.png' };
      const { title, icon: Icon } = routeInfo;

  return (
    <div className="flex">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 w-full flex flex-col px-6 bg-gray-50">
        <Header
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

  {!['/', '/discounts/create'].includes(location.pathname) && (
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

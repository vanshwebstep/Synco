import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import HeaderBanner from '../Pages/AdminPages/HeaderBanner';
    const routeTitleMap = {
  '/': 'Dashboard',
  '/admin-forgotpassword': 'One to One',
  '/merchandise': 'Merchandise',
  '/email-management': 'Email Management',
  '/recruitment-reports': 'Recruitment Reports',
  '/templates': 'Templates',
  '/synco-chat': 'Synco Chat',
  '/members':'Admin Panel',
  '/holiday-camps/payment-planManager':'Payment Plann',
  '/holiday-camps/add-payment-plan-group':'Payment Plansn',
  '/discounts/list':'Discounts',

  // Add more as needed
};
const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const [profileOpen, setProfileOpen] = useState(false);
const pageTitle = routeTitleMap[location.pathname] || 'Admin Panel';
console.log('routeTitleMap',routeTitleMap)
  return (
    <div className="flex ">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 w-full flex flex-col px-6 bg-gray-50">
        <Header
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        {/* ✅ Only show HeaderBanner if NOT on "/" */}
{location.pathname !== '/' && (
  <HeaderBanner title={routeTitleMap[location.pathname] || 'Admin Panel'} />
)}
        <main className="flex-1 overflow-y-auto py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import HeaderBanner from '../Pages/AdminPages/HeaderBanner';

const AdminLayout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex h-screen">
          <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col px-6 bg-gray-50">
        <Header profileOpen={profileOpen} setProfileOpen={setProfileOpen} 
           toggleMobileMenu={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}/>
             <HeaderBanner/>
        <main className="flex-1 overflow-y-auto  py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

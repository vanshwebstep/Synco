import React, { useEffect, useState, useRef } from 'react';
import { Menu, X, Search, Bell, ChevronUp, ChevronDown } from 'lucide-react';
import { useNotification } from '../Pages/AdminPages/contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Header = ({ profileOpen, setProfileOpen, toggleMobileMenu, isMobileMenuOpen }) => {
  const isFetchingRef = useRef(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [showNotificationPopup, setShowNotificationPopup] = useState(null);
  const { notification, setNotification, fetchNotification } = useNotification();
  const currentDate = new Date();
  const [adminInfo, setAdminInfo] = useState({ firstName: "", lastName: "", role: "", profile: "" });

  const month = currentDate.toLocaleString("default", { month: "long" }); // e.g., January
  const day = currentDate.getDate(); // e.g., 8
  const weekday = currentDate.toLocaleString("default", { weekday: "long" }); // e.g., Monday
  const year = currentDate.getFullYear(); // e.g., 2024
  //
  const unreadNotifications = notification.filter(n => !n.isRead);
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminInfo");
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdminInfo(parsedAdmin);
      } catch (e) {
        console.error("Invalid adminInfo JSON in localStorage:", e);
      }
    }
  }, []);

  const notificationCount = unreadNotifications.length;
  const latestUnread = unreadNotifications[0]; // Show the most recent unread
  const navigate = useNavigate();

  const routeTitleMap = {
    '': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'admin-forgotpassword': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'merchandise': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'email-management': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'recruitment-reports': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'templates': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'weekly-classes': { title: 'Configuration', },
    'configuration/weekly-classes/find-a-class/': { title: 'Weekly Classes', },
    'synco-chat': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'members': { title: 'Admin Panel' },
    'holiday-camps/payment-planManager': { title: 'Configuration' },
    'holiday-camps/add-subscription-plan-group': { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' },
    'holiday-camps/discounts': { title: 'Discounts' },
    'holiday-camps/session-plan': { title: 'Configuration', },
    'notification': { title: 'Notification' },
    'configuration/weekly-classes/all-members': { title: 'Members' },
    'configuration/weekly-classes/find-a-class/book-a-free-trial/account-info': { title: 'Account Information' },
    
  };
  // Extract the part after `/demo/synco/`
  const subPath = location.pathname.split('/demo/synco/')[1] || '';

  // Match the longest route
  const routeInfo =
    Object.entries(routeTitleMap)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([route]) => subPath.startsWith(route))?.[1]
    || { title: 'Welcome Back', icon: '/demo/synco/images/Welcomeback.png' };

  const { title, icon: Icon } = routeInfo;


  useEffect(() => {
    const fetchAndMerge = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      const success = await fetchNotification();

      isFetchingRef.current = false;
    };

    fetchAndMerge();
    const interval = setInterval(fetchAndMerge, 7000);

    return () => clearInterval(interval);
  }, [fetchNotification]);



  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/admin-login"); // redirect to dashboard (adjust route if needed)
      }
    });
  };
  const handleNotificationClick = () => {
    if (notificationCount > 0) {
      setShowNotificationPopup((prev) => !prev);
    } else {
      navigate('/notification');
    }
  };
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowNotificationPopup(false);
      }
    }

    if (showNotificationPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationPopup, setShowNotificationPopup]);
    const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <>
      {/* HEADER */}
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-4  bg-gray-50  gap-4 lg:gap-0">

        {/* Desktop LEFT: Greeting + Welcome */}
        <div className="hidden lg:block">
          <span className="font-semibold text-[22px] sm:text-[24px] lg:text-[26px]">Hi {adminInfo?.firstName}!</span>
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold flex gap-2 items-center whitespace-nowrap">
            {title || 'Configuration'}
            {Icon && <img src={Icon} alt="Welcome" className="w-8 h-8 sm:w-10 sm:h-10" />}
          </h2>

        </div>

        {/* Mobile: Top Row (Menu - WelcomeImg - Profile) */}
        <div className="flex w-full justify-between items-center lg:hidden">
          {/* Mobile Menu Toggle */}
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Welcome Image Centered */}
          <img src='/demo/synco/images/synco-text.png' alt="Welcome" className="w-25 h-10" />

          {/* Profile Image */}
          <div className="relative">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                <img src='{/demo/synco/images/demoprofile.png}' alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-md rounded-md border z-20">
                <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">My Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Settings</li>
                  <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Desktop RIGHT Side Items */}
        <div className="hidden relative lg:flex flex-col sm:flex-row items-start sm:items-center md:gap-10 sm:gap-6 w-full lg:w-auto">

          {/* Search Bar */}
          <div className="relative w-full sm:w-[280px] lg:w-[200px] xl:w-[250px] 2xl:w-[400px]">
            <input
              type="search"
              className="w-full px-4 py-3 pl-10 border border-[#E2E1E5] rounded-lg bg-white text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
            />
            <img src="/demo/synco/icons/search.png" className="absolute right-3 top-1/2 left-2 max-w-[10px] transform -translate-y-1/2 text-black" alt="" />

          </div>

          {/* Notification Bell */}
          <div
            onClick={handleNotificationClick}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer
      ${notificationCount > 0 ? "bg-[#FF5A3C] text-white" : "bg-white border border-[#E2E1E5]"}`}
          >
            <img src="/demo/synco/DashboardIcons/notificationIcon.png" alt="" />


            {/* Notification Badge */}
            {notificationCount > 0 && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-black text-sm font-semibold flex items-center justify-center shadow-md">
                {notificationCount}
              </span>
            )}
          </div>

          {/* Notification Popup */}
          {showNotificationPopup && notificationCount > 0 && latestUnread && (
            <div
              ref={popupRef}
              className="md:max-w-[450px] absolute top-14 right-0 bg-white rounded-2xl shadow-sm p-6 z-10"
            >
              <h3 className="text-red-500 font-semibold text-[18px] mb-1">
                {latestUnread.title}
              </h3>
              <p className="text-[16px] font-semibold text-black">
                {latestUnread.description}
              </p>
              <a
                href="/demo/synco/notification"
                className="text-[#237FEA] text-[16px] font-semibold mt-2 inline-block underline"
              >
                See more
              </a>
            </div>
          )}

          {/* Date + Profile */}
          <div className="flex items-start sm:items-center justify-between w-full sm:w-auto">
            {/* Date */}
            <div className="block text-sm text-gray-600 border-r border-gray-300 pr-4 mr-4">
              <span className="block text-base text-gray-800 font-semibold">{month}</span>
              <span className="font-semibold text-gray-600">
                {day} {weekday} {year}
              </span>
            </div>

            {/* Profile Info + Dropdown */}
            <div className="relative">
              <div
                className="profile mt-1 sm:mt-2 flex items-center gap-3 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="profileimg w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                  <img
                    src={
                      adminInfo?.profile
                        ? `${API_BASE_URL}/${adminInfo.profile}`
                        : '/demo/synco/SidebarLogos/OneTOOne.png'
                    }
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="block text-start">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-semibold leading-[1px]">
                      {adminInfo?.firstName}
                    </span>
                    {profileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                  <span className="text-sm text-gray-600 font-semibold">{adminInfo?.role}</span>
                </div>
              </div>

              {profileOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-10"
                >
                  <ul className="text-sm text-gray-700 divide-y divide-gray-100">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">My Profile</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Settings</li>
                    <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH BAR: Only for mobile (below header) */}
      <div className="block lg:hidden px-4 sm:px-6 py-3 bg-gray-50 border-b">
        <div className="relative w-full">
          <input
            type="search"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        </div>
      </div>

    </>


  );
};

export default Header;

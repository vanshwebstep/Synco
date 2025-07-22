import React, { useState ,useEffect,useRef } from 'react';
import {
  LayoutGrid, Package, Truck, User, ChevronDown, ChevronUp, ChevronRight, MessageCircle, FileText, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const commonRole = ['Admin', 'user', 'Member', 'Agent', 'Super Admin'];
const menuItems = [
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
      { title: 'Find a class', link: '/weekly-classes/find-a-class', role: commonRole },
      { title: 'Venues', link: '/weekly-classes/venues', role: commonRole },
      { title: 'Class Schedule', link: '/weekly-classes/venues/class-schedule', role: commonRole },
      { title: 'Term Dates & Session Plan mapping', link: '/weekly-classes/term-dates/list', role: commonRole },
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
    role: commonRole,
    subItems: [
      { title: 'Session Plan Library', link: '/holiday-camps/session-plan-list', role: commonRole },
      { title: 'Payment Plan Manager', link: '/holiday-camps/payment-planManager', role: commonRole },
      { title: 'Discounts', link: '/holiday-camps/discounts/list', role: commonRole }
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





const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
const sidebarRef = useRef();

  const toggleDropdown = (title) => {
    setOpenDropdowns((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const renderMenuItems = (items, level = 0) => {
    const location = useLocation(); // hook inside render so it's scoped
    const MyRole = localStorage.getItem("role");
  
    const filteredItems = items.filter((item) => {
      // If no role specified on item → show it
      if (!item.role) return true;
      // If role array includes MyRole → show it
      return item.role.includes(MyRole);
    });

   return (
  <ul
    className={`${level === 0 ? 'px-4' : 'pl-10'} ${
      level === 2 ? 'list-disc' : 'list-none'
    } space-y-1`}
  >
    {filteredItems.map((item) => {
      const hasSubItems = Array.isArray(item.subItems);
      const hasInnerSubItems = Array.isArray(item.innerSubItems);
      const itemTitle = typeof item === 'string' ? item : item.title;

      const isActive = item.link && location.pathname === item.link;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

      const content = (
        <motion.div
          initial={false}
          onClick={() => {
            if (hasSubItems || hasInnerSubItems) {
              toggleDropdown(itemTitle);
            } else if (isMobile) {
              setIsMobileMenuOpen(false);
            }
          }}
          onMouseEnter={() => setHoveredItem(itemTitle)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`flex items-center justify-between font-semibold cursor-pointer px-4 py-2 rounded-lg transition-all duration-100
            ${
              level === 0
                ? isActive
                  ? 'bg-blue-500 text-white'
                  : ' hover:bg-blue-500 hover:text-white text-black'
                : isActive
                ? 'text-blue-600 font-bold'
                : 'hover:text-blue-600'
            } ${
                  (hoveredItem === itemTitle || isActive) && isMobile
                    ? 'bg-blue-500  text-white'
                    : ''
                }`}
        >
          <span className={`flex items-center gap-3 transition-all duration-100 `}>
            {item.icon && level === 0 && (
              <span
                className={`w-8 h-8 flex items-center justify-center rounded `}
              >
                <motion.img
                  src={
                    hoveredItem === itemTitle || isActive
                      ? item.iconHover
                      : item.icon
                  }
                  alt={itemTitle}
                  className="w-6 h-6 drop-shadow-sm"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                />
              </span>
            )}
            <span>{itemTitle}</span>
          </span>

          {level === 0 && hasSubItems &&
            (openDropdowns[itemTitle] ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}

          {level === 1 && hasInnerSubItems && <span className="ml-2 text-sm">-</span>}
        </motion.div>
      );

      return (
        <li className="mb-2 text-lg" key={itemTitle}>
          {item.link ? <Link to={item.link}>{content}</Link> : content}

          <AnimatePresence initial={false}>
            {(hasSubItems || hasInnerSubItems) && openDropdowns[itemTitle] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {hasSubItems && renderMenuItems(item.subItems, level + 1)}
                {hasInnerSubItems && renderMenuItems(item.innerSubItems, level + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      );
    })}
  </ul>
);

  };
useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);
  return (
    <>


      {/* Mobile Drawer */}
      {/* Mobile Drawer */}
<AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Optional semi-transparent overlay */}
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" />

          <motion.aside
            ref={sidebarRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg border-r lg:hidden flex flex-col"
          >
            <div className="p-6 font-semibold text-2xl text-center flex items-center justify-center">
              <img
                src="/demo/synco/images/synco-text.png"
                alt="Logo"
                className="h-10 w-auto object-contain"
              />
            </div>

            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 px-2 pb-6">
              {renderMenuItems(menuItems)}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>


      {/* Desktop Sidebar */}
      <aside className="hidden md:w-2/12 lg:flex w-72 h-screen bg-white border-r border-gray-100 flex-col shadow-lg">
        <div className="p-6 font-semibold text-2xl text-center flex items-center justify-center">
          <img src='/demo/synco/images/synco-text.png' alt="Logo" className="h-10 w-auto object-contain" />
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
          {renderMenuItems(menuItems)}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

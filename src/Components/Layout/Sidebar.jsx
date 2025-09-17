import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid, Package, Truck, User, ChevronDown, ChevronUp, ChevronRight, MessageCircle, FileText, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { usePermission } from "../Pages/AdminPages/Common/permission";
import { useMembers } from '../Pages/AdminPages/contexts/MemberContext';



const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const sidebarRef = useRef();
  const { checkPermission } = usePermission();

  const menuItemsRaw = [
    {
      title: 'Dashboard',
      icon: '/demo/synco/SidebarLogos/Dashboard.png',
      iconHover: '/demo/synco/SidebarLogos/DashboardH.png',
      link: '/',
    },
    {
      title: 'Configuration',
      icon: '/demo/synco/SidebarLogos/config.png',
      iconHover: '/demo/synco/SidebarLogos/configH.png',
      needPermissions: [{ module: 'term-group', action: 'view-listing' }, { module: 'term-group', action: 'create' }, { module: 'venue', action: 'view-listing' }, { module: 'book-membership', action: 'view-listing' }, { module: 'book-free-trial', action: 'view-listing' }, { module: 'find-class', action: 'view-listing' }, { module: 'payment-group', action: 'view-listing' }, { module: 'session-plan-group', action: 'view-listing' }, { module: 'discount', action: 'view-listing' }, { module: 'discount', action: 'create' }, { module: 'member', action: 'view-listing' }],
      subItems: [
        {
          title: 'Weekly Classes',
          icon: '/demo/synco/SidebarLogos/WeeklyClasses.png',
          iconHover: '/demo/synco/SidebarLogos/WeeklyClassesH.png',
          needPermissions: [{ module: 'term-group', action: 'view-listing' }, { module: 'term-group', action: 'create' }, { module: 'venue', action: 'view-listing' }, { module: 'book-membership', action: 'view-listing' }, { module: 'book-free-trial', action: 'view-listing' }, { module: 'find-class', action: 'view-listing' }, { module: 'payment-group', action: 'view-listing' }, { module: 'session-plan-group', action: 'view-listing' }],
          subItems: [
            { title: 'Cancellation', link: '/configuration/weekly-classes/cancellation', needPermissions: [{ module: 'cancellation', action: 'view-listing' }], },
            { title: 'Capacity', link: '/configuration/weekly-classes/capacity', needPermissions: [{ module: 'capacity', action: 'view-listing' }], },
            { title: 'Session Plan Library', link: '/configuration/weekly-classes/session-plan-list', needPermissions: [{ module: 'session-plan-group', action: 'view-listing' }] },
            { title: 'Subscription Plan Manager', link: '/configuration/weekly-classes/subscription-planManager', needPermissions: [{ module: 'payment-group', action: 'view-listing' }] },
            { title: 'Find a class', link: '/configuration/weekly-classes/find-a-class', needPermissions: [{ module: 'find-class', action: 'view-listing' }] },
            { title: 'Trials', link: '/configuration/weekly-classes/trial/list', needPermissions: [{ module: 'book-free-trial', action: 'view-listing' }] },
            { title: 'All Members', link: '/configuration/weekly-classes/all-members/list', needPermissions: [{ module: 'book-membership', action: 'view-listing' }] },
            { title: 'Membership Sales', link: '/configuration/weekly-classes/all-members/membership-sales', needPermissions: [{ module: 'book-membership', action: 'view-listing' }] },
            { title: 'Venues', link: '/configuration/weekly-classes/venues', needPermissions: [{ module: 'venue', action: 'view-listing' }, { module: 'venue', action: 'create' }] },
            { title: 'Waiting List', link: '/configuration/weekly-classes/find-a-class/add-to-waiting-list/list', needPermissions: [{ module: 'waiting-list', action: 'view-listing' }] },
            { title: 'Term Dates & Session Plan mapping', link: '/configuration/weekly-classes/term-dates/list', needPermissions: [{ module: 'term-group', action: 'view-listing' }, { module: 'term', action: 'view-listing' }], }
          ]
        },
        {
          title: 'Holiday Camps',
          icon: '/demo/synco/SidebarLogos/Holiday.png',
          iconHover: '/demo/synco/SidebarLogos/HolidayH.png',
          needPermissions: [{ module: 'discount', action: 'view-listing' }, { module: 'discount', action: 'create' }],
          subItems: [
            { title: 'Discounts', link: '/configuration/holiday-camps/discounts/list', needPermissions: [{ module: 'discount', action: 'view-listing' }, { module: 'discount', action: 'create' }] }
          ]
        },
        {
          title: 'Administration',
          icon: '/demo/synco/SidebarLogos/Admistration.png',
          iconHover: '/demo/synco/SidebarLogos/AdmistrationH.png',
          needPermissions: [{ module: 'member', action: 'view-listing' }],
          subItems: [
            { title: 'Admin Panel', link: '/configuration/members/List', needPermissions: [{ module: 'member', action: 'view-listing' }] }
          ]
        }
      ]
    },
    {
      title: 'Permission',
      icon: '/demo/synco/SidebarLogos/Dashboard.png',
      iconHover: '/demo/synco/SidebarLogos/DashboardH.png',
      link: '/permission',
      needPermissions: [{ module: 'admin-role', action: 'view-listing' }, { module: 'admin-role', action: 'create' }]
    },
  ];

  let menuItems = [];

  menuItemsRaw.forEach(menuItem => {
    // console.log("Checking Menu Item:", menuItem.title);

    let isMenuGranted = false;


    if (!menuItem.needPermissions) {
      // console.log("-> No permissions needed for this menu.");
      isMenuGranted = true;
    } else {
      // console.log(`-> Checkings required permissions for this menu (${menuItem.title})...`);
      menuItem.needPermissions.forEach(permission => {
        if (checkPermission(permission)) {
          // console.log(`--> Permission denied:`, permission);
          isMenuGranted = true;
        } else {
          // console.log(`--> Permission denied:`, permission);
        }
      });
    }

    // Step 2: If main menu is allowed, check sub-items
    if (isMenuGranted && menuItem.subItems && menuItem.subItems.length) {
      // console.log("-> Checking sub-items...");
      let validSubs = [];

      menuItem.subItems.forEach(sub => {
        // console.log("   Checking Sub-Item:", sub.title);

        let isSubGranted = false;
        let isChildPermissionGranted = false;

        // Step 2.1: Check permissions for sub-item
        if (!sub.needPermissions) {
          // console.log("   -> No permissions needed for this sub-item.");
          isSubGranted = true;
        } else {
          // console.log(`   -> Checking required permissions for this sub-item (${sub.title})...`);
          sub.needPermissions.forEach(permission => {
            if (checkPermission(permission)) {
              // console.log(`   --> Sub-item permission granted: ${permission}`);
              isSubGranted = true;
            } else {
              // console.log(`   --> Sub-item permission denied: ${permission}`);
            }
          });
        }

        // Step 2.2: Check children of sub-item
        if (sub.subItems && sub.subItems.length) {
          // console.log("   -> Checking children of sub-item...");
          let validChildren = [];

          sub.subItems.forEach(child => {
            // console.log("      Checking Child Item:", child.title);

            let isChildGranted = false;

            if (!child.needPermissions) {
              // console.log("      -> No permissions needed for this child.");
              isChildGranted = true;
            } else {
              // console.log("      -> Checking required permissions for this child...");
              child.needPermissions.forEach(permission => {
                if (checkPermission(permission)) {
                  // console.log(`      --> Child permission granted: ${permission}`);
                  isChildGranted = true;
                } else {
                  // console.log(`      --> Child permission denied: ${permission}`);
                }
              });
            }

            if (isChildGranted) {
              // console.log("      => Child granted access and added.");
              validChildren.push(child);
              isChildPermissionGranted = true;
            } else {
              // console.log("      => Child denied access and skipped.");
            }
          });

          sub.subItems = validChildren;
        }

        // Step 2.3: Decide if sub-item should be added
        if (isSubGranted || isChildPermissionGranted) {
          // console.log("   => Sub-item granted access and added.");
          validSubs.push(sub);
        } else {
          // console.log("   => Sub-item denied access and skipped.");
        }
      });

      menuItem.subItems = validSubs;
    }

    // Step 3: Add the menu item if granted or if any sub-items remain
    if (isMenuGranted) {
      // console.log(`=> (${menuItem.title}) Menu item granted access and added to final list.\n`);
      menuItems.push(menuItem);
    } else {
      // console.log("=> Menu item denied access and skipped.\n");
    }
  });


  const toggleDropdown = (title) => {
    setOpenDropdowns((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };
  const renderMenuItems = (items, level = 0) => {
    const location = useLocation(); // hook inside render so it's scoped
    // console.log('localSgtorage', localStorage)

    return (
      <ul
        className={`${level === 0 ? 'px-4' : 'pl-10'} ${level === 2 ? 'list-disc' : 'list-none'
          } space-y-1`}
      >
        {items.map((item) => {
          const hasSubItems = Array.isArray(item.subItems);
          const hasInnerSubItems = Array.isArray(item.innerSubItems);
          const itemTitle = typeof item === 'string' ? item : item.title;

          const isActive = item.link && location.pathname === item.link;
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
          // console.log('item.link', item.link)
          // console.log('pathname.link', location.pathname)
          // console.log('itemTitle', itemTitle)
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
            ${level === 0
                  ? isActive
                    ? 'bg-blue-500 text-white'
                    : ' hover:bg-blue-500 hover:text-white text-black'
                  : isActive
                    ? 'text-blue-600 font-bold'
                    : 'hover:text-blue-600'
                } ${(hoveredItem === itemTitle || isActive) && isMobile
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
              <div className="p-6 font-semibold text-2xl text-center flex items-center gap-1 justify-center">
                <img
                  src="/demo/synco/images/synco-text.png"
                  alt="Logo"
                  className="h-10 w-auto object-contain"
                />
                          <img src='/demo/synco/images/synco-text-round.png' alt="Welcome" className="h-10 w-auto object-contain" />

              </div>

              <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 px-2 pb-6">
                {renderMenuItems(menuItems)}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>


      {/* Desktop Sidebar */}
      <aside className="hidden md:w-2/12 lg:flex w-72 bg-white border-r border-gray-100 flex-col shadow-lg">
        <div className="p-6 font-semibold text-2xl text-center flex items-center gap-0.5 justify-center">
          <img src='/demo/synco/images/synco-text.png' alt="Logo" className="h-10 w-auto object-contain" />
        <img src='/demo/synco/images/synco-text-round.png' alt="Welcome" className="h-10 w-auto object-contain mb-0.5 animate-spin [animation-duration:4s] " />
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-hide scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
          {renderMenuItems(menuItems)}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

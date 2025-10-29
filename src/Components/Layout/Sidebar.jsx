import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronUp, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { usePermission } from "../Pages/AdminPages/Common/permission";
import { X } from 'lucide-react'; // Add this to your imports

function normalizePath(path) {
  if (!path) return "";

  return path
    .split(/[?#]/)[0] // remove query/hash
    .replace(/\/+$/, "") // remove trailing slash
    // remove non-core suffixes
    .replace(
      /\/(list|lists|create|update|edit|details|view|account-info|add-to-waiting-list|book-a-free-trial|book-a-membership)(\/.*)?$/,
      ""
    );
}



// 🔁 Recursively find active item & its parents
function findActiveItemAndParents(items, currentPath, parents = []) {
  const normalizedCurrent = normalizePath(currentPath);

  for (const item of items) {
    const normalizedItemLink = normalizePath(item.link);

    // 🔹 Main logic: mark parent active if path includes its link
    if (
      normalizedItemLink &&
      normalizedCurrent.includes(normalizedItemLink)
    ) {
      return { item, parents };
    }

    if (item.subItems) {
      const found = findActiveItemAndParents(item.subItems, currentPath, [...parents, item]);
      if (found) return found;
    }

    if (item.innerSubItems) {
      const foundInner = findActiveItemAndParents(item.innerSubItems, currentPath, [...parents, item]);
      if (foundInner) return foundInner;
    }
  }

  return null;
}


const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarRef = useRef();
  const { checkPermission } = usePermission();
  const MyRole = localStorage.getItem("role");
  useEffect(() => {
    const result = findActiveItemAndParents(menuItems, location.pathname);
    if (result) {
      const { item, parents } = result;
      setActiveTab(item.link);

      // Auto-expand parent dropdowns
      const expanded = {};
      parents.forEach((p) => (expanded[p.title] = true));
      setOpenDropdowns((prev) => ({ ...prev, ...expanded }));
    }
  }, [location.pathname]);
  const [activeTab, setActiveTab] = useState(null); // track active link
  const [activeItem, setActiveItem] = useState(null);
  // Helper to check if this item or any of its subItems matches the current path
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);
  const isItemActive = (item) => {
    console.log('item11', item)
    if (item.link && activeTab === item.link) return true; // submenu or direct link
    if (item.subItems) {
      return item.subItems.some(sub => sub.link === activeTab);
    }
    return false;
  };

  // Existing menuItemsRaw logic remains unchanged
  const menuItemsRaw = [
    {
      title: 'Dashboard',
      icon: '/demo/synco/SidebarLogos/Dashboard.png',
      path: '/',
      iconHover: '/demo/synco/SidebarLogos/DashboardH.png',
      link: '/',
    },
    {
      title: 'Weekly Classes',
      path: '/weekly-classes',
      icon: '/demo/synco/SidebarLogos/WeeklyClasses.png',
      iconHover: '/demo/synco/SidebarLogos/WeeklyClassesH.png',
      needPermissions: [
        { module: 'book-membership', action: 'view-listing' },
        { module: 'book-free-trial', action: 'view-listing' },
        { module: 'find-class', action: 'view-listing' },
        { module: 'cancellation', action: 'view-listing' },
        { module: 'waiting-list', action: 'view-listing' },
        { module: 'account-information', action: 'view-listing' }
      ],
      subItems: [
        { title: 'Find a class', link: '/weekly-classes/find-a-class', needPermissions: [{ module: 'find-class', action: 'view-listing' }] },
        { title: 'Members', link: '/weekly-classes/all-members/list', needPermissions: [{ module: 'book-membership', action: 'view-listing' }] },
        { title: 'Sales', link: '/weekly-classes/all-members/membership-sales', needPermissions: [{ module: 'book-membership', action: 'view-listing' }] },
        { title: 'Trials', link: '/weekly-classes/trial/list', needPermissions: [{ module: 'book-free-trial', action: 'view-listing' }] },
        { title: 'Cancellation', link: '/weekly-classes/cancellation', needPermissions: [{ module: 'cancellation', action: 'view-listing' }] },
        { title: 'Waiting List', link: '/weekly-classes/find-a-class/add-to-waiting-list/list', needPermissions: [{ module: 'waiting-list', action: 'view-listing' }] },
        { title: 'Capacity', link: '/weekly-classes/capacity', needPermissions: [{ module: 'capacity', action: 'view-listing' }] },
        { title: 'Account Information', link: '/weekly-classes/members-info', needPermissions: [{ module: 'book-membership', action: 'view-listing' }] },
      ]
    },
    {
      title: 'Holiday Camps',
      path: '/holiday-camps',
      icon: '/demo/synco/SidebarLogos/Holiday.png',
      iconHover: '/demo/synco/SidebarLogos/HolidayH.png',
      needPermissions: [
        { module: 'discount', action: 'view-listing' },
        { module: 'discount', action: 'create' }
      ],
      subItems: [
        { title: 'Discounts', link: '/holiday-camps/discounts/list', needPermissions: [{ module: 'discount', action: 'view-listing' }, { module: 'discount', action: 'create' }] }
      ]
    },

    ...(MyRole === 'Super Admin'
      ? [
        {
          title: 'Permission',
          path: '/permission',
          icon: '/demo/synco/SidebarLogos/Dashboard.png',
          iconHover: '/demo/synco/SidebarLogos/DashboardH.png',
          link: '/permission',
          needPermissions: [
            { module: 'admin-role', action: 'view-listing' },
            { module: 'admin-role', action: 'create' }
          ]
        }
      ] : []),
    {
      title: 'Key Information',
      icon: '/demo/synco/SidebarLogos/Management.png',
      iconHover: '/demo/synco/SidebarLogos/ManagementH.png',
      link: '/KeyInfomation',
      path: '/KeyInfomation',
      needPermissions: [
        { module: 'key-information', action: 'view-listing' },
        { module: 'key-information', action: 'create' }
      ]
    },
    {
      title: 'Administration',
      path: '/members',
      icon: '/demo/synco/SidebarLogos/Admistration.png',
      iconHover: '/demo/synco/SidebarLogos/AdmistrationH.png',
      needPermissions: [{ module: 'member', action: 'view-listing' }],
      subItems: [
        { title: 'Admin Panel', link: '/members/List', needPermissions: [{ module: 'member', action: 'view-listing' }] }
      ]
    },
    {
      title: "Configuration",
      icon: "/demo/synco/SidebarLogos/config.png",
      path: '/configuration',
      iconHover: "/demo/synco/SidebarLogos/configH.png",
      needPermissions: [
        { module: 'configuration', action: 'view' },

      ],
      subItems: [
        {
          title: "Weekly classes",
          link: "#",
          needPermissions: [
            { module: "venue", action: "view-listing" },
            { module: "term-group", action: "view-listing" },
            { module: "session-plan-group", action: "view-listing" },
            { module: "payment-group", action: "view-listing" },
          ],

          subItems: [

            {
              noPaddingx: true,
              title: "Venues",
              link: "/configuration/weekly-classes/venues",
              needPermissions: [
                { module: "venue", action: "view-listing" },
                { module: "venue", action: "create" },
              ],

            },
            {
              noPaddingx: true,
              title: "Term Dates & Mapping",
              link: "/configuration/weekly-classes/term-dates/list",
              needPermissions: [
                { module: "term-group", action: "view-listing" },
                { module: "term", action: "view-listing" },
              ],
            },
            {
              noPaddingx: true,
              title: "Session Plan Library",
              link: "/configuration/weekly-classes/session-plan-list",
              needPermissions: [
                { module: "session-plan-group", action: "view-listing" },
              ],
            },
            {
              noPaddingx: true,
              title: "Subscription Plan Manager",
              link: "/configuration/weekly-classes/subscription-planManager",
              needPermissions: [
                { module: "payment-group", action: "view-listing" },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "One To One",
      icon: "/demo/synco/SidebarLogos/config.png",
      path: '/one-to-one',
      link: '/one-to-one',
      iconHover: "/demo/synco/SidebarLogos/configH.png",
      needPermissions: [
        { module: 'session-exercise-one-to-one', action: 'view-listing' },

      ],
      subItems: [
        {
          title: "Sales",
          link: '/one-to-one',


          needPermissions: [
            { module: "venue", action: "view-listing" },
            { module: "term-group", action: "view-listing" },
            { module: "session-plan-group", action: "view-listing" },
            { module: "payment-group", action: "view-listing" },
          ],


        },
        {
          title: "Leads Database",
          link: '/one-to-one/central-leads',
          needPermissions: [
            { module: "venue", action: "view-listing" },
            { module: "term-group", action: "view-listing" },
            { module: "session-plan-group", action: "view-listing" },
            { module: "payment-group", action: "view-listing" },
          ],


        }
        
      ],
    },
  ];

  let menuItems = [];
  // ... permission filtering logic remains unchanged ...
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
    localStorage.removeItem("openClassIndex");
    localStorage.removeItem("openTerms");
    setOpenDropdowns((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const removeLocalstorage = () => {
    localStorage.removeItem("openClassIndex");
    localStorage.removeItem("openTerms");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const renderMenuItems = (items, level = 0) => {


    return (
      <ul
        className={`
        ${level === 0 ? 'px-4 py-10 lg:px-1' : 'pl-6 lg:pl-13 innersub'} 
        ${level >= 2 ? 'list-disc' : 'list-disc'} 
        space-y-1
      `}
      >
        {items.map((item) => {
          const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;
          const hasInnerSubItems = Array.isArray(item.innerSubItems) && item.innerSubItems.length > 0;
          function hasNoPadding(subItems) {
            if (!subItems || !subItems.length) return false;

            return subItems.some(sub => sub.noPaddingx || hasNoPadding(sub.subItems));
          }

          // Usage for top-level item
          const noPaddingx = hasNoPadding(item.subItems);
          console.log(noPaddingx); // true if any inner subItem has noPaddingx

          // const noPaddingx =item.subItems.noPaddingx;
          const itemTitle = typeof item === 'string' ? item : item.title;

          const isActiveTitle = true;
          console.log('itemTitle', itemTitle)
          console.log('activeItem', activeItem)

          const isActive = item.path
            ? item.path === '/'
              ? location.pathname === '/' // exact match for dashboard
              : location.pathname.startsWith(item.path) // include match for other routes
            : false;
          console.log('isActive', isActive)
          const content = (
            <motion.div
              initial={false}
              onClick={() => {
                if (hasSubItems || hasInnerSubItems) {
                  toggleDropdown(itemTitle);
                } else {
                  setActiveTab(item.link); // make clicked link active
                  if (window.innerWidth < 1024) setIsMobileMenuOpen(false);
                }
              }}
              onMouseEnter={() => setHoveredItem(itemTitle)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex items-center subitems justify-between font-semibold cursor-pointer 
    px-3 sm:px-4 lg:px-4 ${noPaddingx ? 'px-0' : 'px-3 sm:px-4 lg:px-4'} py-1.5 sm:py-2 rounded-lg ${isActiveTitle && isActive ? 'bg-blue-500 text-white' : 'bg-[#FDFDFF] '}  transition-all duration-100
    ${level === 0
                  ? isItemActive(item)
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-500 hover:text-white text-black'
                  : isItemActive(item)
                    ? 'text-blue-600 font-bold'
                    : 'hover:text-blue-600'
                }`}
            >
              <span className="flex items-center gap-2 sm:gap-3 lg:gap-3 text-sm sm:text-base lg:text-lg">
                {item.icon && level === 0 && (
                  <span className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded">
                    {!isSidebarCollapsed && (
                      <motion.img
                        src={hoveredItem === itemTitle || isActive ? item.iconHover : item.icon}
                        alt={itemTitle}
                        className="w-4 h-4 sm:w-6 sm:h-6 drop-shadow-sm"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                  </span>
                )}
                {!isSidebarCollapsed && (
                  <span className={`font-semibold ${level === 0 ? 'text-[18px]' : 'text-[16px]'}`}>
                    {itemTitle}
                  </span>
                )}
              </span>
              {level === 0 && (hasSubItems || hasInnerSubItems) && !isSidebarCollapsed &&
                (openDropdowns[itemTitle] ? <ChevronUp size={18} /> : <ChevronDown size={18} />)}
            </motion.div>
          );

          return (
            <li
              key={itemTitle}
              className="mb-1.5 sm:mb-2 text-sm sm:text-base lg:text-lg "
              onClick={removeLocalstorage}
            >
              {item.link ? <Link to={item.link}>{content}</Link> : content}

              {/* Handle subItems */}
              <AnimatePresence initial={false}>
                {(hasSubItems || hasInnerSubItems) && openDropdowns[itemTitle] && (
                  <motion.div
                    className='opend'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {hasSubItems && renderMenuItems(item.subItems, level + 1)}

                    {/* Handle innerSubItems */}
                    {hasInnerSubItems && (
                      <ul className="pl-8 list-disc text-gray-700 space-y-1 mt-1">
                        {item.innerSubItems.map((inner, i) => (
                          <li
                            key={i}
                            className="cursor-pointer  hover:text-blue-600 transition-all text-sm"
                          >
                            {inner}
                          </li>
                        ))}
                      </ul>
                    )}
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
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Sidebar Collapse Toggle Button */}

      <button
        className="hidden lg:flex fixed top-10 left-0 z-50 bg-blue-500 text-white p-2 rounded-r-md shadow-lg hover:bg-blue-600 transition-all"
        onClick={toggleSidebarCollapse}
      >
        {isSidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
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
                <img src="/demo/synco/images/synco-text.png" alt="Logo" className="h-10 w-auto object-contain" />
                <img src='/demo/synco/images/synco-text-round.png' alt="Welcome" className="h-10 w-auto object-contain" />
              </div>
              <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 px-2 pb-6">
                {renderMenuItems(menuItems)}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop- Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-lg transition-all duration-300
          ${isSidebarCollapsed ? 'w-20 opacity-0' : 'w-72'}
        `}
      >
        <div className="p-6 font-semibold text-2xl text-center flex items-center gap-0.5 justify-center">
          <img src='/demo/synco/images/synco-text.png' alt="Logo" className={`h-15 w-auto object-contain ${isSidebarCollapsed ? 'hidden' : ''}`} />
          <img src='/demo/synco/images/synco-text-round.png' alt="Welcome" className={`h-15 w-auto object-contain mb-0.5 animate-spin [animation-duration:4s] ${isSidebarCollapsed ? 'mx-auto hidden' : ''}`} />
        </div>
        <nav className="flex-1 overflow-y-auto scrollbar-hide scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500 px-2">
          {renderMenuItems(menuItems)}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

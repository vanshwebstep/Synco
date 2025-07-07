import React, { useState } from 'react';
import {
    LayoutGrid, Package, Truck, User, ChevronDown, ChevronUp, ChevronRight, MessageCircle, FileText, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const menuItems = [
    { title: 'Dashboard', icon: '/SidebarLogos/Dashboard.png', iconHover: '/SidebarLogos/DashboardH.png', link: '/' },
    { title: 'Weekly Classes', icon: '/SidebarLogos/WeeklyClasses.png', iconHover: '/SidebarLogos/WeeklyClassesH.png', subItems: ['Camp 1', 'Camp 2'] },
    { title: 'One to One', icon: '/SidebarLogos/OneTOOne.png', iconHover: '/SidebarLogos/OneTOOneH.png', link: '/admin-ForgotPassword' },
    { title: 'Holiday Camps', icon: '/SidebarLogos/Holiday.png', iconHover: '/SidebarLogos/HolidayH.png', subItems: ['Camp 1', 'Camp 2'] },
    { title: 'Birthday parties', icon: '/SidebarLogos/Birthday.png', iconHover: '/SidebarLogos/BirthdayH.png', subItems: ['Party 1', 'Party 2'] },
    {
        title: 'Club',
        icon: '/SidebarLogos/Club.png',
        iconHover: '/SidebarLogos/ClubH.png',
        subItems: [
            { title: 'Session A', innerSubItems: ['Slot 1', 'Slot 2'] },
            { title: 'Session B', innerSubItems: ['Slot 3', 'Slot 4'] },
            { title: 'Session C' }
        ]
    },
    { title: 'Merchandise', icon: '/SidebarLogos/Merchandise.png', iconHover: '/SidebarLogos/MerchandiseH.png', link: '#' },
    { title: 'Email management', icon: '/SidebarLogos/Management.png', iconHover: '/SidebarLogos/ManagementH.png', link: '#' },
    { title: 'Surveys', icon: '/SidebarLogos/Survey.png', iconHover: '/SidebarLogos/SurveyH.png', subItems: ['Survey 1', 'Survey 2'] },
    { title: 'Email marketing', icon: '/SidebarLogos/Marketing.png', iconHover: '/SidebarLogos/MarketingH.png', subItems: ['Campaign 1', 'Campaign 2'] },
    { title: 'Recruitment', icon: '/SidebarLogos/Recruitment.png', iconHover: '/SidebarLogos/RecruitmentH.png', subItems: ['Job 1', 'Job 2'] },
    { title: 'Reports', icon: '/SidebarLogos/Reports.png', iconHover: '/SidebarLogos/ReportsH.png', subItems: ['Report 1', 'Report 2'] },
    { title: 'Marketing reports', icon: '/SidebarLogos/MarketingReports.png', iconHover: '/SidebarLogos/MarketingReportsH.png', subItems: ['Report A', 'Report B'] },
    { title: 'Recruitment reports', icon: '/SidebarLogos/ReqReports.png', iconHover: '/SidebarLogos/ReqReportsH.png', link: '#' },
    { title: 'Synco Chat', icon: '/SidebarLogos/bubble-chat.png', iconHover: '/SidebarLogos/bubble-chatH.png', link: '#' },
    { title: 'Templates', icon: '/SidebarLogos/Template.png', iconHover: '/SidebarLogos/TemplateH.png', link: '#' },
    { title: 'Administration', icon: '/SidebarLogos/Admistration.png', iconHover: '/SidebarLogos/AdmistrationH.png', link: '/members' }
];


const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);

    const toggleDropdown = (title) => {
        setOpenDropdowns((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prev) => !prev);
    };

const renderMenuItems = (items, level = 0) => {
    const location = useLocation(); // current route

    return (
        <ul className={`${level === 0 ? 'px-4' : 'pl-10'} ${level === 2 ? 'list-disc' : 'list-none'} space-y-1`}>
            {items.map((item) => {
                const hasSubItems = Array.isArray(item.subItems);
                const hasInnerSubItems = Array.isArray(item.innerSubItems);
                const itemTitle = typeof item === 'string' ? item : item.title;

                const isActive = item.link && location.pathname === item.link;

                const content = (
                    <motion.div
                        initial={false}
                        onClick={() => {
                            if (hasSubItems || hasInnerSubItems) {
                                toggleDropdown(itemTitle);
                            } else if (window.innerWidth < 1024) {
                                setIsMobileMenuOpen(false);
                            }
                        }}
                        onMouseEnter={() => setHoveredItem(itemTitle)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                            flex items-center justify-between font-semibold cursor-pointer px-4 py-2 rounded-lg 
                            transition-all duration-100
                            ${
                                level === 0
                                    ? isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-transparent hover:bg-blue-500 hover:text-white text-black'
                                    : isActive
                                    ? 'text-blue-600 font-bold'
                                    : 'hover:text-blue-600'
                            }
                        `}
                    >
                        <span className="flex items-center gap-3 transition-all duration-100">
                            {item.icon && level === 0 && (
                                <motion.img
                                    src={hoveredItem === itemTitle || isActive ? item.iconHover : item.icon}
                                    alt={itemTitle}
                                    className="w-6 h-6"
                                    initial={{ opacity: 0.8 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                            <span>{itemTitle}</span>
                        </span>
                        {level === 0 && hasSubItems && (
                            openDropdowns[itemTitle] ? <ChevronUp size={20} /> : <ChevronDown size={20} />
                        )}
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
                                    animate={{ height: "auto", opacity: 1 }}
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

    return (
        <>


            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'tween' }}
                        className="fixed top-0 left-0 w-72 h-full bg-white z-50 shadow-lg border-r lg:hidden"
                    >
                        <div className="p-6 font-semibold text-2xl text-center flex items-center justify-center">
                            <img src='public/images/synco-text.png' alt="Logo" className="h-10 w-auto object-contain" />
                        </div>
                        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
                            {renderMenuItems(menuItems)}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 h-screen bg-white border-r border-gray-100 flex-col shadow-lg">
                <div className="p-6 font-semibold text-2xl text-center flex items-center justify-center">
                    <img src='public/images/synco-text.png' alt="Logo" className="h-10 w-auto object-contain" />
                </div>
                <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
                    {renderMenuItems(menuItems)}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;

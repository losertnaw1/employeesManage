import { FC } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/Sidebar.css';

interface SidebarProps {
    drawerOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: FC<SidebarProps> = ({ drawerOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const menuItems = [
        { label: t('dashboard'), path: '/' },
        { label: t('employees'), path: '/employees' },
        { label: t('search'), path: '/search' },
        { label: t('attendance'), path: '/attendance' },
        { label: t('salary'), path: '/salary' },
        { label: t('leaves'), path: '/leaves' },
        { label: t('notifications'), path: '/notifications' },
    ];

    return (
        <div className={`sidebar ${!drawerOpen ? 'closed' : ''}`}>
            <div className="sidebar-header">
                {drawerOpen && (
                    <button
                        onClick={toggleSidebar}
                        className="close-button"
                    >
                        &#9776;
                    </button>
                )}
            </div>
            <ul className="menu-list">
                {menuItems.map((item) => (
                    <li
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
                        style={{ display: drawerOpen ? 'block' : 'none' }}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;

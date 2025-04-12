import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import '../../styles/AdminSidebar.css';

interface AdminSidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const AdminSidebar = ({ open, toggleSidebar }: AdminSidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  
  // Define sidebar menu items
  const menuItems = [
    {
      label: t('dashboard'),
      path: '/admin/dashboard',
      icon: 'dashboard',
      roles: ['admin', 'superadmin', 'editor']
    },
    {
      label: t('employees'),
      path: '/employees',
      icon: 'people',
      roles: ['admin', 'superadmin', 'editor']
    },
    {
      label: t('search'),
      path: '/search',
      icon: 'search',
      roles: ['admin', 'superadmin', 'editor']
    },
    {
      label: t('manageAdmins'),
      path: '/admin/manage',
      icon: 'admin_panel_settings',
      roles: ['superadmin']
    },
    {
      label: t('settings'),
      path: '/admin/settings',
      icon: 'settings',
      roles: ['superadmin']
    }
  ];
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    hasRole(item.roles)
  );
  
  return (
    <aside className={`admin-sidebar ${open ? 'open' : 'closed'}`}>
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">{t('adminPanel')}</h2>
        <button className="admin-sidebar-close" onClick={toggleSidebar}>
          &times;
        </button>
      </div>
      
      <nav className="admin-sidebar-nav">
        <ul className="admin-sidebar-menu">
          {filteredMenuItems.map((item) => (
            <li 
              key={item.path}
              className={`admin-sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <button onClick={() => navigate(item.path)}>
                <span className="admin-sidebar-icon material-icons">{item.icon}</span>
                <span className="admin-sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;

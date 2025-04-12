import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar drawerOpen={drawerOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${drawerOpen ? 'sidebar-open' : ''}`}>
        <Header drawerOpen={drawerOpen} toggleSidebar={toggleSidebar} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

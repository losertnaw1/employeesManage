import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchEmployees } from '../api/employeesApi';
// import { Employee } from '../types/employee';

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const employees = await fetchEmployees();
        setEmployeeCount(employees.length);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const DashboardCard = ({ title, value, icon, onClick }: { title: string; value: string | number; icon: string; onClick?: () => void }) => (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{value}</p>
    </div>
  );

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Dashboard</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <DashboardCard
          title="Total Employees"
          value={employeeCount}
          icon="👥"
          onClick={() => navigate('/employees')}
        />
        <DashboardCard
          title="Attendance Rate"
          value="95%"
          icon="📊"
        />
        <DashboardCard
          title="New Hires"
          value="3"
          icon="🆕"
        />
        <DashboardCard
          title="Pending Leaves"
          value="2"
          icon="🗓️"
        />
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ marginTop: 0, color: '#0056b3' }}>Recent Activities</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li>New employee John Doe was added</li>
          <li>Jane Smith updated her profile</li>
          <li>Attendance report for March was generated</li>
          <li>System maintenance scheduled for next weekend</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

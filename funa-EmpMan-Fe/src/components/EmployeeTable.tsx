import { FC } from 'react';
import { Employee } from '../types/employee';
import '../styles/Employees.css';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string, name: string) => void;
}

const EmployeeTable: FC<EmployeeTableProps> = ({ employees, onEdit, onDelete }) => {
  if (employees.length === 0) {
    return <div className="empty-message">No employees found.</div>;
  }

  return (
    <div className="table-container">
      <table className="employees-table">
        <thead>
          <tr className="table-header">
            <th>#</th>
            <th>Tên Tiếng Việt</th>
            <th>Tên Tiếng Trung</th>
            <th>Số Điện Thoại</th>
            <th>Địa Điểm</th>
            <th>Tiếng Trung</th>
            <th>Học Vấn</th>
            <th>Quản Lý</th>
            <th>Cấp Bậc</th>
            <th>Kỹ Năng</th>
            <th>Dự Án</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp._id} className="table-row">
              <td className="table-cell">{index + 1}</td>
              <td className="table-cell name-cell">{emp.fullNameVi || '-'}</td>
              <td className="table-cell">{emp.fullNameCn || '-'}</td>
              <td className="table-cell">{emp.phoneNumber || '-'}</td>
              <td className="table-cell">{emp.mainWorkLocation || '-'}</td>
              <td className="table-cell">{emp.chineseLevel || '-'}</td>
              <td className="table-cell">{emp.educationLevel || '-'}</td>
              <td className="table-cell">{emp.projectManager || '-'}</td>
              <td className="table-cell">{emp.rank || '-'}</td>
              <td className="table-cell">{emp.skills?.join(', ') || '-'}</td>
              <td className="table-cell">{emp.previousProjects?.join(', ') || '-'}</td>
              <td className="action-cell">
                <button
                  className="edit-button"
                  onClick={() => onEdit(emp)}
                >
                  Sửa
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(emp._id, emp.fullNameVi)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;

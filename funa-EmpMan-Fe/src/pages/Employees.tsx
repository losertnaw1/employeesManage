import { useState, useEffect } from 'react';
import { Employee } from '../types/employee';
import '../styles/Employees.css';
import CVUploader from '../components/CVUploader';
import { useTranslation } from 'react-i18next';
import { toast } from '../components/ToastContainer';
import { employeeService } from '../services/employeeService';

const Employees = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  // State for tracking CV upload status
  const [, setCvUploaded] = useState(false); // Used in handleCvUpload

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Không thể tải dữ liệu nhân viên. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa nhân viên ${name}?`)) {
      try {
        await employeeService.deleteEmployee(id);
        toast.success(t('deleteSuccess') || `Đã xóa nhân viên: ${name}`);
        // Refresh employee list
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
        toast.error(t('deleteError') || 'Không thể xóa nhân viên. Vui lòng thử lại sau.');
      }
    }
  };

  const handleSaveEmployee = async (employee: Partial<Employee>) => {
    try {
      if (currentEmployee) {
        // Update existing employee
        await employeeService.updateEmployee(currentEmployee._id, employee);
        toast.success(t('updateSuccess') || 'Cập nhật nhân viên thành công!');
      } else {
        // Create new employee
        const data = await employeeService.createEmployee(employee);
        toast.success(t('addSuccess') || 'Thêm nhân viên mới thành công!');

        // Cập nhật currentEmployee để hiển thị form upload CV
        setCurrentEmployee(data);
        return; // Không đóng form để người dùng có thể tải CV lên
      }
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error('Error saving employee:', err);
      toast.error(t('saveError') || 'Lỗi khi lưu thông tin nhân viên. Vui lòng thử lại sau.');
    }
  };

  const handleCVUploadSuccess = async (cvUrl: string) => {
    setCvUploaded(true);

    if (currentEmployee) {
      try {
        // Update employee with CV URL
        await employeeService.updateEmployee(currentEmployee._id, {
          cvUrl: cvUrl
        });

        // Update current employee state
        setCurrentEmployee({
          ...currentEmployee,
          cvUrl: cvUrl
        });

        // Hiển thị thông báo thành công
        toast.success(t('uploadSuccess') || 'Tải CV lên thành công');

        // Đóng form sau khi tải CV lên thành công
        setShowForm(false);

        // Refresh employee list
        fetchEmployees();
      } catch (err) {
        console.error('Error updating employee with CV URL:', err);
        toast.error(t('uploadError') || 'Lỗi khi tải CV lên. Vui lòng thử lại');
      }
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="employees-container">
      <h1 className="employees-title">{t('manage')}</h1>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{currentEmployee ? t('editEmployee') : t('addEmployee')}</h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const employeeData: Partial<Employee> = {
                fullNameVi: formData.get('fullNameVi') as string,
                fullNameCn: formData.get('fullNameCn') as string,
                phoneNumber: formData.get('phoneNumber') as string,
                mainWorkLocation: formData.get('mainWorkLocation') as string,
                chineseLevel: formData.get('chineseLevel') as string,
                educationLevel: formData.get('educationLevel') as string,
                projectManager: formData.get('projectManager') as string,
                rank: formData.get('rank') as string,
                skills: formData.get('skills') ? (formData.get('skills') as string).split(',') : [],
                previousProjects: formData.get('previousProjects') ? (formData.get('previousProjects') as string).split(',') : [],
                referrer: formData.get('referrer') as string,
                notes: formData.get('notes') as string,
              };
              handleSaveEmployee(employeeData);
            }}>
              <div className="form-group">
                <label className="form-label">{t('fullNameVi')} *</label>
                <input
                  type="text"
                  name="fullNameVi"
                  defaultValue={currentEmployee?.fullNameVi || ''}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('fullNameCn')}</label>
                <input
                  type="text"
                  name="fullNameCn"
                  defaultValue={currentEmployee?.fullNameCn || ''}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('phoneNumber')}</label>
                <input
                  type="text"
                  name="phoneNumber"
                  defaultValue={currentEmployee?.phoneNumber || ''}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Địa Điểm Làm Việc</label>
                <select
                  name="mainWorkLocation"
                  defaultValue={currentEmployee?.mainWorkLocation || ''}
                  className="form-select"
                >
                  <option value="">Chọn địa điểm</option>
                  <option value="HN">Hà Nội</option>
                  <option value="HCM">Hồ Chí Minh</option>
                  <option value="DN">Đà Nẵng</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trình Độ Tiếng Trung</label>
                <select
                  name="chineseLevel"
                  defaultValue={currentEmployee?.chineseLevel || ''}
                  className="form-select"
                >
                  <option value="">Chọn trình độ</option>
                  <option value="HSK1">HSK1</option>
                  <option value="HSK2">HSK2</option>
                  <option value="HSK3">HSK3</option>
                  <option value="HSK4">HSK4</option>
                  <option value="HSK5">HSK5</option>
                  <option value="HSK6">HSK6</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Trình Độ Học Vấn</label>
                <select
                  name="educationLevel"
                  defaultValue={currentEmployee?.educationLevel || ''}
                  className="form-select"
                >
                  <option value="">Chọn trình độ</option>
                  <option value="THPT">THPT</option>
                  <option value="CD">Cao đẳng</option>
                  <option value="DH">Đại học</option>
                  <option value="ThS">Thạc sĩ</option>
                  <option value="TS">Tiến sĩ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Người Quản Lý</label>
                <input
                  type="text"
                  name="projectManager"
                  defaultValue={currentEmployee?.projectManager || ''}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cấp Bậc</label>
                <select
                  name="rank"
                  defaultValue={currentEmployee?.rank || ''}
                  className="form-select"
                >
                  <option value="">Chọn cấp bậc</option>
                  <option value="INTERN">Thực tập sinh</option>
                  <option value="JUNIOR">Nhân viên</option>
                  <option value="SENIOR">Nhân viên cao cấp</option>
                  <option value="LEAD">Trưởng nhóm</option>
                  <option value="MANAGER">Quản lý</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Kỹ Năng (cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  name="skills"
                  defaultValue={currentEmployee?.skills?.join(',') || ''}
                  className="form-input"
                  placeholder="VD: React, TypeScript, Node.js"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Dự Án Đã Tham Gia (cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  name="previousProjects"
                  defaultValue={currentEmployee?.previousProjects?.join(',') || ''}
                  className="form-input"
                  placeholder="VD: Project A, Project B"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Người Giới Thiệu</label>
                <input
                  type="text"
                  name="referrer"
                  defaultValue={currentEmployee?.referrer || ''}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi Chú</label>
                <textarea
                  name="notes"
                  defaultValue={currentEmployee?.notes || ''}
                  className="form-textarea"
                />
              </div>

              {/* Hiển thị CVUploader khi đang chỉnh sửa nhân viên đã tồn tại */}
              {currentEmployee ? (
                <div className="form-group">
                  <CVUploader
                    employeeId={currentEmployee._id}
                    cvUrl={currentEmployee.cvUrl}
                    onUploadSuccess={handleCVUploadSuccess}
                    onSkip={() => {
                      // Đóng form khi người dùng bỏ qua việc tải CV lên
                      setShowForm(false);
                      fetchEmployees();
                    }}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <div className="cv-uploader">
                    <div className="cv-uploader-header">
                      <h3>{t('uploadCV') || 'Tải CV lên'}</h3>
                    </div>
                    <div className="cv-uploader-content">
                      <div className="cv-no-file">
                        <span>{t('cvAfterCreate') || 'Bạn có thể tải CV lên sau khi tạo nhân viên'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cancel-button"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="save-button"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-message">
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="empty-message">
          <p>{t('noData')}</p>
        </div>
      )}

      {!loading && employees.length > 0 && (
        <div className="table-container">
          <table className="employees-table">
            <thead>
              <tr className="table-header">
                <th>#</th>
                <th>{t('fullNameVi')}</th>
                <th>{t('fullNameCn')}</th>
                <th>{t('phoneNumber')}</th>
                <th>{t('mainWorkLocation')}</th>
                <th>{t('chineseLevel')}</th>
                <th>{t('educationLevel')}</th>
                <th>{t('projectManager')}</th>
                <th>{t('rank')}</th>
                <th>{t('skills')}</th>
                <th>{t('previousProjects')}</th>
                <th>CV</th>
                <th>{t('actions')}</th>
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
                  <td className="table-cell">
                    {emp.cvUrl ? (
                      <button
                        className="cv-download-button"
                        onClick={async () => {
                          try {
                            const blob = await employeeService.downloadCV(emp._id);
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = emp.cvUrl?.split('/').pop() || 'cv.pdf';
                            document.body.appendChild(a);
                            a.click();

                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                          } catch (err) {
                            console.error('Error downloading CV:', err);
                            toast.error(t('downloadError') || 'Failed to download CV');
                          }
                        }}
                      >
                        {t('downloadCV')}
                      </button>
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="action-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEditEmployee(emp)}
                    >
                      {t('edit')}
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteEmployee(emp._id, emp.fullNameVi)}
                    >
                      {t('delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="add-button-container">
        <button
          className="add-button"
          onClick={handleAddEmployee}
        >
          + {t('addEmployee')}
        </button>
      </div>
    </div>
  );
};

export default Employees;

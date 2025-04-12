import { useState, useEffect, FC } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import axios from 'axios';
import { Employee } from '../types/employee';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  employee?: Employee;
  onSave: (employee: Partial<Employee>) => void;
}

const EmployeeForm: FC<EmployeeFormProps> = ({ open, onClose, employee, onSave }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({
    fullNameVi: '',
    fullNameCn: '',
    phoneNumber: '',
    mainWorkLocation: '',
    chineseLevel: '',
    educationLevel: '',
    projectManager: '',
    rank: '',
    skills: [],
    previousProjects: [],
    referrer: '',
    notes: '',
  });

  // Sample lookup data (in a real app, these would come from API)
  const chineseLevels = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'];
  const educationLevels = ['THPT', 'CD', 'DH', 'ThS', 'TS'];
  const ranks = ['INTERN', 'JUNIOR', 'SENIOR', 'LEAD', 'MANAGER'];
  const skills = ['SKL01', 'SKL02', 'SKL03', 'SKL04', 'SKL05'];
  const projects = ['PRJ01', 'PRJ02', 'PRJ03', 'PRJ04'];
  const referrers = ['REF01', 'REF02', 'REF03'];
  const locations = ['HN', 'HCM', 'DN', 'HP', 'ND'];

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
      });
    } else {
      // Reset form for new employee
      setFormData({
        fullNameVi: '',
        fullNameCn: '',
        phoneNumber: '',
        mainWorkLocation: '',
        chineseLevel: '',
        educationLevel: '',
        projectManager: '',
        rank: '',
        skills: [],
        previousProjects: [],
        referrer: '',
        notes: '',
      });
    }
  }, [employee, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (e: SelectChangeEvent<string[]>, fieldName: string) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [fieldName]: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = async () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{employee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên Tiếng Việt"
              name="fullNameVi"
              value={formData.fullNameVi || ''}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tên Tiếng Trung"
              name="fullNameCn"
              value={formData.fullNameCn || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Số Điện Thoại"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Địa Điểm Làm Việc</InputLabel>
              <Select
                name="mainWorkLocation"
                value={formData.mainWorkLocation || ''}
                onChange={handleSelectChange}
                label="Địa Điểm Làm Việc"
              >
                {locations.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Trình Độ Tiếng Trung</InputLabel>
              <Select
                name="chineseLevel"
                value={formData.chineseLevel || ''}
                onChange={handleSelectChange}
                label="Trình Độ Tiếng Trung"
              >
                {chineseLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Trình Độ Học Vấn</InputLabel>
              <Select
                name="educationLevel"
                value={formData.educationLevel || ''}
                onChange={handleSelectChange}
                label="Trình Độ Học Vấn"
              >
                {educationLevels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Người Quản Lý"
              name="projectManager"
              value={formData.projectManager || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Cấp Bậc</InputLabel>
              <Select
                name="rank"
                value={formData.rank || ''}
                onChange={handleSelectChange}
                label="Cấp Bậc"
              >
                {ranks.map((rank) => (
                  <MenuItem key={rank} value={rank}>
                    {rank}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Kỹ Năng</InputLabel>
              <Select
                multiple
                name="skills"
                value={formData.skills || []}
                onChange={(e) => handleMultiSelectChange(e, 'skills')}
                label="Kỹ Năng"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {skills.map((skill) => (
                  <MenuItem key={skill} value={skill}>
                    {skill}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Dự Án Đã Tham Gia</InputLabel>
              <Select
                multiple
                name="previousProjects"
                value={formData.previousProjects || []}
                onChange={(e) => handleMultiSelectChange(e, 'previousProjects')}
                label="Dự Án Đã Tham Gia"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {projects.map((project) => (
                  <MenuItem key={project} value={project}>
                    {project}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Người Giới Thiệu</InputLabel>
              <Select
                name="referrer"
                value={formData.referrer || ''}
                onChange={handleSelectChange}
                label="Người Giới Thiệu"
              >
                {referrers.map((ref) => (
                  <MenuItem key={ref} value={ref}>
                    {ref}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ghi Chú"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
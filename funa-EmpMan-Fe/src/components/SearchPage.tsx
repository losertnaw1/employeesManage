import { useState, FC } from 'react';
//import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@mui/material';

// Định nghĩa kiểu dữ liệu nhân viên (giả lập)
interface Employee {
  id: number;
  name: string;
  chineseLevel: string; // e.g., "HSK1", "HSK2", "HSK3",...
}

// Định nghĩa props
interface SearchPageProps {
  initialSearchCriteria?: string;
  initialFilters?: string[];
}

const SearchPage: FC<SearchPageProps> = ({
  initialSearchCriteria = 'name',
  //initialFilters = [],
}) => {
  //const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState<string>(initialSearchCriteria);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, string>>({}); // Thay đổi filters thành object để lưu giá trị cụ thể
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // Để hiển thị Popover
  const [activeFilter, setActiveFilter] = useState<string | null>(null); // Filter đang được chọn

  // Dữ liệu giả lập
  const employees: Employee[] = [
    { id: 1, name: 'Nguyễn Văn A', chineseLevel: 'HSK3' },
    { id: 2, name: 'Trần Thị B', chineseLevel: 'HSK2' },
    { id: 3, name: 'Lê Văn C', chineseLevel: 'HSK3' },
  ];

  // Các giá trị filter khả dụng
  const availableFilters = [
    {
      key: 'chineseLevel',
      label: 'Chinese Level',
      options: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'], // Giá trị cố định
    },
    { key: 'education', label: 'Education Level', options: ['High School', 'Bachelor', 'Master'] },
    { key: 'manager', label: 'Manager', options: ['Manager A', 'Manager B'] },
    { key: 'rank', label: 'Rank', options: ['Junior', 'Senior'] },
    { key: 'referrer', label: 'Referrer', options: ['HR', 'Friend'] },
  ];

  // Xử lý khi nhấn Chip để mở Popover
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>, filterKey: string) => {
    setAnchorEl(event.currentTarget);
    setActiveFilter(filterKey);
  };

  // Xử lý khi chọn một giá trị filter
  const handleFilterSelect = (filterKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setAnchorEl(null); // Đóng Popover
    setActiveFilter(null);
  };

  // Xóa filter
  const handleFilterDelete = (filterKey: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  // Lọc dữ liệu dựa trên filters
  const filteredEmployees = employees.filter((employee) => {
    return Object.entries(filters).every(([key, value]) => employee[key as keyof Employee] === value);
  });

  const handleSearch = () => {
    console.log(`Searching by ${searchCriteria}: ${searchQuery}, Filters:`, filters);
    console.log('Filtered Results:', filteredEmployees);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Search By</InputLabel>
            <Select
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value as string)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="phone">Phone Number</MenuItem>
              <MenuItem value="location">Work Location</MenuItem>
              <MenuItem value="chineseLevel">Chinese Level</MenuItem>
              <MenuItem value="education">Education Level</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="rank">Rank</MenuItem>
              <MenuItem value="skills">Skills</MenuItem>
              <MenuItem value="projects">Projects</MenuItem>
              <MenuItem value="referrer">Referrer</MenuItem>
              <MenuItem value="notes">Notes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Enter search keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        {availableFilters.map((filter) => (
          <Chip
            key={filter.key}
            label={filters[filter.key] ? `${filter.label}: ${filters[filter.key]}` : filter.label}
            onClick={(e) => handleFilterClick(e, filter.key)}
            onDelete={filters[filter.key] ? () => handleFilterDelete(filter.key) : undefined}
            color={filters[filter.key] ? 'primary' : 'default'}
            sx={{ m: 0.5, cursor: 'pointer' }}
          />
        ))}
      </Box>

      {/* Popover để chọn giá trị filter */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <List>
          {activeFilter &&
            availableFilters
              .find((f) => f.key === activeFilter)
              ?.options.map((option) => (
                <ListItem
                  key={option}
                  onClick={() => handleFilterSelect(activeFilter, option)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText primary={option} />
                </ListItem>
              ))}
        </List>
      </Popover>

      {/* Hiển thị kết quả lọc (giả lập) */}
      <Box sx={{ mt: 2 }}>
        <h3>Filtered Results:</h3>
        {filteredEmployees.map((emp) => (
          <div key={emp.id}>
            {emp.name} - {emp.chineseLevel}
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default SearchPage;
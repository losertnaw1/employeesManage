export interface Employee {
    _id: string;
    fullNameVi: string;
    fullNameCn: string;
    phoneNumber: string;
    mainWorkLocation: string; // ID, cần resolve từ locations
    chineseLevel: string; // ID, cần resolve từ chineseLevels
    educationLevel: string; // ID, cần resolve từ educationLevels
    projectManager: string;
    rank: string; // ID, cần resolve từ ranks
    skills: string[]; // Danh sách ID, cần resolve từ skills
    previousProjects?: string[]; // Danh sách ID, cần resolve từ projects
    referrer?: string; // ID, cần resolve từ referrers
    notes?: string; // Ghi chú, có thể không có
    createdAt: string;
    updatedAt: string;
  }
  
export interface LookupItem {
    _id: string;
    name: string;
  }
  
  export type Locations = LookupItem[]; // Danh sách địa điểm làm việc
  export type ChineseLevels = LookupItem[]; // Trình độ tiếng Trung
  export type EducationLevels = LookupItem[]; // Trình độ học vấn
  export type Ranks = LookupItem[]; // Cấp bậc nhân viên
  export type Skills = LookupItem[]; // Kỹ năng
  export type Projects = LookupItem[]; // Dự án
  export type Referrers = LookupItem[]; // Người giới thiệu
  
export interface Employee {
  _id: string;
  fullNameVi: string;
  fullNameCn: string;
  phoneNumber: string;
  mainWorkLocation: string;
  chineseLevel: string;
  educationLevel: string;
  projectManager: string;
  rank: string;
  skills: string[];
  previousProjects: string[];
  referrer: string;
  cvUrl?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

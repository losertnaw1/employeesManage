import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LookupState {
  chineseLevels: string[];
  educationLevels: string[];
  ranks: string[];
  skills: string[];
  locations: string[];
  referrers: string[];
}

const initialState: LookupState = {
  chineseLevels: ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'],
  educationLevels: ['THPT', 'CD', 'DH', 'ThS', 'TS'],
  ranks: ['INTERN', 'JUNIOR', 'SENIOR', 'LEAD', 'MANAGER'],
  skills: ['SKL01', 'SKL02', 'SKL03', 'SKL04', 'SKL05'],
  locations: ['HN', 'HCM', 'DN', 'HP', 'ND'],
  referrers: ['REF01', 'REF02', 'REF03'],
};

const lookupSlice = createSlice({
  name: 'lookup',
  initialState,
  reducers: {
    setLookupData: (state, action: PayloadAction<Partial<LookupState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setLookupData } = lookupSlice.actions;
export default lookupSlice.reducer;
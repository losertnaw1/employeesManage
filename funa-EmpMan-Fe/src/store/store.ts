import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';
import lookupReducer from './slices/lookupSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    lookup: lookupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
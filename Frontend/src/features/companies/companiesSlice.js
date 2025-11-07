import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import companiesService from './companiesService';

const initialState = {
  companies: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
};

export const getCompanies = createAsyncThunk(
  'companies/getAll',
  async ({ page = 1, limit } = {}, thunkAPI) => {
    try {
      return await companiesService.getCompanies(page, limit);
    } catch (error) {
      const message = (error.response && error.response.data && error.response.data.message) ||
        error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    resetCompaniesState: (state) => {
      state.companies = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.companies = action.payload;
        state.message = '';
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch companies';
        state.companies = null;
      });
  }
});

export const { resetCompaniesState } = companiesSlice.actions;
export default companiesSlice.reducer;
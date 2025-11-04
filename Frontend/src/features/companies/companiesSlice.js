import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import companiesService from './companiesService'

const initialState = {
    companies: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const getCompanies = createAsyncThunk('companies/getAll', async (arg, thunkAPI) => {
    try {
        return await companiesService.getCompanies();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    // Reducer : update state
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        // GET Companies
            .addCase(getCompanies.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCompanies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.companies = action.payload; // Data array
            })
            .addCase(getCompanies.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload; // Error msg
            })
    }
});

export const {reset} = companiesSlice.actions;
export default companiesSlice.reducer;
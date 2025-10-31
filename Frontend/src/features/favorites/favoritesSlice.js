import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import favoritesService from './favoritesService' 

const initialState = {
    favorites: [], 
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

export const getFavorites = createAsyncThunk('favorites/getAll', async (_, thunkAPI) => {
    try {
        return await favoritesService.getFavorites();
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const addFavorite = createAsyncThunk('favorites/add', async (companyId, thunkAPI) => {
    try {
        return await favoritesService.addFavorite(companyId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (companyId, thunkAPI) => {
    try {
        return await favoritesService.removeFavorite(companyId);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const favoritesSlice = createSlice({
    name: 'favorites', 
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        // GET Favorites
            .addCase(getFavorites.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFavorites.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.favorites = action.payload;
            })
            .addCase(getFavorites.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
        // ADD Favorite
            .addCase(addFavorite.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.favorites.push(action.payload); 
            })
            .addCase(addFavorite.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
        // DELETE Favorite
            .addCase(removeFavorite.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.favorites = state.favorites.filter(
                    // If dispatch(removeFavorite("id-B")), then action.meta.arg is "id-B"
                    (company) => company._id !== action.meta.arg
                );
            })
            .addCase(removeFavorite.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
});

export default favoritesSlice.reducer;
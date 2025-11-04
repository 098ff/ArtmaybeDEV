import {configureStore} from '@reduxjs/toolkit'
import companiesReducer from '../features/companies/companiesSlice'
import favoritesReducer from '../features/favorites/favoritesSlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        companies: companiesReducer,
        favorites: favoritesReducer,
    },
});
import {configureStore} from '@reduxjs/toolkit'
import companiesReducer from '../features/companies/companiesSlice' // Import for use Reducer
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
    reducer: {
        companies: companiesReducer,
        auth: authReducer,
    },
});
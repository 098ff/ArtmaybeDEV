import {configureStore} from '@reduxjs/toolkit'
import companiesReducer from '../features/companies/companiesSlice' // Import for use Reducer

export const store = configureStore({
    reducer: {
        companies: companiesReducer,
    },
});
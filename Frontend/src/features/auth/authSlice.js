import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localStorage
// const user = JSON.parse(localStorage.getItem('user'))

// เก็บว่า user คนไหนเป็นคนที่ login อยู่
const user = localStorage.getItem('user');

const initialState = {
    user: user? user: null,
    // user: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// เกี่ยวกับ AsyncThunk
// เสมือนคนส่งของ มี 3 สถานะ: .pending .fulfilled .rejected

// Register user
export const register = createAsyncThunk('auth/register', async(user, thunkAPI) => {

    // ดูว่า user คนไหนที่ส่งเข้ามา
    console.log(user);

    try {
        // ลองเชื่อมต่อกับ api
        return await authService.register(user);
    }
    catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Login user
export const login = createAsyncThunk('auth/login', async(user, thunkAPI) => {
    try {
        return await authService.login(user);
    }
    catch {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async() => {
    await authService.logout();
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // แต่ละ Slice จะมี reducers ของตัวเอง
    // Reducer คือ ฟังก์ชันที่ทำหน้าที่เปลี่ยนแปลง state    
    reducers: {
        // Reducer ตั้งต้นที่ใ้ช reset state
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder.addCase(register.pending, (state) => {
            // เมื่อ AsyncThunk เริ่มออกเดินทาง >> ถือว่ากำลัง Load
            state.isLoading = true;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload; // action.payload คือ ข้อมูลที่ return มาจาก authService.register(user) ซึ่งคือ api ที่เราส่ง user ไปขอข้อมูล
        })
        .addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null;
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.user = action.payload;
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            state.user = null
        })
        .addCase(logout.fulfilled, (state) => {
            state.user = null;
        })
    },
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;
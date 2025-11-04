import axios from 'axios'

const API_URL = 'http://localhost:5003/api/auth/'

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    console.log(response.data);
    return response.data;
}

// Logout user
const logout = () => {
    localStorage.removeItem('user');
}

const authService = {
    logout,
    login
}

export default authService;
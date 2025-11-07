import axios from 'axios';

const API_URL = 'http://localhost:5003/api/users/me/favorites';

const getAuthConfig = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// GET favorites
const getFavorites = async () => {
    try {
        const config = getAuthConfig();
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        console.log('favoritesService: getFavorites', error.response?.data);
        throw error.response?.data || error;
    }
};

// POST favorite (add)
const addFavorite = async (companyId) => {
    const body = { companyId };
    try {
        const config = getAuthConfig();
        const response = await axios.post(API_URL, body, config);
        return response.data;
    } catch (error) {
        console.log('favoritesService: addFavorite', error.response?.data);
        throw error.response?.data || error;
    }
};

// DELETE favorite (remove)
const removeFavorite = async (companyId) => {
    try {
        const config = getAuthConfig();
        const response = await axios.delete(`${API_URL}/${companyId}`, config);
        return response.data;
    } catch (error) {
        console.log('favoritesService: removeFavorite', error.response?.data);
        throw error.response?.data || error;
    }
};

const favoriteService = {
    getFavorites,
    addFavorite,
    removeFavorite,
};

export default favoriteService;
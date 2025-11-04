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

// POST favorite
const createFavorite = async (companyId) => {
    const body = { companyId };
    try {
        const config = getAuthConfig();
        const response = await axios.post(API_URL, body, config);
        return response.data;
    } catch (error) {
        console.log('favoritesService: createFavorite', error.response?.data);
        throw error.response?.data || error;
    }
};

// DELETE favorite
const deleteFavorites = async (companyId) => {
    try {
        const config = getAuthConfig();
        const response = await axios.delete(`${API_URL}/${companyId}`, config);
        return response.data;
    } catch (error) {
        console.log('favoritesService: deleteFavorites', error.response?.data);
        throw error.response?.data || error;
    }
};

const favoriteService = {
    getFavorites,
    createFavorite,
    deleteFavorites,
};

export default favoriteService;

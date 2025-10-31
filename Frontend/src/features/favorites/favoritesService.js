import axios from 'axios';

const API_URL = 'http://localhost:5003/api/v1/favorites';

// TODO: Pagination
const getFavorites = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    }
    catch (error) {
        console.log('favoritesService: getFavorites');
        throw error;
    }
};

// TODO: Pagination
const deleteFavorites = async (companyId) => {
    try {
        const response = await axios.delete(API_URL + "/" + companyId);
        return response.data;
    }
    catch (error) {
        console.log('favoritesService: deleteFavorites');
        throw error;
    }
};

const favotiteService = {
    getFavorites,
    deleteFavorites,
};
export default favotiteService;
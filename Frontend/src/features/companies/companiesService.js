import axios from 'axios';

const API_URL = 'http://localhost:5003/api/v1/';

const getCompanies = async (page = 1, limit = 6) => {
    try {
        const response = await axios.get(API_URL + `companies?page=${page}&limit=${limit}`);
        return response.data;
    }
    catch (error) {
        console.log('companiesService: getCompanies');
        throw error;
    }
};

const companyService = {
    getCompanies,
};
export default companyService;
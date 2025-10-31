import axios from 'axios';

const API_URL = 'http://localhost:5003/api/v1/';

const getCompanies = async () => {
    try {
        //  Fetch GET companies api
        const response = await axios.get(API_URL + 'companies/');
        console.log(JSON.stringify(response.data));
        // .data แรกคือของ axios .data ที่สองคือของที่ api ส่งมา
        return response.data.data;
    }
    catch (error) {
        console.log('companiesService: getCompanies');
        console.log(error);
    }
};

const companyService = {
    getCompanies,
};
export default companyService;
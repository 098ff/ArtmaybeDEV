import axios from 'axios';

const API_URL = 'http://localhost:5003/api/companies';

const getCompanies = async (page = 1, limit) => {
  const params = new URLSearchParams({ page: String(page) });
  if (limit != null) params.append('limit', String(limit));
  const response = await axios.get(`${API_URL}?${params.toString()}`);
  return response.data;
};

const companiesService = {
  getCompanies,
};

export default companiesService;
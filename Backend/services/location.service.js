const axios = require('axios');

const LONGDO_API_KEY = process.env.LONGDO_MAP_KEY;
const ROUTE_API_URL = 'https://api.longdo.com/RouteService/json/route/guide';

const getRouteDistance = async (origin, destination) => {
    if (!LONGDO_API_KEY) {
        console.error('LONGDO_MAP_KEY is not defined in .env');
        return null;
    }

    // 1. Create URL for call an API
    // mode=t --> Fastest route & Avoid traffic (Real-time)
    // type=1 --> allow travel by road (not allow Ferry & Tollway)
    // restrict --> No vehicle restrict
    // locale --> Thai lang
    const url = `${ROUTE_API_URL}?flon=${origin.lon}&flat=${origin.lat}&tlon=${destination.lon}&tlat=${destination.lat}&mode=t&type=1&restrict=0&locale=th&key=${LONGDO_API_KEY}`;

    try {
        // 2. Call an API by axios
        const response = await axios.get(url);

        // 3. Check response data
        const data = response.data.data;
        if (data && data[0].distance) {
            const distance_km = data[0].distance / 1000; 

            return {
                distance_km: parseFloat(distance_km.toFixed(2))
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Longdo API Error: ${error.message}`);
        return null;
    }
};

module.exports = {
    getRouteDistance
};
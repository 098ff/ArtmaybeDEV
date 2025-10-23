// Import model for using here!
const Company = require('../models/Company');
const User = require('../models/User');
const locationService = require('../services/location.service');
// TODO : Implement Booking model for populate Booking info into Company info
// const Booking = require('../models/Booking');

// @desc    GET all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };

    // Fields to exclude for process on > < = first
    const removeFields = ['select', 'sort', 'page', 'limit'];

    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // TODO : Finding resources when populate (If booking is done you the commented code instead)
    // query = Company.find(JSON.parse(queryStr)).populate(`bookings`); // Convert back into Object for send to find()
    query = Company.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' '); // Converting from 'name,address' into 'name address'
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' '); // Converting from 'name,address' into 'name address'
        query = query.sort(sortBy);
    } else {
        // Default sort by no min to max
        query = query.sort('no');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1; // Default page val = 1
    const limit = parseInt(req.query.limit, 10) || 25; // Default limit val = 25
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Company.countDocuments();

    query = query.skip(startIndex).limit(limit);

    try {
        // Execute query
        const companies = await query;
        console.log(req.query);

        // Pagination result
        const pagination = {};

        // In case: having next page
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            }
        }

        // In case : having previous page
        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            }
        }

        res.status(200).json({ success: true, count: companies.length, pagination, data: companies });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    GET single Company
// @route   GET /api/v1/companies/:id
// @access  Public
exports.getCompany = async (req, res, next) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: company });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};

// @desc    Search companies by REAL driving distance
// @route   GET /api/companies/search/dist
// @access  Private
exports.getCompaniesbyDistance = async (req, res, next) => {
    try {
        // 1. Receive Max Distance from user
        const maxDrivingDistanceKm = parseFloat(req.query.distance || 20); // Default = 20 km

        // 2. Setup board radius (x3) for filter some company that might be in user distance
        const searchRadiusKm = maxDrivingDistanceKm * 3;
        const searchRadiusMeters = searchRadiusKm * 1000;

        // 3. Find User & User's location
        const user = await User.findById(req.user.id).select('location');
        if (!user.location || !user.location.coordinates) {
            return res.status(400).json({
                success: false,
                message: 'User does not have a location.'
            });
        }

        const userGeoPoint = user.location; // GeoJSON Point for MongoDB
        const userOrigin = {               // {lat, lon} for Longdo Service
            lon: user.location.coordinates[0],
            lat: user.location.coordinates[1]
        };

        // 4. Filter by MongoDB (use $near)
        const candidateCompanies = await Company.find({
            location: {
                $near: {
                    $geometry: userGeoPoint,
                    $maxDistance: searchRadiusMeters
                }
            }
        }).select('name location address');

        // If MongoDB return 0 records, then there's no company in User's distance
        if (candidateCompanies.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: []
            });
        }

        // 5. Call OpenAPI from Longdo map via our service
        const distancePromises = candidateCompanies.map(company => {
            const companyDest = {
                lon: company.location.coordinates[0],
                lat: company.location.coordinates[1]
            };

            // Call our service
            return locationService.getRouteDistance(userOrigin, companyDest)
                .then(routeInfo => {
                    if (routeInfo) {
                        return {
                            ...company.toObject(),
                            distance: routeInfo.distance_km
                        };
                    }
                    return null; // In case : Longdo API no route found
                });
        });

        // 6. Wait for Longdo API response all
        let companiesWithDistances = await Promise.all(distancePromises);

        // 7. Filtering response data
        const finalCompanies = companiesWithDistances
            // Filter out err data or null
            .filter(c => c !== null) 
            // Filter by user's distance
            .filter(c => c.distance <= maxDrivingDistanceKm)
            // Sort from near -> far
            .sort((a, b) => a.distance - b.distance); 

        res.status(200).json({
            success: true,
            count: finalCompanies.length,
            data: finalCompanies
        });

    } catch (err) {
        res.status(400).json({ success: false });
    }
};
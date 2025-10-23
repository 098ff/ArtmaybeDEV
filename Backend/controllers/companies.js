// Import model for using here!
const Company = require('../models/Company');
// TODO : Implement Booking model for populate Booking info into Company info
// const Booking = require('../models/Booking');

// @desc    GET all companies
// @route   GET /api/v1/companies
// @access  Public
exports.getCompanies = async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = {...req.query};

    // Fields to exclude เอาออกเพราะต้องการจัดการกับการ query > < = ก่อน
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Convert gt, gte, lt, lte, in into $gt, $gte, $lt, $lte, $in in Regular Expression format by //g
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`); // \b = word boundary e.g. [] {} , ()
    // Finding resources
    query = Company.find(JSON.parse(queryStr)).populate(`appointments`); // Convert back into Object for send to find()

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
    const startIndex = (page - 1)*limit;
    const endIndex = page*limit;
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
        const company = await company.findById(req.params.id);

        if (!company) {
            return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: company });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
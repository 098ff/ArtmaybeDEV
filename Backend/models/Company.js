const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please add a company name"],
        unique: true,
        trim: true,
        maxlength: [50, "Company name cna not be more than 50 characters"]
    },
    address: {
        type: String, 
        required: [true, "Please add an address"]
    },
    website: {
        type: String,
        required: [true, "Please add a website"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true
    },
    telephone: {
        type: String,
        required: [true, "Please add a telephone"]
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // Array of numbers [longitude, latitude]
            // index: '2dsphere'
        }
    },
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
CompanySchema.index({ location: '2dsphere' });
// TODO : Populate Booking data to nested in Company data (Waiting for finish booking api)
// BookingSchema.virtual(`bookings`, {
//     ref: `Booking`,
//     localField: `_id`,
//     foreignField: `company`,
//     justOne: false // fetch data in array (not just 1 data)
// });

module.exports = mongoose.model("Company", CompanySchema);
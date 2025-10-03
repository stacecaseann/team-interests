const mongoose = require("mongoose");
const validator = require("validator")

const speakerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "The speakers first name is required!"],
        validate: {
            validator: (v) => validator.isLength(v, {min: 2, max: 30}),
            message: (props) =>
                `${props.value} is not valid. The name has to be between 2 and 30 characters`
        },
    },
    lastName: {
        type: String,
        required: [true, "The speakers last name is required!"],
        validate: {
            validator: (v) => validator.isLength(v, {min: 2, max: 30}),
            message: (props) =>
                `${props.value} is not valid. The last name has to be between 2 and 30 characters!`
        }
    },
    age: {
        type: Number,
        required: [true, "The age of the speaker is required!"],
        validate: {
            validator: (v) => Number.isInteger(v),
            message: (props) =>
                `${props.value} is not a valid number. Age must be a number!`
        }
    },
    birthYear: {
        type: Number,
        required: [true, "The birth year of the speaker is required!"],
        validate: {
            validator: (v) => Number.isInteger(v) &&
            v > 1900 &&
            v <= new Date().getFullYear(),
            message: (props) => 
                `${props.value} is not a valid year. Please enter a valid year!`
        }
    },
    quote: {
        type: String,
        required: [true, "The quote of the speaker is required!"],
        validate: {
            validator: (v) => validator.isLength(v, {min: 5, max: 700}),
            message: (props) =>
                `${props.value} is not valid. Please make sure your quote is between 5 and 700 characters!`
        }
    }
});

module.exports = mongoose.model("Speaker", speakerSchema);
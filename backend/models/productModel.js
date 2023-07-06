//importing required files
const mongoose = require("mongoose");

//initializing product schema
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please enter product name"],
        trim: true
    },
     description:{
        type: String,
        required:[true, "Please enter product description"]
    },
    price:{
        type: Number,
        required:[true, "Please enter product price"],
        maxLength:[8, "price cannot exceed 8 figures"]
    },
    ratings:{
        type: Number,
        default: 0,
        range: [0, 5, 1]
    },
    images:[{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    }],
    category:{
        type: String,
        required:[true, "please provide product category"],
    },
    stock:{
        type: Number,
        default:1,
        maxLength: [3, "price cannot exceed 999"]
    },
    noOfReviews:{
        type: Number,
        default: 0,
    },
    reviews:[{
        user:{
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        name:{
            type: String,
            required: true
        },
        rating:{
            type: String,
            required: true
        },
        comments:{
            type: String,
            required: true
        }
    }],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

//exporting the model
module.exports = mongoose.model("Product", productSchema)
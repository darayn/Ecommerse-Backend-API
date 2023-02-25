const Product = require("../models/product")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require('cloudinary');
const WhereClause = require("../utils/whereClause");

exports.addProduct = BigPromise(async (req,res, next) => {
    // images
    let imageArray = []

    if (!req.files) {
        return next(new CustomError('Images are required', 401))
    }

    if(req.files){
        for (let index = 0; index < req.files.length; index++) {
            let result = await cloudinary.v2.uploader.upload(req.files.photos[index]
                .tempFilePath, {
                    folder: "products"
                })
            imageArray.push({
                id: result.pubic_id,
                secure_url: result.secure_url
            })
            
        }
    }

    req.body.photos = imageArray
    req.body.user = req.user.id

    const Product = await Product.create(req.body)
    res.status(200).json({
        success: true,
        product: Product
    })
})

exports.getAllProduct = BigPromise(async(req,res,next) => {
    const resultPerPage = 6
    // const totalcountProduct = await Product.countDocuments()


    
    const products = new WhereClause(Product.find(), req.query).search().filter();

    const filteredProductNumber = products.length

    products.pager(resultPerPage)
    products = await products.base

    res.status(200).json({
        success: true,
        products: products,
        filteredProductNumber: filteredProductNumber,
        totalcountProduct: totalcountProduct
    })
})
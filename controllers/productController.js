const Product = require("../models/product")
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require('cloudinary');
const WhereClause = require("../utils/whereClause");
const product = require("../models/product");

exports.addProduct = BigPromise(async (req,res, next) => {
    // images
    let imageArray = []

    if (!req.files) {
        return next(new CustomError('Images are required', 401))
    }

    if(req.files){
        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.v2.uploader.upload(
              req.files.photos[index].tempFilePath,
              {
                folder: "products",
              }
            );
            imageArray.push({
                secure_url: result.secure_url,
                id: result.public_id,
            });
            
        }
    }

    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product,
    });
});

exports.getAllProduct = BigPromise(async(req,res,next) => {
    const resultPerPage = 6
    const totalcountProduct = await Product.countDocuments()


    
    const productsObj = new WhereClause(Product.find(), req.query).search().filter();

    let products = await productsObj.base

    const filteredProductNumber = products.length

    productsObj.pager(resultPerPage)
    products = await productsObj.base.clone()

    res.status(200).json({
        success: true,
        products: products,
        filteredProductNumber: filteredProductNumber,
        totalcountProduct: totalcountProduct
    })
})

exports.getOneProduct = BigPromise(async(req,res,next) => {
    const product = await Product.findById(req.params.id)

    if (!product){
        return next(new CustomError('No Product found with this id', 401))
    }
    res.status(200).json({
        success: true,
        product: product
    })
})

exports.adminGetAllProduct = BigPromise(async(req,res,next) => {
    const products = await Product.find()
    if(!products){
        res.status(400).json({
            success: false,
            message: "No Products Found",
            products
        })
    }
    res.status(200).json({
        success: true,
        products
    })
})

exports.adminUpdateOneProduct = BigPromise(async(req,res,next) => {
    
    const product = await Product.findById(req.params.id)

    if (!product){
        return next(new CustomError('No Product found with this id', 401))
    }

    let imagesArray = []

    if(req.files){
        // destroy the existing image
        for (let index = 0; index < product.photos.length; index++) {
            const res = await cloudinary.v2.uploader.destroy(product.photos[index].id)
        }

        // upload and save the images

        
        if (!req.files) {
          return next(new CustomError("Images are required", 401));
        }

        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.v2.uploader.upload(
                req.files.photos[index].tempFilePath,
                {
                    folder: process.env.FOLDERNAME, //folder name in .env
                }
            );
            imagesArray.push({
                secure_url: result.secure_url,
                id: result.public_id,
            });
        }

    }

    req.body.photos = imagesArray
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
})